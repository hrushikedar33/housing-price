from pydantic import BaseModel, Field
from typing import List

class EstimateRequest(BaseModel):
    square_footage: float = Field(..., gt=0)
    bedrooms: int = Field(..., ge=0)
    bathrooms: float = Field(..., ge=0)
    year_built: int = Field(..., ge=1800, le=2100)
    lot_size: float = Field(..., ge=0)
    distance_to_city_center: float = Field(..., ge=0)
    school_rating: float = Field(..., ge=0, le=10)

class BatchEstimateRequest(BaseModel):
    items: List[EstimateRequest]

class EstimateResponse(BaseModel):
    price: float

class BatchEstimateResponse(BaseModel):
    prices: List[float]
