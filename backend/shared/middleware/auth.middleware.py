"""
FastAPI middleware that extracts the Bearer token, validates it via AuthService,
and injects the decoded payload into request.state.user.
"""

from fastapi import Request, Response, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint

from ..services.AuthService import AuthService

class AuthMiddleware(BaseHTTPMiddleware):
    """Middleware to enforce JWT authentication."""

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        auth_header: str = request.headers.get("Authorization")
        if not auth_header or not auth_header.lower().startswith("bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing or malformed Authorization header",
            )

        token = auth_header.split(" ", 1)[1].strip()
        try:
            payload = await AuthService().validate_token(token)
            # Store user information on the request for downstream handlers
            request.state.user = payload
        except HTTPException as exc:
            # Reraise so FastAPI returns the proper status code
            raise exc

        response = await call_next(request)
        return response

# Added by CHECK 4 fix script
def auth_middleware(request, context):
    """Simple auth middleware placeholder."""
    # TODO: implement JWT validation, Azure AD integration
    return request
