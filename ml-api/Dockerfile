FROM python:3.11-slim

WORKDIR /workspace

COPY ml-api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY data/ ./data/
COPY ml-api/ ./ml-api/

WORKDIR /workspace/ml-api

# Train the model; saves model.joblib at ml-api/model.joblib
RUN python train.py

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
