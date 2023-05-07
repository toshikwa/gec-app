"""Tweaked version of corresponding AllenNLP file"""
import copy
import logging
from collections import defaultdict
from typing import Dict, List, Callable

from allennlp.common.util import pad_sequence_to_length
from allennlp.data.token_indexers.token_indexer import TokenIndexer
from allennlp.data.tokenizers.token import Token
from allennlp.data.vocabulary import Vocabulary
from overrides import overrides
from transformers import AutoTokenizer

from gector.helpers import START_TOKEN
from gector.tokenization import tokenize_batch

logger = logging.getLogger(__name__)

# This is the default list of tokens that should not be lowercased.
_NEVER_LOWERCASE = ["[UNK]", "[SEP]", "[PAD]", "[CLS]", "[MASK]"]


class WordpieceIndexer(TokenIndexer[int]):
    def __init__(
        self,
        tokenizer: Callable[[str], List[str]],
        vocab: Dict[str, int],
        bpe_ranks: Dict,
        byte_encoder: Dict,
        wordpiece_tokenizer: Callable[[str], List[str]],
        namespace: str = "wordpiece",
        use_starting_offsets: bool = False,
        max_pieces: int = 512,
        max_pieces_per_token: int = 3,
        is_test=False,
        do_lowercase: bool = False,
        never_lowercase: List[str] = None,
        start_tokens: List[str] = None,
        end_tokens: List[str] = None,
        truncate_long_sequences: bool = True,
        token_min_padding_length: int = 0,
    ) -> None:
        super().__init__(token_min_padding_length)
        self.vocab = vocab
        self.tokenizer = tokenizer
        self.wordpiece_tokenizer = wordpiece_tokenizer
        self.max_pieces_per_token = max_pieces_per_token
        self._namespace = namespace
        self._added_to_vocabulary = False
        self.max_pieces = max_pieces
        self.use_starting_offsets = use_starting_offsets
        self._do_lowercase = do_lowercase
        self._truncate_long_sequences = truncate_long_sequences
        self.max_pieces_per_sentence = 80
        self.is_test = is_test
        self.cache = {}
        self.bpe_ranks = bpe_ranks
        self.byte_encoder = byte_encoder

        if never_lowercase is None:
            self._never_lowercase = set(_NEVER_LOWERCASE)
        else:
            self._never_lowercase = set(never_lowercase)

        # Convert the start_tokens and end_tokens to wordpiece_ids
        self._start_piece_ids = [
            vocab[wordpiece] for token in (start_tokens or []) for wordpiece in wordpiece_tokenizer(token)
        ]
        self._end_piece_ids = [vocab[wordpiece] for token in (end_tokens or []) for wordpiece in wordpiece_tokenizer(token)]

    @overrides
    def count_vocab_items(self, token: Token, counter: Dict[str, Dict[str, int]]):
        # If we only use pretrained models, we don't need to do anything here.
        pass

    def _add_encoding_to_vocabulary(self, vocabulary: Vocabulary) -> None:
        # pylint: disable=protected-access
        for word, idx in self.vocab.items():
            vocabulary._token_to_index[self._namespace][word] = idx
            vocabulary._index_to_token[self._namespace][idx] = word

    @overrides
    def tokens_to_indices(self, tokens: List[Token], vocabulary: Vocabulary, index_name: str) -> Dict[str, List[int]]:
        text = [token.text for token in tokens]
        batch_tokens = [text]

        output_fast = tokenize_batch(
            self.tokenizer, batch_tokens, max_bpe_length=self.max_pieces, max_bpe_pieces=self.max_pieces_per_token
        )
        output_fast = {k: v[0] for k, v in output_fast.items()}
        return output_fast

    def _add_start_and_end(self, wordpiece_ids: List[int]) -> List[int]:
        return self._start_piece_ids + wordpiece_ids + self._end_piece_ids

    def _extend(self, token_type_ids: List[int]) -> List[int]:
        """
        Extend the token type ids by len(start_piece_ids) on the left
        and len(end_piece_ids) on the right.
        """
        first = token_type_ids[0]
        last = token_type_ids[-1]
        return [first for _ in self._start_piece_ids] + token_type_ids + [last for _ in self._end_piece_ids]

    @overrides
    def get_padding_token(self) -> int:
        return 0

    @overrides
    def get_padding_lengths(self, token: int) -> Dict[str, int]:  # pylint: disable=unused-argument
        return {}

    @overrides
    def pad_token_sequence(
        self, tokens: Dict[str, List[int]], desired_num_tokens: Dict[str, int], padding_lengths: Dict[str, int]
    ) -> Dict[str, List[int]]:  # pylint: disable=unused-argument
        return {key: pad_sequence_to_length(val, desired_num_tokens[key]) for key, val in tokens.items()}

    @overrides
    def get_keys(self, index_name: str) -> List[str]:
        """
        We need to override this because the indexer generates multiple keys.
        """
        # pylint: disable=no-self-use
        return [index_name, f"{index_name}-offsets", f"{index_name}-type-ids", "mask"]


