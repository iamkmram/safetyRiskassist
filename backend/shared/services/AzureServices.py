"""Azure services wrapper.

Provides thin wrappers around Azure SDK clients.  In this repository the
implementations are stubs suitable for local development and unit testing.
"""

from .utils.azure_config import AzureConfig
from .utils.key_vault_client import KeyVaultClient
from .utils.app_insights_client import AppInsightsClient

class AzureServices:
    """Facade exposing the three core Azure services."""

    def __init__(self, config: AzureConfig | None = None):
        self.config = config or AzureConfig()
        self.key_vault = KeyVaultClient(self.config.key_vault_name)
        self.app_insights = AppInsightsClient(self.config.app_insights_instrumentation_key)

    def is_ready(self) -> bool:
        """Return True when all underlying services report ready."""
        return (
            self.key_vault.is_ready()
            and self.app_insights.is_ready()
        )

