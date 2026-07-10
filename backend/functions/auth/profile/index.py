import logging
import json
import azure.functions as func

from ...shared.services.AuthService import AuthService

logger = logging.getLogger(__name__)

def main(req: func.HttpRequest) -> func.HttpResponse:
    """
    Returns user profile information extracted from a valid JWT.
    Expects Authorization header with Bearer token.
    """
    auth_header = req.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return func.HttpResponse(
            json.dumps({"error": "Missing Authorization header"}),
            status_code=401,
            mimetype="application/json",
        )
    token = auth_header.split(' ', 1)[1]

    auth_service = AuthService()
    try:
        claims = auth_service.validate_jwt(token)
        profile = {
            "oid": claims.get("oid"),
            "name": claims.get("name"),
            "email": claims.get("preferred_username"),
            "tid": claims.get("tid"),
            "roles": claims.get("roles", []),
        }
        return func.HttpResponse(
            json.dumps(profile),
            status_code=200,
            mimetype="application/json",
        )
    except Exception as e:
        logger.exception("Invalid token")
        return func.HttpResponse(
            json.dumps({"error": "Invalid token", "details": str(e)}),
            status_code=401,
            mimetype="application/json",
        )
