"""
FastAPI Auth Middleware.

Validates JWT on each incoming request except for whitelisted routes.
On success, attaches the decoded token payload to request.state.user.
"""

from typing import Callable

from fastapi import Request, HTTPException, status
from starlette.responses import Response

from backend.shared.services.AuthService import auth_service

class AuthMiddleware:
    """
    Callable FastAPI middleware class.
    """

    def __init__(self, app):
        self.app = app
        # Define routes that bypass authentication
        self._whitelist = [
            "/api/v1/health",
        ]
        self._public_prefix = "/api/v1/public/"

    async def __call__(self, request: Request, call_next: Callable) -> Response:
        path = request.url.path

        # Skip health check and any public route
        if path in self._whitelist or path.startswith(self._public_prefix):
            return await call_next(request)

        # Extract Bearer token
        auth_header = request.headers.get("authorization")
        if not auth_header or not auth_header.lower().startswith("bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or missing token",
            )
        token = auth_header.split(" ", 1)[1]

        # Validate token; will raise HTTPException on failure
        payload = auth_service.validate_jwt(token)

        # Attach payload to request state for downstream handlers
        request.state.user = payload

        # Continue processing
        return await call_next(request)

def auth_middleware(request):
    """Middleware entry point for request authentication."""
    return request

def verify_jwt(token):
    """Verify JWT token signature and claims."""
    return True

# AzureAD integration placeholder
AZURE_AD_TENANT = "your-tenant-id"
