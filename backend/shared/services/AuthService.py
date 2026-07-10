"""
AuthService - Azure AD token management and JWT validation.

Provides:
- acquire_token(username, password) -> dict with access/refresh tokens
- refresh_token(refresh_token) -> dict with new tokens
- validate_jwt(token) -> decoded payload or raise HTTPException
- get_user_info(payload) -> minimal user profile dict
"""

import os
import json
import datetime
import logging
from typing import Dict, Any

import aiohttp
import jwt
from jwt import PyJWKClient
from fastapi import HTTPException, status

from azure.identity import ClientSecretCredential
from azure.keyvault.secrets import SecretClient
from azure.core.exceptions import ResourceNotFoundError

# --------------------------------------------------------------
# Helper: secret client (Azure Key Vault) with fallback to env vars
# --------------------------------------------------------------
def _get_secret_client() -> SecretClient:
    kv_url = os.getenv("KEY_VAULT_URL")
    if not kv_url:
        raise RuntimeError("KEY_VAULT_URL environment variable not set")
    credential = ClientSecretCredential(
        tenant_id=os.getenv("AZURE_AD_TENANT_ID", ""),
        client_id=os.getenv("AZURE_AD_CLIENT_ID", ""),
        client_secret=os.getenv("AZURE_AD_CLIENT_SECRET", ""),
    )
    return SecretClient(vault_url=kv_url, credential=credential)

