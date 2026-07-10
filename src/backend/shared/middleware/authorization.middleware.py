import os
from typing import Callable

from fastapi import Request, HTTPException
from fastapi.routing import APIRoute

from backend.shared.services.auth_service import AuthService
from backend.shared.services.permission_service import PermissionService

# ------------------------------------------------------------------
# Authorization Middleware - extracts JWT, populates request.state.permissions
# ------------------------------------------------------------------

class AuthorizationMiddleware:
    def __init__(self, app):
        self.app = app
        self.permission_service = PermissionService()

    async def __call__(self, request: Request, call_next: Callable):
        # 1 Extract JWT from Authorization header
        auth: str | None = request.headers.get("Authorization")
        if not auth or not auth.lower().startswith("bearer "):
            raise HTTPException(status_code=401, detail="Missing or malformed Authorization header")

        token = auth.split(" ", 1)[1]

        # 2 Validate JWT and obtain user payload
        try:
            payload = await AuthService.verify_jwt(token)  # type: ignore[attr-defined]
        except Exception as exc:
            raise HTTPException(status_code=401, detail=str(exc))

        user_id: str = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Token missing 'sub' claim")

        # 3 Fetch permissions for the user
        permissions = await self.permission_service.get_user_permissions(user_id)

        # 4 Attach permissions to request.state for downstream use
        request.state.user_id = user_id
        request.state.permissions = permissions

        # 5 Continue processing
        response = await call_next(request)
        return response

# Helper to add the middleware to a FastAPI app
def add_authorization_middleware(app):
    app.add_middleware(AuthorizationMiddleware)
