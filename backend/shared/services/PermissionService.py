class PermissionService:
    """
    Minimal PermissionService implementation.
    Real logic should handle permission inheritance,
    departmentscoped access and dynamic evaluation.
    """

    def __init__(self):
        # placeholder for any initialization (e.g., DB connections)
        pass

    def get_user_permissions(self, user_id):
        """Return a list of permission identifiers for the given user."""
        return []

    def has_permission(self, user_id, permission):
        """Check if the user has a specific permission."""
        return permission in self.get_user_permissions(user_id)
