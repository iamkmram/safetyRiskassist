"""
Global error handling for the FastAPI application.
Provides uniform JSON error responses.
"""

from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.status import HTTP_500_INTERNAL_SERVER_ERROR
from typing import Any

def _error_response(exc: Exception, code: int, error: str, detail: str) -> JSONResponse:
    return JSONResponse(
        status_code=code,
        content={"error": error, "detail": detail, "code": code},
    )

def _http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    return _error_response(
        exc,
        code=exc.status_code,
        error=exc.detail if isinstance(exc.detail, str) else "HTTPException",
        detail=str(exc.detail),
    )

def _validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    return _error_response(
        exc,
        code=422,
        error="ValidationError",
        detail=str(exc),
    )

def _generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    return _error_response(
        exc,
        code=HTTP_500_INTERNAL_SERVER_ERROR,
        error="InternalServerError",
        detail=str(exc),
    )

def register_error_handlers(app: FastAPI) -> None:
    """
    Register custom exception handlers on the FastAPI app.
    """
    app.add_exception_handler(HTTPException, _http_exception_handler)
    app.add_exception_handler(RequestValidationError, _validation_exception_handler)
    app.add_exception_handler(Exception, _generic_exception_handler)
