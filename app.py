from fastapi import FastAPI
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
from model_utils import predict

app = FastAPI(title="Credit Risk Prediction API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class InputData(BaseModel):
    person_age: int
    person_income: int
    person_home_ownership: str
    person_emp_length: float | None = Field(default=None)
    loan_intent: str
    loan_grade: str
    loan_amnt: int
    loan_int_rate: float | None = Field(default=None)
    loan_status: int
    loan_percent_income: float
    cb_person_default_on_file: str
    cb_person_cred_hist_length: int

@app.post("/predict")
def make_prediction(data: InputData):
    input_dict = data.dict()
    result = predict(input_dict)
    return result


