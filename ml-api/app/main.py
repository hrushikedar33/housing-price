from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from typing import Union
from app.schemas import HouseFeatures, BatchRequest, PredictionResponse, BatchPredictionResponse
import app.model as model_module
from app.model import load_model, predict

@asynccontextmanager
async def lifespan(app: FastAPI):
    load_model()
    yield

app = FastAPI(title="ML API for Housing Price Prediction", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model_module.model is not None}

@app.post("/predict", response_model=Union[PredictionResponse, BatchPredictionResponse])
def predict_endpoint(request: Union[HouseFeatures, BatchRequest]):
    if isinstance(request, BatchRequest):
        features = [req.model_dump() for req in request.items]
        preds = predict(features)
        return {"prices": preds}
    elif isinstance(request, HouseFeatures):
        features = [request.model_dump()]
        preds = predict(features)
        return {"price": preds[0]}
    
    raise HTTPException(status_code=400, detail="Invalid request")
