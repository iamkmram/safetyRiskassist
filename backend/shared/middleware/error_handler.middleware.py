"""
Global error handling middleware for the FastAPI application.
"""

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

class ErrorHandlerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Simple passthrough implementation  extend as needed
        response: Response = await call_next(request)
        return response
