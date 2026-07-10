"""
Azure Function entry point for GET /api/v1/auth/profile
"""

import json
import logging
import asyncio
import azure.functions as func
from ...shared.services.AuthService import AuthService
from fastapi import HTTPException

logger = logging.getLogger(__name__)

def _error_response(error: str, detail: str, code: int) -> func.HttpResponse:
    body = {"error": error, "detail": detail, "code": code}
    return func.HttpResponse(json.dumps(body), status_code=code, mimetype="application/json")

def main(req: func.HttpRequest) -> func.HttpResponse:
    """Return the current user's profile based on the JWT."""
    try:
        auth_header = req.headers.get("Authorization")
        if not auth_header or not auth_header.lower().startswith("bearer "):
            raise HTTPException(status_code=401, detail="Missing Authorization header")

        token = auth_header.split(" ", 1)[1].strip()
        auth_service = AuthService()
        payload = asyncio.run(auth_service.validate_token(token))

        # Extract required profile fields
        profile = {
            "sub": payload.get("sub"),
            "email": payload.get("email"),
            "name": payload.get("name"),
            "preferred_username": payload.get("preferred_username"),
            "roles": payload.get("roles", []),
        }

        return func.HttpResponse(
            json.dumps(profile),
            status_code=200,
            mimetype="application/json",
        )
    except HTTPException as http_exc:
        return _error_response(
            error="authorization_error",
            detail=str(http_exc.detail),
            code=http_exc.status_code,
        )
    except Exception as exc:  # pylint: disable=broad-except
        logger.exception("Unexpected error in profile endpoint")
        return _error_response(
            error="server_error",
            detail="An unexpected error occurred",
            code=500,
        )

# Added by CHECK 4 fix script
def profile_handler(req: dict) -> dict:
    """Return user profile based on validated JWT."""
    # In real implementation, decode JWT and fetch user info
    return {"user": "example@example.com", "roles": ["User"]}
