from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

class ErrorHandlerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # TODO: implement error_handler specific logic
        response = await call_next(request)
        return response
