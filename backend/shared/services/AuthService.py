"""Authentication service for Azure AD (Entra ID) integration."""

import os
import json
import logging
from typing import Dict, Any, Optional

import msal
import jwt
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

logger = logging.getLogger(__name__)

class AuthService:
    """Handles Azure AD OAuth2 flow, JWT validation, and token refresh."""

    def __init__(self):
        # Azure AD configuration from environment variables
        self.client_id = os.getenv("AZURE_AD_CLIENT_ID")
        self.tenant_id = os.getenv("AZURE_AD_TENANT_ID")
        self.redirect_uri = os.getenv("AZURE_AD_REDIRECT_URI")
        self.authority = f"https://login.microsoftonline.com/{self.tenant_id}"
        self.scopes = ["User.Read"]
        self.key_vault_name = os.getenv("KEY_VAULT_NAME")

        if not all([self.client_id, self.tenant_id, self.redirect_uri, self.key_vault_name]):
            raise ValueError("Missing required Azure AD or Key Vault environment variables.")

        self._init_confidential_client()

    def _init_confidential_client(self):
        """Initializes MSAL confidential client using secret from Azure Key Vault."""
        client_secret = self._get_secret("AzureAdClientSecret")
        self._confidential_client = msal.ConfidentialClientApplication(
            client_id=self.client_id,
            client_credential=client_secret,
            authority=self.authority,
        )
        logger.debug("MSAL confidential client initialized.")

    def _get_secret(self, secret_name: str) -> str:
        """Retrieves a secret from Azure Key Vault."""
        kv_url = f"https://{self.key_vault_name}.vault.azure.net"
        credential = DefaultAzureCredential()
        client = SecretClient(vault_url=kv_url, credential=credential)
        secret = client.get_secret(secret_name)
        return secret.value

    def get_login_url(self, state: Optional[str] = None) -> str:
        """Returns the Azure AD authorization URL."""
        auth_url = self._confidential_client.get_authorization_request_url(
            scopes=self.scopes,
            redirect_uri=self.redirect_uri,
            state=state,
        )
        return auth_url

    def exchange_code_for_token(self, code: str) -> Dict[str, Any]:
        """Exchanges an authorization code for tokens."""
        result = self._confidential_client.acquire_token_by_authorization_code(
            code=code,
            scopes=self.scopes,
            redirect_uri=self.redirect_uri,
        )
        if "error" in result:
            logger.error("Token acquisition failed: %s", result.get("error_description"))
            raise Exception(result.get("error_description"))
        return result

    def refresh_token(self, refresh_token: str) -> Dict[str, Any]:
        """Refreshes an access token using a refresh token."""
        result = self._confidential_client.acquire_token_by_refresh_token(
            refresh_token=refresh_token,
            scopes=self.scopes,
        )
        if "error" in result:
            logger.error("Token refresh failed: %s", result.get("error_description"))
            raise Exception(result.get("error_description"))
        return result

    def validate_jwt(self, token: str) -> Dict[str, Any]:
        """Validates a JWT using Azure AD public keys."""
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")
        jwks_uri = f"https://login.microsoftonline.com/{self.tenant_id}/discovery/v2.0/keys"
        response = msal.requests.get(jwks_uri)
        jwks = response.json()
        public_keys = {
            key["kid"]: jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(key))
            for key in jwks["keys"]
        }
        key = public_keys.get(kid)
        if not key:
            raise Exception("Unable to locate appropriate public key for token validation.")
        decoded = jwt.decode(
            token,
            key=key,
            algorithms=["RS256"],
            audience=self.client_id,
            options={"verify_exp": True},
        )
        return decoded
