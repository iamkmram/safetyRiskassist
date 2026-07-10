import os
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

class KeyVaultClient:
    """Simple wrapper around Azure Key Vault SecretClient."""

    def __init__(self):
        vault_url = os.getenv("KEY_VAULT_URL")
        if not vault_url:
            raise ValueError("KEY_VAULT_URL environment variable not set")
        credential = DefaultAzureCredential()
        self.client = SecretClient(vault_url=vault_url, credential=credential)

    def get_secret(self, name: str) -> str:
        secret = self.client.get_secret(name)
        return secret.value
