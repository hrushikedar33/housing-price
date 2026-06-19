# Property Price Estimator and Market Analysis Portal

This project was built from scratch following the provided brief. It is a monorepo containing:
- **Task 1: ml-api**: A FastAPI service wrapping a scikit-learn Linear Regression model.
- **Task 2: app1-backend**: A BFF (Backend For Frontend) for the Estimator app, written in FastAPI.
- **Task 2: market-backend**: A Spring Boot (Java 21) backend for Market Analysis stats, with Caffeine caching.
- **Task 2: portal**: A Next.js 15 (App Router) + Tailwind frontend serving both App 1 and App 2.

## Prerequisites
- Docker engine and Docker Compose (or `docker-compose`)

## Setup & Running
To spin up the entire system at once:

```bash
docker compose up --build
```
or 
```bash
docker-compose up --build
```

### Accessing the apps
Once running:
- **Portal**: http://localhost:3000
  - Includes both "Estimator" and "Market" tabs.
- **ML API (Swagger Docs)**: http://localhost:8000/docs
- **Estimator BFF (Health)**: http://localhost:8001/health
- **Market Backend (Stats API)**: http://localhost:8080/api/market/stats

## Design Decisions
- **Model Choice Strategy:** For the very small dataset (50 rows) where relationships are mostly linear across columns (e.g. sqft vs price), `LinearRegression` was chosen inside a `StandardScaler` pipeline. It's fast, easily portable into docker via `.joblib`.
- **Portal Architecture:** Built using Next.js 15 App router. Handled both app 1 and app 2 into unified React layout (`app/layout.tsx`). The history is handled in localStorage to allow instant refresh without database requirements, as it was enough for the task's scope.
- **Market backend**: Java API reads CSV dataset at startup and loads it into in-memory List records. Computes avg statistics efficiently and caches response using `@Cacheable` (`caffeine`).

## Notes on the Data
The provided datasets have been moved inside the `data/` folder. The `ml-api` and `market-backend` map this volume at runtime to read properties. The model is trained inside Docker build step.
