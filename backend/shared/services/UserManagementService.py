"""User management service handling CRUD and bulk operations."""

class UserManagementService:
    def __init__(self):
        pass

    def create_user(self, user_data: dict):
        """Create a single user."""
        return {"user": user_data, "status": "created"}

    def bulk_create_users(self, users: list):
        """Create multiple users at once."""
        return {"created_count": len(users)}

