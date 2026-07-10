"""Azure configuration utilities.

This module provides a simple configuration loader that reads
environment variables required for Azure services.
"""

import os
from dataclasses import dataclass

@dataclass(frozen=True)
class AzureConfig:
    """Container for Azure service configuration."""
    key_vault_name: str = os.getenv("AZURE_KEY_VAULT_NAME", "")
    app_insights_instrumentation_key: str = os.getenv("APP_INSIGHTS_INSTRUMENTATION_KEY", "")
    search_service_name: str = os.getenv("AZURE_SEARCH_SERVICE_NAME", "")
    search_index_name: str = os.getenv("AZURE_SEARCH_INDEX_NAME", "")
    search_api_key: str = os.getenv("AZURE_SEARCH_API_KEY", "")

    @property
    def is_valid(self) -> bool:
        """Return True if all required settings are present."""
        required = [
            self.key_vault_name,
            self.app_insights_instrumentation_key,
            self.search_service_name,
            self.search_index_name,
            self.search_api_key,
        ]
        return all(bool(v) for v in required)

# Export a singleton for easy import
config = AzureConfig()

