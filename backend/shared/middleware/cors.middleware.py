"""CORS middleware registration for FastAPI.

This module provides a helper function that registers a
:class:`fastapi.middleware.cors.CORSMiddleware` instance on the
provided :class:`fastapi.FastAPI` application.

The allowed origins are read from the ``ALLOWED_ORIGINS`` environment
variable (commaseparated). If the variable is not set, ``*`` (all
origins) is used.
"""

from __future__ import annotations

import os
from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

def _parse_allowed_origins() -> List[str]:
    """Return a list of allowed origins.

    The ``ALLOWED_ORIGINS`` environment variable may contain a commaseparated
    list of origins. Whitespace around each entry is stripped. If the variable
    is missing or empty, ``["*"]`` is returned which allows any origin.
    """
    raw = os.getenv("ALLOWED_ORIGINS", "")
    origins = [origin.strip() for origin in raw.split(",") if origin.strip()]
    return origins if origins else ["*"]

def create_cors_middleware(app: FastAPI) -> None:
    """Add CORS middleware to *app*.

    The middleware is configured to:
    * Allow the origins resolved by :func:`_parse_allowed_origins`.
    * Allow credentials.
    * Permit all HTTP methods and all headers.

    Parameters
    ----------
    app: FastAPI
        The FastAPI application instance to which the middleware will be added.
    """
    allowed_origins = _parse_allowed_origins()
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
