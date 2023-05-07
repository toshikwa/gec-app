from pydantic import BaseModel, Field


class InferenceInput(BaseModel):
    text: str = Field(
        ...,
        example="she looks at sky yesterday whil brushed her hair",
        title="Input text",
    )


class InferenceResponse(BaseModel):
    text: str = ...


class HealthResponse(BaseModel):
    status: str = ...
