class AuthorizationMiddleware:
    """
    Middleware that validates incoming requests against RBAC rules.
    """

    def __init__(self, permission_service):
        """
        :param permission_service: Instance of PermissionService
        """
        self.permission_service = permission_service

    def authorize(self, request):
        """
        Perform authorization for the given request.
        Expected to raise an exception or return a boolean.
        """
        # Placeholder logic  always allow
        return True
