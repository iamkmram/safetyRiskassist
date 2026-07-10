# Azure AD token refresh  placeholder implementation
import json
import logging
from backend.shared.services.AuthService import AuthService

def main(req):
    """HTTP trigger to refresh an access token.
    Expected JSON body: {"refresh_token": "..."}
    """
    logging.info("Refresh function invoked.")
    try:
        body = req.get_json()
        refresh_token = body.get('refresh_token')
        if not refresh_token:
            raise ValueError('refresh_token missing')
    except Exception as e:
        return {"status": 400, "body": json.dumps({"error": str(e)})}

    auth_service = AuthService()
    new_tokens = auth_service.refresh_access_token(refresh_token)
    return {"status": 200, "body": json.dumps(new_tokens)}
