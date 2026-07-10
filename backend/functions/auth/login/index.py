import logging
import json
import azure.functions as func

from ...shared.services.AuthService import AuthService

logger = logging.getLogger(__name__)

def main(req: func.HttpRequest) -> func.HttpResponse:
    """
    Azure Function entry point for login.
    - GET without 'code' returns Azure AD login URL.
    - GET with 'code' exchanges it for tokens.
    """
    auth_service = AuthService()
    code = req.params.get('code')
    if code:
        try:
            token_response = auth_service.exchange_code_for_token(code)
            return func.HttpResponse(
                json.dumps(token_response),
                status_code=200,
                mimetype="application/json",
            )
        except Exception as e:
            logger.exception("Error exchanging code for token")
            return func.HttpResponse(
                json.dumps({"error": str(e)}),
                status_code=400,
                mimetype="application/json",
            )
    else:
        state = req.params.get('state')
        login_url = auth_service.get_login_url(state)
        return func.HttpResponse(
            json.dumps({"login_url": login_url}),
            status_code=200,
            mimetype="application/json",
        )
