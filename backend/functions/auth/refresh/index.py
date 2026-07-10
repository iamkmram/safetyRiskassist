import logging
import json
import azure.functions as func

from ...shared.services.AuthService import AuthService

logger = logging.getLogger(__name__)

def main(req: func.HttpRequest) -> func.HttpResponse:
    """
    Azure Function endpoint to refresh an access token.
    Expects JSON body: {"refresh_token": "<token>"}.
    """
    try:
        req_body = req.get_json()
    except ValueError:
        return func.HttpResponse(
            json.dumps({"error": "Invalid JSON body"}),
            status_code=400,
            mimetype="application/json",
        )

    refresh_token = req_body.get("refresh_token")
    if not refresh_token:
        return func.HttpResponse(
            json.dumps({"error": "Missing refresh_token"}),
            status_code=400,
            mimetype="application/json",
        )

    auth_service = AuthService()
    try:
        new_tokens = auth_service.refresh_token(refresh_token)
        return func.HttpResponse(
            json.dumps(new_tokens),
            status_code=200,
            mimetype="application/json",
        )
    except Exception as e:
        logger.exception("Token refresh failed")
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            status_code=400,
            mimetype="application/json",
        )
