import os
from .key_vault_client import KeyVaultClient
from .app_insights_client import AppInsightsClient

class AzureConfig:
    """Utility to retrieve Azure configuration and secrets."""

    @staticmethod
    def get_secret(secret_name: str) -> str:
        """Fetch a secret value from Azure Key Vault."""
        client = KeyVaultClient()
        return client.get_secret(secret_name)

    @staticmethod
    def get_app_insights_key() -> str:
        """Return the Application Insights instrumentation key."""
        return os.getenv("APP_INSIGHTS_INSTRUMENTATION_KEY", "")
