import os
from pathlib import Path

import nltk
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles

from routers.ocr import router as ocr_router

# Path to the Vite build output (built during Render's build step)
STATIC_DIR = Path(__file__).resolve().parent / "static"


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Download required NLTK data on startup."""
    nltk.download("punkt", quiet=True)
    nltk.download("punkt_tab", quiet=True)
    nltk.download("stopwords", quiet=True)
    yield


app = FastAPI(
    title="DocReader API",
    description="Backend API for OCR operations on uploaded documents",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS – only needed for local development (in production frontend is same-origin)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(ocr_router, prefix="/api")


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


# ---------------------------------------------------------------------------
# Serve the Vite-built frontend (only when the static dir exists, i.e. prod)
# ---------------------------------------------------------------------------
if STATIC_DIR.is_dir():
    # Mount all built assets (JS, CSS, images, etc.)
    app.mount("/assets", StaticFiles(directory=STATIC_DIR / "assets"), name="assets")

    # Catch-all: serve index.html for any non-API route (SPA client-side routing)
    @app.get("/{full_path:path}")
    async def serve_spa(request: Request, full_path: str):
        # If a real file exists in static dir, serve it (favicon, robots.txt, etc.)
        file_path = STATIC_DIR / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        # Otherwise, serve index.html and let React Router handle the route
        return FileResponse(STATIC_DIR / "index.html")
else:
    # Local dev – just show a simple root message
    @app.get("/")
    async def root():
        return {"message": "DocReader API is running (dev mode – no static files)"}
