"""
Rate Limiting Middleware.
Attempts to use `slowapi`. If unavailable, falls back to a simple inmemory limiter.
"""

from fastapi import FastAPI, Request, HTTPException, status
from typing import Callable, Dict
import time

try:
    from slowapi import Limiter, _rate_limit_exceeded_handler
    from slowapi.util import get_remote_address
    from slowapi.errors import RateLimitExceeded

    _slowapi_available = True
except Exception:  # pragma: no cover
    _slowapi_available = False

# Inmemory fallback structures
_fallback_limits: Dict[str, Dict[str, float]] = {}
_FALLBACK_RATE = 100  # requests
_FALLBACK_INTERVAL = 60  # seconds

def _fallback_key(request: Request) -> str:
    # Use client host as a simple identifier
    return request.client.host if request.client else "anonymous"

def _fallback_rate_limiter(request: Request) -> None:
    key = _fallback_key(request)
    now = time.time()
    record = _fallback_limits.get(key, {"count": 0, "reset": now + _FALLBACK_INTERVAL})
    if now > record["reset"]:
        record = {"count": 0, "reset": now + _FALLBACK_INTERVAL}
    record["count"] += 1
    _fallback_limits[key] = record
    if record["count"] > _FALLBACK_RATE:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded",
        )

def get_rate_limiter(app: FastAPI) -> None:
    """
    Register a global rate limiter.
    Uses `slowapi` if installed; otherwise, a lightweight inmemory limiter.
    """
    if _slowapi_available:
        limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])
        app.state.limiter = limiter
        app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

        @app.middleware("http")
        async def _slowapi_middleware(request: Request, call_next: Callable):
            response = await limiter(request, call_next)
            return response
    else:
        @app.middleware("http")
        async def _fallback_middleware(request: Request, call_next: Callable):
            _fallback_rate_limiter(request)
            response = await call_next(request)
            return response
