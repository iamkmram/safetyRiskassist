from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

class AuditMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # TODO: implement audit specific logic
        response = await call_next(request)
        return response
