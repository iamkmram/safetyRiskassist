"""Global error handling for FastAPI.

Captures unhandled exceptions and ``HTTPException`` instances,
returning a JSON payload that conforms to the standard error contract.
"""

from __future__ import annotations

import logging
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.responses import JSONResponse

_logger = logging.getLogger(__name__)

def register_global_error_handler(app: FastAPI) -> None:
    """Register a global exception handler on *app*.

    The handler converts generic ``Exception`` objects and FastAPI
    ``HTTPException`` instances into a JSON response with the shape:

    {
        "error": "<message>",
        "details": "<optional details>"
    }
    """
    @app.exception_handler(HTTPException)
    async def _http_exception_handler(request: Request, exc: HTTPException):
        _logger.error("HTTPException: %s %s - %s", request.method, request.url.path, exc.detail)
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": exc.detail, "details": None},
        )

    @app.exception_handler(Exception)
    async def _generic_exception_handler(request: Request, exc: Exception):
        _logger.exception("Unhandled exception: %s %s", request.method, request.url.path)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": "Internal server error", "details": str(exc)},
        )
