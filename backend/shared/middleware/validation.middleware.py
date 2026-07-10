"""Request payload validation middleware.

Ensures that JSON request bodies contain only camelCase keys.
If validation fails a ``400 Bad Request`` response is returned using
the standard error contract.
"""

from __future__ import annotations

import json
import re
from typing import Any, Dict

from fastapi import FastAPI, Request, Response, status

_CAMEL_CASE_REGEX = re.compile(r"^[a-z]+(?:[A-Z][a-z0-9]+)*$")

def _is_camel_case(s: str) -> bool:
    """Return ``True`` if *s* follows camelCase naming."""
    return bool(_CAMEL_CASE_REGEX.fullmatch(s))

def _validate_keys(payload: Any, path: str = "") -> bool:
    """Recursively verify that all dictionary keys are camelCase.

    Returns ``True`` if the payload is valid, ``False`` otherwise.
    """
    if isinstance(payload, dict):
        for key, value in payload.items():
            if not isinstance(key, str) or not _is_camel_case(key):
                return False
            if not _validate_keys(value, f"{path}.{key}" if path else key):
                return False
    elif isinstance(payload, list):
        for idx, item in enumerate(payload):
            if not _validate_keys(item, f"{path}[{idx}]"):
                return False
    return True

def create_validation_middleware(app: FastAPI) -> None:
    """Add a requestvalidation middleware to *app*.

    The middleware attempts to parse the request body as JSON (if a body
    is present and the ``Content-Type`` is ``application/json``). If the
    JSON is malformed or contains noncamelCase keys, a ``400`` response
    is returned.
    """
    @app.middleware("http")
    async def _validate_request(request: Request, call_next):
        # Only inspect JSON bodies
        if request.headers.get("content-type", "").startswith("application/json"):
            try:
                body_bytes = await request.body()
                if body_bytes:
                    payload = json.loads(body_bytes)
                    if not _validate_keys(payload):
                        return Response(
                            content='{"error":"Invalid JSON keys - must be camelCase","details":null}',
                            media_type="application/json",
                            status_code=status.HTTP_400_BAD_REQUEST,
                        )
                # Reinject the body so downstream handlers can read it
                async def receive() -> dict:
                    return {"type": "http.request", "body": body_bytes}
                request._receive = receive  # type: ignore[attr-defined]
            except json.JSONDecodeError:
                return Response(
                    content='{"error":"Malformed JSON","details":null}',
                    media_type="application/json",
                    status_code=status.HTTP_400_BAD_REQUEST,
                )
        return await call_next(request)

