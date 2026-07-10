"""
Audit Logging Middleware.
Logs method, path, status code, processing time, and optional user identifier.
"""

import logging
import time
from fastapi import Request, FastAPI
from typing import Callable

# Configure a simple logger if the project does not provide one.
logger = logging.getLogger("audit")
if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter(
        "%(asctime)s - %(levelname)s - %(message)s"
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)

def get_audit_logger(app: FastAPI) -> None:
    """
    Register audit logger middleware.
    """

    @app.middleware("http")
    async def _audit_middleware(request: Request, call_next: Callable):
        start_time = time.time()
        response = await call_next(request)
        process_time_ms = (time.time() - start_time) * 1000

        # Attempt to extract user ID from JWT (very nave extraction)
        user_id = None
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.lower().startswith("bearer "):
            token = auth_header.split(" ", 1)[1]
            # JWT format: header.payload.signature. We'll decode the payload (base64url) without verification.
            try:
                payload_part = token.split(".")[1]
                padded = payload_part + "=" * (-len(payload_part) % 4)
                import base64, json

                payload_bytes = base64.urlsafe_b64decode(padded)
                payload = json.loads(payload_bytes)
                user_id = payload.get("oid") or payload.get("sub")
            except Exception:
                user_id = None

        logger.info(
            {
                "method": request.method,
                "path": request.url.path,
                "status_code": response.status_code,
                "duration_ms": round(process_time_ms, 2),
                "user_id": user_id,
            }
        )
        return response
