# Import libraries
from gector.gec_model import GecBERTModel

# Create an instance of the model
model = GecBERTModel(
    vocab_path="./data/vocabulary",
    model_paths=[
        "./models/deberta-large_1_best_10k.th",
        "./models/roberta-large_1_best_10k.th",
        "./models/xlnet-large_1_best_10k.th",
    ],
)

# Add the sentence with grammatical errors
text = "This is pens."

# Create an empty list to store the
batch = []
batch.append(text.split())
final_batch, total_updates = model.handle_batch(batch)
corrected_text = " ".join(final_batch[0])
print(f"Original text: {text}")
print(f"Corrected text: {corrected_text}")
