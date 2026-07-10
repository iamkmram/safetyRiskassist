from fastapi import FastAPI, Request
from starlette.middleware.base import BaseHTTPMiddleware
import logging

logger = logging.getLogger("audit")

class AuditMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        client_host = request.client.host if request.client else "unknown"
        logger.info(f"{request.method} {request.url.path} from {client_host}")
        response = await call_next(request)
        logger.info(f"Response status: {response.status_code}")
        return response

def add_audit(app: FastAPI) -> None:
    app.add_middleware(AuditMiddleware)
