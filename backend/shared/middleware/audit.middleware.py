"""Audit logging middleware.

Each incoming request is recorded in the ``audit_log`` table using the
:class:`backend.shared.services.DatabaseService` service.
"""

from __future__ import annotations

import logging
from datetime import datetime
from typing import Optional

from fastapi import FastAPI, Request
from backend.shared.services.DatabaseService import DatabaseService

_logger = logging.getLogger(__name__)

def _extract_user_id(request: Request) -> Optional[str]:
    """Extract a user identifier from the ``Authorization`` header if present.

    The implementation does not validate the token; it merely returns the
    raw token value after the ``Bearer`` prefix for audit purposes.
    """
    auth = request.headers.get("authorization")
    if auth and auth.lower().startswith("bearer "):
        return auth[7:].strip()
    return None

def create_audit_middleware(app: FastAPI) -> None:
    """Register an auditlogging middleware on *app*.

    The middleware logs ``method``, ``path``, ``client_ip``,
    ``user_id`` (if extractable) and a timestamp.
    """
    @app.middleware("http")
    async def _audit(request: Request, call_next):
        client_ip = request.client.host if request.client else "unknown"
        user_id = _extract_user_id(request)
        timestamp = datetime.utcnow().isoformat() + "Z"

        # Persist the audit record
        try:
            db = DatabaseService()
            await db.insert_audit_log(
                method=request.method,
                path=request.url.path,
                client_ip=client_ip,
                user_id=user_id,
                timestamp=timestamp,
            )
        except Exception as exc:  # pragma: no cover
            _logger.exception("Failed to write audit log: %s", exc)

        response = await call_next(request)
        return response

