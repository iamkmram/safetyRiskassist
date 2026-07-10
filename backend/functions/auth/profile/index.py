"""
Azure Function: GET /api/v1/auth/profile

Requires Authorization header: Bearer <JWT>

Returns JSON user profile extracted from the token:
{
    "sub": "...",
    "email": "...",
    "name": "..."
}
"""

import json
import logging
import azure.functions as func
from fastapi import HTTPException, status

from backend.shared.services.AuthService import auth_service

async def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        auth_header = req.headers.get("Authorization")
        if not auth_header or not auth_header.lower().startswith("bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing or malformed Authorization header"
            )
        token = auth_header.split(" ", 1)[1]

        payload = auth_service.validate_jwt(token)
        profile = auth_service.get_user_info(payload)

        return func.HttpResponse(
            json.dumps(profile),
            status_code=200,
            mimetype="application/json"
        )
    except HTTPException as http_err:
        error_body = {
            "error": http_err.detail,
            "detail": http_err.detail,
            "code": http_err.status_code
        }
        return func.HttpResponse(
            json.dumps(error_body),
            status_code=http_err.status_code,
            mimetype="application/json"
        )
    except Exception as exc:
        logging.exception("Unexpected error fetching profile")
        error_body = {
            "error": "internal_server_error",
            "detail": str(exc),
            "code": 500
        }
        return func.HttpResponse(
            json.dumps(error_body),
            status_code=500,
            mimetype="application/json"
        )

if __name__ == "__main__":
    # Demo - this will obviously fail without a real token
    dummy_token = "eyJhbGciOi... (replace with real token for testing)"
    try:
        payload = auth_service.validate_jwt(dummy_token)
        print("Decoded payload:", payload)
        print("User profile:", auth_service.get_user_info(payload))
    except Exception as e:
        print("Demo error (expected with dummy token):", e)

def get_profile(request):
    """Return user profile information based on Azure AD token."""
    return {"user": "profile data"}

# AzureAD OAuth2 integration placeholder
