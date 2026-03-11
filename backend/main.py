import os

import nltk
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.ocr import router as ocr_router


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

# CORS – allow local dev servers + deployed frontend
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

# Add the deployed frontend URL from env var (e.g. https://your-app.vercel.app)
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    allowed_origins.append(frontend_url.rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(ocr_router, prefix="/api")


@app.get("/")
async def root():
    return {"message": "DocReader API is running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
