import os
import joblib
import pandas as pd
from typing import List, Dict

model = None

def load_model():
    global model
    model_path = os.path.join(os.path.dirname(__file__), '..', 'model.joblib')
    if os.path.exists(model_path):
        model = joblib.load(model_path)
    else:
        # try to train if not exists
        import sys
        sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
        import train
        train.main()
        model = joblib.load(model_path)

def predict(features: List[Dict]) -> List[float]:
    if model is None:
        load_model()
    df = pd.DataFrame(features)
    # Ensure correct columns order
    cols = ['square_footage', 'bedrooms', 'bathrooms', 'year_built', 'lot_size', 'distance_to_city_center', 'school_rating']
    df = df[cols]
    preds = model.predict(df)
    return [round(p, 2) for p in preds]
