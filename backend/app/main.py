"""
ASTRA VISION — FastAPI Backend Application Entrypoint
AI-POWERED AIRCRAFT DETECTION & CLASSIFICATION
Built by Preetham Alawandimath
"""

from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles

from .config import settings
from .api.routes import router as api_router

app = FastAPI(
    title=settings.APP_NAME,
    description="ASTRA VISION — AI-Powered Aircraft Detection & Classification Backend Architecture. Designed & Developed by Preetham Alawandimath.",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router)

# Mount frontend build static files if present (for single-port deployment or Docker)
DIST_DIR = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"
ROOT_DIST_DIR = Path(__file__).resolve().parent.parent.parent / "dist"

effective_dist = None
if DIST_DIR.exists() and (DIST_DIR / "index.html").exists():
    effective_dist = DIST_DIR
elif ROOT_DIST_DIR.exists() and (ROOT_DIST_DIR / "index.html").exists():
    effective_dist = ROOT_DIST_DIR

if effective_dist:
    app.mount("/assets", StaticFiles(directory=str(effective_dist / "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api/") or full_path == "docs" or full_path == "redoc":
            return JSONResponse(status_code=404, content={"detail": "Not found"})
        target_file = effective_dist / full_path
        if target_file.is_file():
            return FileResponse(str(target_file))
        return FileResponse(str(effective_dist / "index.html"))
else:
    @app.get("/")
    async def root_status():
        return {
            "app": settings.APP_NAME,
            "tagline": settings.TAGLINE,
            "creator": settings.CREATOR,
            "version": settings.VERSION,
            "inference_mode": settings.inference_mode,
            "status": "ONLINE",
            "api_docs": "/docs",
            "message": "ASTRA VISION API engine operational.",
        }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("backend.app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