class PretrainedBertIndexer(WordpieceIndexer):
    # pylint: disable=line-too-long
    def __init__(
        self,
        pretrained_model: str,
        use_starting_offsets: bool = False,
        do_lowercase: bool = True,
        never_lowercase: List[str] = None,
        max_pieces: int = 512,
        max_pieces_per_token=5,
        is_test=False,
        truncate_long_sequences: bool = True,
        special_tokens_fix: int = 0,
    ) -> None:
        if pretrained_model.endswith("-cased") and do_lowercase:
            logger.warning("Your BERT model appears to be cased, " "but your indexer is lowercasing tokens.")
        elif pretrained_model.endswith("-uncased") and not do_lowercase:
            logger.warning("Your BERT model appears to be uncased, " "but your indexer is not lowercasing tokens.")

        model_name = copy.deepcopy(pretrained_model)

        if pretrained_model == "microsoft/deberta-base":
            model_name = "roberta-base"
        if pretrained_model == "microsoft/deberta-large":
            model_name = "roberta-large"
        if pretrained_model == "microsoft/deberta-xx-large":
            model_name = "roberta-large"
        if pretrained_model == "microsoft/deberta-xlarge":
            model_name = "roberta-large"

        bert_tokenizer = AutoTokenizer.from_pretrained(
            model_name, do_lower_case=do_lowercase, do_basic_tokenize=False, use_fast=True
        )

        # to adjust all tokenizers
        if hasattr(bert_tokenizer, "encoder"):
            bert_tokenizer.vocab = bert_tokenizer.encoder
        if hasattr(bert_tokenizer, "sp_model"):
            bert_tokenizer.vocab = defaultdict(lambda: 1)
            for i in range(bert_tokenizer.sp_model.get_piece_size()):
                bert_tokenizer.vocab[bert_tokenizer.sp_model.id_to_piece(i)] = i

        if special_tokens_fix:
            bert_tokenizer.add_tokens([START_TOKEN])
            bert_tokenizer.vocab[START_TOKEN] = len(bert_tokenizer) - 1

        #             byte_encoder = None
        bpe_ranks = {}
        byte_encoder = None

        super().__init__(
            tokenizer=bert_tokenizer,
            vocab=bert_tokenizer.vocab,
            bpe_ranks=bpe_ranks,
            byte_encoder=byte_encoder,
            wordpiece_tokenizer=bert_tokenizer.tokenize,
            namespace="bert",
            use_starting_offsets=use_starting_offsets,
            max_pieces=max_pieces,
            max_pieces_per_token=max_pieces_per_token,
            is_test=is_test,
            do_lowercase=do_lowercase,
            never_lowercase=never_lowercase,
            start_tokens=["[CLS]"] if not special_tokens_fix else [],
            end_tokens=["[SEP]"] if not special_tokens_fix else [],
            truncate_long_sequences=truncate_long_sequences,
        )
