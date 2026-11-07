from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import sys

# Ensure backend directory is in python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from routes.prediction import router as prediction_router

app = FastAPI(
    title="Restaurant Cuisine Classification API",
    description="Machine Learning API for predicting restaurant cuisine categories based on operational and dining attributes.",
    version="1.0.0"
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes
app.include_router(prediction_router, prefix="/api")

# Mount reports for direct visual access
reports_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "reports")
if os.path.exists(reports_dir):
    app.mount("/reports", StaticFiles(directory=reports_dir), name="reports")

# Mount static frontend build if present
frontend_dist = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="static-assets")

@app.get("/")
def root():
    index_file = os.path.join(frontend_dist, "index.html")
    if os.path.exists(index_file):
        from fastapi.responses import FileResponse
        return FileResponse(index_file)
    return {
        "message": "Welcome to the Restaurant Cuisine Classification Machine Learning API",
        "docs_url": "/docs",
        "endpoints": {
            "health": "/api/health",
            "dataset_info": "/api/dataset-info",
            "cuisines": "/api/cuisines",
            "model_metrics": "/api/model-metrics",
            "model_comparison": "/api/model-comparison",
            "predict": "/api/predict"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
