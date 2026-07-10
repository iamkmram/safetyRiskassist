"""Simple inmemory ratelimit middleware for FastAPI.

The implementation uses a slidingwindow counter stored per client IP.
Default limits are 100 requests per minute, configurable via the
environment variables ``RATE_LIMIT`` and ``RATE_LIMIT_WINDOW_SECONDS``.
"""

from __future__ import annotations

import os
import time
import threading
from collections import defaultdict, deque
from typing import Deque, Dict

from fastapi import FastAPI, Request, Response, status

# Global lock to protect the counters dictionary in a multithreaded environment.
_lock = threading.Lock()
_counters: Dict[str, Deque[float]] = defaultdict(deque)

def _get_limit() -> int:
    try:
        return int(os.getenv("RATE_LIMIT", "100"))
    except ValueError:
        return 100

def _get_window_seconds() -> int:
    try:
        return int(os.getenv("RATE_LIMIT_WINDOW_SECONDS", "60"))
    except ValueError:
        return 60

def create_rate_limit_middleware(app: FastAPI) -> None:
    """Register a ratelimit middleware on *app*.

    The middleware extracts the client IP address from ``request.client.host``.
    Requests exceeding the configured limit receive a ``429 Too Many Requests``
    response with a JSON body that matches the standard error contract.
    """
    limit = _get_limit()
    window = _get_window_seconds()

    @app.middleware("http")
    async def _rate_limiter(request: Request, call_next):
        client_ip = request.client.host if request.client else "unknown"

        now = time.time()
        with _lock:
            timestamps: Deque[float] = _counters[client_ip]
            # Remove timestamps that are outside the sliding window
            while timestamps and timestamps[0] <= now - window:
                timestamps.popleft()
            timestamps.append(now)
            request_count = len(timestamps)

        if request_count > limit:
            # Rate limit exceeded
            return Response(
                content='{"error":"Rate limit exceeded","details":null}',
                media_type="application/json",
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            )
        return await call_next(request)

