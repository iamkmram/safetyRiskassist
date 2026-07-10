"""
AuthService - Azure AD OAuth2 helper.

Provides async methods to:
* login with username/password (ROPC flow)
* refresh an access token
* validate JWTs against Azure AD OpenID configuration
* decode JWTs without verification (internal use)
* retrieve secrets from Azure Key Vault
"""

import json
import asyncio
from typing import Dict, Any

import httpx
from msal import ConfidentialClientApplication
from jose import jwt, JWTError
from fastapi import HTTPException, status

from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

class AuthService:
    """Core authentication service."""

    def __init__(self) -> None:
        # Load required secrets from Key Vault at first use
        self._credential = DefaultAzureCredential()
        self._kv_url = self._get_secret("KEY_VAULT_URL")
        self._client_id = self._get_secret("AZURE_AD_CLIENT_ID")
        self._client_secret = self._get_secret("AZURE_AD_CLIENT_SECRET")
        self._tenant_id = self._get_secret("AZURE_AD_TENANT_ID")
        self._authority = f"https://login.microsoftonline.com/{self._tenant_id}"
        self._app = ConfidentialClientApplication(
            client_id=self._client_id,
            client_credential=self._client_secret,
            authority=self._authority,
        )
        # Cache OpenID configuration once per process lifetime
        self._openid_config: Dict[str, Any] = {}

    # ----------------------------------------------------------------------
    # Public async API
    # ----------------------------------------------------------------------
    async def login(self, username: str, password: str) -> dict:
        """
        Perform Resource Owner Password Credentials (ROPC) flow.

        Returns:
            {
                "access_token": "...",
                "refresh_token": "...",
                "expires_in": int   # seconds until expiry
            }
        """
        scopes = ["https://graph.microsoft.com/.default"]
        result = await asyncio.get_event_loop().run_in_executor(
            None,
            lambda: self._app.acquire_token_by_username_password(
                username=username,
                password=password,
                scopes=scopes,
            ),
        )
        if "access_token" not in result:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password",
            )
        return {
            "access_token": result["access_token"],
            "refresh_token": result.get("refresh_token", ""),
            "expires_in": result.get("expires_in", 0),
        }

    async def refresh(self, refresh_token: str) -> dict:
        """
        Refresh an access token using a refresh token.

        Returns:
            {
                "access_token": "...",
                "expires_in": int
            }
        """
        scopes = ["https://graph.microsoft.com/.default"]
        result = await asyncio.get_event_loop().run_in_executor(
            None,
            lambda: self._app.acquire_token_by_refresh_token(
                refresh_token=refresh_token,
                scopes=scopes,
            ),
        )
        if "access_token" not in result:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token invalid or expired",
            )
        return {
            "access_token": result["access_token"],
            "expires_in": result.get("expires_in", 0),
        }

    async def validate_token(self, token: str) -> dict:
        """
        Validate a JWT against Azure AD's signing keys and expected claims.

        Returns the decoded payload on success, otherwise raises HTTPException(401).
        """
        # Lazyload OpenID configuration
        if not self._openid_config:
            await self._load_openid_configuration()

        jwks_uri = self._openid_config.get("jwks_uri")
        if not jwks_uri:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="OpenID configuration is missing jwks_uri",
            )

        async with httpx.AsyncClient() as client:
            jwks_resp = await client.get(jwks_uri, timeout=10.0)
        jwks_resp.raise_for_status()
        jwks = jwks_resp.json()

        try:
            payload = jwt.decode(
                token,
                jwks,
                algorithms=self._openid_config.get("id_token_signing_alg_values_supported", ["RS256"]),
                audience=self._client_id,
                issuer=self._openid_config.get("issuer"),
                options={"verify_aud": True, "verify_iss": True},
            )
            return payload
        except JWTError as exc:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Token validation error: {str(exc)}",
            )

    def decode_token(self, token: str) -> dict:
        """Return token payload without signature verification."""
        try:
            return jwt.get_unverified_claims(token)
        except JWTError as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unable to decode token: {str(exc)}",
            )

    # ----------------------------------------------------------------------
    # Private helpers
    # ----------------------------------------------------------------------
    def _get_secret(self, name: str) -> str:
        """
        Retrieve a secret from Azure Key Vault.

        Args:
            name: The name of the secret.

        Returns:
            The secret value as a string.
        """
        client = SecretClient(vault_url=self._kv_url, credential=self._credential)
        secret_bundle = client.get_secret(name)
        return secret_bundle.value

    async def _load_openid_configuration(self) -> None:
        """Fetch Azure AD OpenID configuration."""
        config_url = f"https://login.microsoftonline.com/{self._tenant_id}/v2.0/.well-known/openid-configuration"
        async with httpx.AsyncClient() as client:
            resp = await client.get(config_url, timeout=10.0)
        resp.raise_for_status()
        self._openid_config = resp.json()
