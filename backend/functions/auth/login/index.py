"""
Azure Function: POST /api/v1/auth/login

Accepts JSON body:
{
    "username": "string",
    "password": "string"
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

# Import the singleton AuthService defined in backend.shared.services.AuthService
from backend.shared.services.AuthService import auth_service

async def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        # Ensure JSON payload
        try:
            payload = req.get_json()
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid JSON body"
            )

        username = payload.get("username")
        password = payload.get("password")
        if not username or not password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Both 'username' and 'password' are required"
            )

        token_data = await auth_service.acquire_token(username, password)

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
        logging.exception("Unexpected error during login")
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

# ----------------------------------------------------------------------
# Simple test harness (won't run in Azure Functions)
# ----------------------------------------------------------------------
if __name__ == "__main__":
    import asyncio

    async def _demo():
        demo_user = {"username": "test@example.com", "password": "dummy"}
        print("Demo login request payload:", demo_user)
        result = await auth_service.acquire_token(**demo_user)
        print("Result:", result)

    asyncio.run(_demo())

def login(request):
    """Initiate Azure AD OAuth2 login flow."""
    return {"status": "login initiated"}

# AzureAD OAuth2 integration placeholder
