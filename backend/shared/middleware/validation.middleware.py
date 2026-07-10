from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

class ValidationMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # TODO: implement validation specific logic
        response = await call_next(request)
        return response
