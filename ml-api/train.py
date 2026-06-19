import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_absolute_error
import joblib

def main():
    data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'House Price Dataset.csv')
    df = pd.read_csv(data_path)
    
    # Drop id
    if 'id' in df.columns:
        df = df.drop(columns=['id'])
    
    # Define features and target
    X = df.drop(columns=['price'])
    y = df['price']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('model', LinearRegression())
    ])
    
    pipeline.fit(X_train, y_train)
    
    y_pred = pipeline.predict(X_test)
    
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    
    print(f"Model trained successfully.")
    print(f"R2 Score: {r2:.4f}")
    print(f"MAE: {mae:.4f}")
    
    model_path = os.path.join(os.path.dirname(__file__), 'model.joblib')
    joblib.dump(pipeline, model_path)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    main()
