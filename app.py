from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI(title="Crop Recommendation API")

# Allow everything for local demo (K8s + random ports)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # open for all origins
    allow_credentials=True,
    allow_methods=["*"],       # allow all HTTP methods, including OPTIONS
    allow_headers=["*"],
)

# Load model once
model = joblib.load("model.pkl")


class CropInput(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float


@app.get("/")
async def root():
    return {"message": "Crop Recommendation API is running"}


@app.post("/predict")
async def predict_crop(data: CropInput):
    input_df = pd.DataFrame(
        [
            {
                "N": data.N,
                "P": data.P,
                "K": data.K,
                "temperature": data.temperature,
                "humidity": data.humidity,
                "ph": data.ph,
                "rainfall": data.rainfall,
            }
        ]
    )
    prediction = model.predict(input_df)[0]
    return {
        "input": data.dict(),
        "recommended_crop": prediction,
    }