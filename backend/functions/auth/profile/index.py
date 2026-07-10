# Returns user profile information extracted from JWT  placeholder implementation
import json
import logging
from backend.shared.services.AuthService import AuthService

def main(req):
    """HTTP trigger to return user profile extracted from the JWT."""
    logging.info("Profile function invoked.")
    # In a real implementation, you would validate the JWT from the Authorization header
    # and extract claims such as name, email, roles, etc.
    # Here we return a static example payload.
    profile = {
        "id": "user-123",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "roles": ["user"]
    }
    return {"status": 200, "body": json.dumps(profile)}