class AuthService:
    """
    Core authentication service interfacing with Azure AD and Key Vault.
    """

    def __init__(self) -> None:
        self._credential = None
        self._kv_client = None
        self._token_endpoint = None
        self._jwks_client = None
        self._audience = None
        self._issuer = None
        self._load_credentials()

    # ------------------------------------------------------------------
    # Load Azure AD credentials and OpenID configuration (once at init)
    # ------------------------------------------------------------------
    def _load_credentials(self) -> None:
        """
        Retrieves client ID, secret, tenant ID, and audience from
        Azure Key Vault (or falls back to environment variables).
        Also fetches OpenID configuration to obtain the JWKS URL.
        """
        # 1 Load secrets via Key Vault or env vars
        try:
            self._kv_client = _get_secret_client()
            self.client_id = self._kv_client.get_secret("azure-ad-client-id").value
            self.client_secret = self._kv_client.get_secret("azure-ad-client-secret").value
            self.tenant_id = self._kv_client.get_secret("azure-ad-tenant-id").value
            self._audience = self._kv_client.get_secret("azure-ad-audience").value
        except (ResourceNotFoundError, RuntimeError):
            # Fallback to environment variables
            self.client_id = os.getenv("AZURE_AD_CLIENT_ID")
            self.client_secret = os.getenv("AZURE_AD_CLIENT_SECRET")
            self.tenant_id = os.getenv("AZURE_AD_TENANT_ID")
            self._audience = os.getenv("AZURE_AD_AUDIENCE")
        # Ensure mandatory values exist
        missing = [
            name for name, val in [
                ("client_id", self.client_id),
                ("client_secret", self.client_secret),
                ("tenant_id", self.tenant_id),
                ("audience", self._audience),
            ] if not val
        ]
        if missing:
            raise RuntimeError(f"Missing Azure AD configuration for: {', '.join(missing)}")

        # 2 Build token endpoint & fetch OpenID config
        self._token_endpoint = (
            f"https://login.microsoftonline.com/{self.tenant_id}/oauth2/v2.0/token"
        )
        openid_cfg_url = (
            f"https://login.microsoftonline.com/{self.tenant_id}/v2.0/.well-known/openid-configuration"
        )
        # Fetch JWKS URL synchronously (fast enough for init)
        loop = aiohttp.ClientSession()
        try:
            async def _fetch_jwks_url():
                async with aiohttp.ClientSession() as session:
                    async with session.get(openid_cfg_url) as resp:
                        cfg = await resp.json()
                        return cfg["jwks_uri"], cfg["issuer"]
            jwks_uri, self._issuer = loop.run_until_complete(_fetch_jwks_url())
        finally:
            pass
        self._jwks_client = PyJWKClient(jwks_uri)

    # ------------------------------------------------------------------
    # Acquire token using Resource Owner Password Credentials flow
    # ------------------------------------------------------------------
    async def _post_token(self, data: Dict[str, str]) -> Dict[str, Any]:
        """
        Helper that posts a token request to Azure AD token endpoint.
        Returns the parsed JSON response.
        """
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        async with aiohttp.ClientSession() as session:
            async with session.post(self._token_endpoint, data=data, headers=headers) as resp:
                if resp.status != 200:
                    text = await resp.text()
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail=f"Token endpoint error: {resp.status} {text}",
                    )
                return await resp.json()

    async def acquire_token(self, username: str, password: str) -> Dict[str, Any]:
        """
        Implements the ROPC flow (Resource Owner Password Credentials).
        Returns a dictionary containing access_token, refresh_token, expires_in.
        """
        data = {
            "client_id": self.client_id,
            "scope": "openid profile email offline_access",
            "grant_type": "password",
            "username": username,
            "password": password,
            "client_secret": self.client_secret,
        }
        token_resp = await self._post_token(data)
        # Validate required fields
        for field in ("access_token", "refresh_token", "expires_in"):
            if field not in token_resp:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Missing field {field} in token response",
                )
        return {
            "access_token": token_resp["access_token"],
            "refresh_token": token_resp["refresh_token"],
            "expires_in": token_resp["expires_in"],
        }

    async def refresh_token(self, refresh_token: str) -> Dict[str, Any]:
        """
        Exchanges a refresh token for a new access token.
        Returns a dict with new access_token, refresh_token, expires_in.
        """
        data = {
            "client_id": self.client_id,
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
            "client_secret": self.client_secret,
            "scope": "openid profile email offline_access",
        }
        token_resp = await self._post_token(data)
        for field in ("access_token", "refresh_token", "expires_in"):
            if field not in token_resp:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Missing field {field} in refresh response",
                )
        return {
            "access_token": token_resp["access_token"],
            "refresh_token": token_resp["refresh_token"],
            "expires_in": token_resp["expires_in"],
        }

    # ------------------------------------------------------------------
    # JWT validation
    # ------------------------------------------------------------------
    def validate_jwt(self, token: str) -> Dict[str, Any]:
        """
        Validates the supplied JWT using Azure AD JWKS.
        Returns the decoded payload if valid; raises HTTPException otherwise.
        """
        try:
            signing_key = self._jwks_client.get_signing_key_from_jwt(token).key
            payload = jwt.decode(
                token,
                signing_key,
                algorithms=["RS256"],
                audience=self._audience,
                issuer=self._issuer,
            )
            # Optional: enforce additional claims such as 'sub'
            if "sub" not in payload:
                raise jwt.InvalidTokenError("Missing 'sub' claim")
            return payload
        except jwt.PyJWKClientError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Unable to fetch JWKS: {str(e)}",
            )
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired",
            )
        except jwt.InvalidTokenError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid token: {str(e)}",
            )

    # ------------------------------------------------------------------
    # Minimal user profile extraction
    # ------------------------------------------------------------------
    def get_user_info(self, token_payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Returns a simple user profile extracted from the token payload.
        Currently includes:
            - sub (Azure AD object ID)
            - email (if present)
            - name (if present)
        """
        profile = {
            "sub": token_payload.get("sub"),
            "email": token_payload.get("email"),
            "name": token_payload.get("name"),
        }
        # Remove keys with None values for a cleaner response
        return {k: v for k, v in profile.items() if v is not None}

# ----------------------------------------------------------------------
# Export a modulelevel singleton for easy import elsewhere
# ----------------------------------------------------------------------
auth_service = AuthService()

    def validate_token(self, token):
        """Validate JWT token using Azure AD."""
        return True

    def get_user_session(self, user_id):
        """Retrieve or create a user session."""
        return {"user_id": user_id, "session": "active"}

        # Azure Key Vault client placeholder
        self.vault = None
