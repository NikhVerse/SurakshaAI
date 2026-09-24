"""
SurakshaAI FastAPI Application Entry Point
"""
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from apps.api.app.config import get_settings
from apps.api.models.database import engine, Base
from apps.api.models import entities  # noqa: F401 — ensures all models registered
from apps.api.api.v1 import (
    auth, users, reports, triage, taxonomy, precursors, knowledge, system, dashboard, helpdesk
)

settings = get_settings()
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "Explainable industrial safety critical-risk intelligence platform for HSE teams. "
        "Transforms incident narratives into calibrated pSIF priorities, "
        "Life-Saving Rule intelligence, and barrier health analytics."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS — restrict in production; allow localhost for dev
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
]
if settings.APP_ENV == "development":
    allowed_origins.append("*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
    expose_headers=["X-Request-ID"],
)

# Register all API v1 routers
PREFIX = "/api/v1"
app.include_router(auth.router,        prefix=PREFIX)
app.include_router(users.router,       prefix=PREFIX)
app.include_router(reports.router,     prefix=PREFIX)
app.include_router(triage.router,      prefix=PREFIX)
app.include_router(taxonomy.router,    prefix=PREFIX)
app.include_router(precursors.router,  prefix=PREFIX)
app.include_router(knowledge.router,   prefix=PREFIX)
app.include_router(system.router,      prefix=PREFIX)
app.include_router(dashboard.router,   prefix=PREFIX)
app.include_router(helpdesk.router,    prefix=PREFIX)

# Direct root aliases for /auth, /users, /dashboard
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(dashboard.router)



@app.get("/")
def root():
    return {
        "service": "SurakshaAI Operational API",
        "version": settings.APP_VERSION,
        "status": "online",
        "docs": "/docs",
        "environment": settings.APP_ENV,
        "notice": (
            "Decision-support platform for HSE teams. "
            "Not an accident predictor. Human review mandatory."
        ),
    }


@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": time.time()}
