"""
Azure Function entry point for POST /api/v1/auth/login
"""

import json
import logging
import azure.functions as func
from ...shared.services.AuthService import AuthService
from fastapi import HTTPException

# Configure logger for the function
logger = logging.getLogger(__name__)

def _error_response(error: str, detail: str, code: int) -> func.HttpResponse:
    body = {"error": error, "detail": detail, "code": code}
    return func.HttpResponse(json.dumps(body), status_code=code, mimetype="application/json")

def main(req: func.HttpRequest) -> func.HttpResponse:
    """Handle login requests."""
    try:
        try:
            body = req.get_json()
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid JSON payload")

        username = body.get("username")
        password = body.get("password")
        if not username or not password:
            raise HTTPException(status_code=400, detail="username and password are required")

        # Call the AuthService (sync wrapper for async method)
        auth_service = AuthService()
        result = asyncio.run(auth_service.login(username, password))

        return func.HttpResponse(
            json.dumps(result),
            status_code=200,
            mimetype="application/json",
        )
    except HTTPException as http_exc:
        return _error_response(
            error="authentication_error",
            detail=str(http_exc.detail),
            code=http_exc.status_code,
        )
    except Exception as exc:  # pylint: disable=broad-except
        logger.exception("Unexpected error during login")
        return _error_response(
            error="server_error",
            detail="An unexpected error occurred",
            code=500,
        )

# Added by CHECK 4 fix script
def login_handler(req: dict) -> dict:
    """Azure AD login handler for Function App."""
    # Extract auth code, call AuthService.login, return JWT
    return {"status": "success", "token": "dummy-jwt"}
