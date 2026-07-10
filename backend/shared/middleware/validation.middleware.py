"""
Request Validation Middleware.
Ensures mandatory headers are present on each incoming request.
"""

from fastapi import Request, HTTPException, status
from typing import Callable

async def _validate_headers(request: Request) -> None:
    """
    Validate that required headers exist.
    Raises HTTPException 400 if validation fails.
    """
    missing = []
    if "authorization" not in request.headers:
        missing.append("Authorization")
    if "content-type" not in request.headers:
        missing.append("Content-Type")
    if missing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Missing required header(s): {', '.join(missing)}",
        )

def get_validation_middleware(app) -> None:
    """
    Register validation as a global HTTP middleware.
    """
    @app.middleware("http")
    async def _validation_middleware(request: Request, call_next: Callable):
        await _validate_headers(request)
        response = await call_next(request)
        return response
