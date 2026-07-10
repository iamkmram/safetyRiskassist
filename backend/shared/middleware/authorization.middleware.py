"""Authorization Middleware
Ensures incoming requests have appropriate permissions.
"""

from . import PermissionService

class AuthorizationMiddleware:
    def __init__(self, permission_service: PermissionService):
        self.permission_service = permission_service

    def __call__(self, request):
        # Placeholder implementation  always allow
        return request

