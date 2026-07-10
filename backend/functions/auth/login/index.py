# Azure AD login function  placeholder implementation
import json
import logging
from backend.shared.services.AuthService import AuthService

def main(req):
    """HTTP trigger for initiating Azure AD login flow.
    Expected query param: ?state=optional
    Returns a redirect URL to Azure AD.
    """
    logging.info("Login function invoked.")
    state = req.params.get('state', 'default')
    auth_service = AuthService()
    redirect_url = auth_service.get_authorization_url(state=state)
    return {
        "status": 302,
        "headers": {"Location": redirect_url},
        "body": json.dumps({"redirect": redirect_url})
    }
