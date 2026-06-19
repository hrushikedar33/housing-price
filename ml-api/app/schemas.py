from pydantic import BaseModel, Field
from typing import List, Union

class HouseFeatures(BaseModel):
    square_footage: float = Field(..., gt=0, description="Square footage of the house")
    bedrooms: int = Field(..., ge=0, description="Number of bedrooms")
    bathrooms: float = Field(..., ge=0, description="Number of bathrooms")
    year_built: int = Field(..., ge=1800, le=2100, description="Year the house was built")
    lot_size: float = Field(..., ge=0, description="Lot size in square feet")
    distance_to_city_center: float = Field(..., ge=0, description="Distance to city center in miles")
    school_rating: float = Field(..., ge=0, le=10, description="School rating from 0 to 10")

class BatchRequest(BaseModel):
    items: List[HouseFeatures]

class PredictionResponse(BaseModel):
    price: float

class BatchPredictionResponse(BaseModel):
    prices: List[float]
