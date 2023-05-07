#!/usr/bin/env python -W ignore::DeprecationWarning
# -*- coding: utf-8 -*-

import logging
import glob
import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from gector.gec_model import GecBERTModel
from schema import HealthResponse, InferenceInput, InferenceResponse


logger = logging.getLogger(__name__)
app = FastAPI(
    title="gec-app",
    description="Grammatical Error Correction",
    version="0.0.1",
    terms_of_service=None,
    contact=None,
    license_info=None,
)

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


def correct_grammar(model, text):
    batches = text.replace(".", " .").split("\n")
    batches = [batch.split() for batch in batches]
    responses, _ = model.handle_batch(batches)
    responses = [" ".join(response) for response in responses]
    return "\n".join(responses).replace(" .", ".")


@app.on_event("startup")
async def startup_event():
    model_paths = glob.glob("/app/models/*.th")
    model = GecBERTModel(
        vocab_path="/app/data/output_vocabulary",
        model_paths=model_paths,
    )
    app.package = {"model": model}


@app.post("/api/v1/predict")
def do_predict(_: Request, body: InferenceInput) -> InferenceResponse:
    logger.info(f"input text: {body.text}")
    text = correct_grammar(app.package["model"], body.text)
    logger.info(f"corrected text: {text}")
    return {"text": text}


@app.get("/health")
def health(_: Request) -> HealthResponse:
    return {"status": "ok"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
