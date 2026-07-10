"""
Azure Function: POST /api/v1/auth/refresh

Accepts JSON body:
{
    "refresh_token": "string"
}

Returns JSON:
{
    "access_token": "...",
    "refresh_token": "...",
    "expires_in": 3600
}
"""

import json
import logging
import azure.functions as func
from fastapi import HTTPException, status

from backend.shared.services.AuthService import auth_service

async def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        try:
            payload = req.get_json()
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid JSON body"
            )

        refresh_token = payload.get("refresh_token")
        if not refresh_token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="'refresh_token' field is required"
            )

        token_data = await auth_service.refresh_token(refresh_token)

        return func.HttpResponse(
            json.dumps(token_data),
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
        logging.exception("Unexpected error during token refresh")
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
    import asyncio

    async def _demo():
        # Replace the placeholder with a real refresh token when testing
        demo_payload = {"refresh_token": "dummy_refresh_token"}
        print("Demo refresh payload:", demo_payload)
        result = await auth_service.refresh_token(demo_payload["refresh_token"])
        print("Result:", result)

    asyncio.run(_demo())

def refresh(request):
    """Refresh Azure AD OAuth2 access token."""
    return {"status": "token refreshed"}

# AzureAD OAuth2 integration placeholder
