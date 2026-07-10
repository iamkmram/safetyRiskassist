"""Key Vault client stub.

In production this would wrap Azure Key Vault SDK calls.
Here we provide a very small wrapper that reads secrets from
environment variables (useful for local development & tests)."""

import os
from typing import Optional

class KeyVaultClient:
    """Simple client to fetch secrets from Azure Key Vault."""

    def __init__(self, vault_name: str):
        self.vault_name = vault_name

    def get_secret(self, secret_name: str) -> Optional[str]:
        """
        Retrieve a secret value.

        For local/dev environments we fall back to an environment variable
        named KEYVAULT_<SECRET_NAME>. Uppercase secret_name is used.
        """
        env_var = f"KEYVAULT_{secret_name.upper()}"
        return os.getenv(env_var)

# Export a readytouse client based on the config (if available)
from .azure_config import config

key_vault_client = KeyVaultClient(vault_name=config.key_vault_name) if config.key_vault_name else None

