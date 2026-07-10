"""HTTP middleware for Azure Functions to enforce JWT authentication."""

import json
import logging
from typing import Callable, Any

logger = logging.getLogger(__name__)

class AuthMiddleware:
    """Callable middleware that validates JWT and injects claims into the request."""

    def __init__(self, auth_service):
        """
        Args:
            auth_service: Instance of AuthService providing validate_jwt().
        """
        self.auth_service = auth_service

    def __call__(self, func: Callable) -> Callable:
        """Wrap an Azure Function entry point."""
        def wrapper(req: Any, *args, **kwargs):
            auth_header = req.headers.get("Authorization", "")
            if not auth_header.startswith("Bearer "):
                return func.HttpResponse(
                    json.dumps({"error": "Missing or malformed Authorization header"}),
                    status_code=401,
                    mimetype="application/json",
                )
            token = auth_header.split(" ", 1)[1]
            try:
                claims = self.auth_service.validate_jwt(token)
                # Attach claims for downstream handlers
                if not hasattr(req, "route_params"):
                    req.route_params = {}
                req.route_params["user"] = claims
            except Exception as exc:
                logger.exception("JWT validation failed")
                return func.HttpResponse(
                    json.dumps({"error": "Invalid token", "details": str(exc)}),
                    status_code=401,
                    mimetype="application/json",
                )
            return func(req, *args, **kwargs)
        return wrapper
