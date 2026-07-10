from fastapi import FastAPI
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
import time

class SimpleRateLimiter(BaseHTTPMiddleware):
    def __init__(self, app: FastAPI, calls: int = 60, period: int = 60):
        super().__init__(app)
        self.calls = calls
        self.period = period
        self.history: dict[str, list[float]] = {}

    async def dispatch(self, request: Request, call_next):
        client = request.client.host if request.client else "anonymous"
        now = time.time()
        timestamps = self.history.get(client, [])
        # keep only timestamps within the period
        timestamps = [t for t in timestamps if now - t < self.period]
        if len(timestamps) >= self.calls:
            return Response("Rate limit exceeded", status_code=429)
        timestamps.append(now)
        self.history[client] = timestamps
        return await call_next(request)

def add_rate_limit(app: FastAPI) -> None:
    app.add_middleware(SimpleRateLimiter)

