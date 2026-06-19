import os
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Union
from app.schemas import EstimateRequest, BatchEstimateRequest, EstimateResponse, BatchEstimateResponse

app = FastAPI(title="App 1 BFF (Estimator)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ML_API_URL = os.getenv("ML_API_URL", "http://localhost:8000")

@app.get("/health")
def health():
    return {"status": "ok", "service": "app1-backend"}

@app.post("/estimate", response_model=Union[EstimateResponse, BatchEstimateResponse])
async def estimate(request: Union[EstimateRequest, BatchEstimateRequest]):
    async with httpx.AsyncClient() as client:
        try:
            if isinstance(request, BatchEstimateRequest):
                payload = request.model_dump()
                response = await client.post(f"{ML_API_URL}/predict", json=payload)
                response.raise_for_status()
                return response.json()
            else:
                payload = request.model_dump()
                response = await client.post(f"{ML_API_URL}/predict", json=payload)
                response.raise_for_status()
                return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"Upstream ML API error: {e.response.text}")
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"Could not connect to ML API: {str(e)}")
