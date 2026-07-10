"""
CORS Middleware for the FastAPI application.
Allows all origins, methods, and headers (permissive defaults).
"""

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

def get_cors_middleware(app: FastAPI) -> None:
    """
    Register the CORSMiddleware with permissive settings.
    """
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Allow all origins
        allow_methods=["*"],  # Allow all HTTP methods
        allow_headers=["*"],  # Allow all headers
        expose_headers=["*"],
        max_age=86400,
    )
