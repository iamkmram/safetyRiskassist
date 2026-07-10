# Authentication middleware placeholder  validates JWT from Authorization header
import json
import logging
from backend.shared.services.AuthService import AuthService

def authenticate(request):
    """Validate JWT and attach user info to the request."""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        logging.warning("Missing or malformed Authorization header.")
        return {"status": 401, "body": json.dumps({"error": "Unauthorized"})}
    token = auth_header.split(' ', 1)[1]
    # Placeholder: in real code, verify token signature, expiry, etc.
    # Here we simply log and allow the request to continue.
    logging.info(f"Authenticated request with token: {token[:10]}...")
    request.context = {"user": {"id": "user-123", "name": "John Doe"}}
    return None  # No error
