from ..utils.azure_config import AzureConfig
from ..utils.key_vault_client import KeyVaultClient
from ..utils.app_insights_client import AppInsightsClient

class AzureServices:
    """Facade exposing Azurerelated utilities to the rest of the backend."""

    def __init__(self):
        self.config = AzureConfig()
        self.key_vault = KeyVaultClient()
        self.app_insights = AppInsightsClient()
