"""Application Insights client stub.

Provides a minimal wrapper that mimics the telemetry API used by the
application.  In real deployments this would forward data to Azure
Application Insights."""
import os

class AppInsightsClient:
    """Very small client that pretends to send telemetry."""

    def __init__(self, instrumentation_key: str):
        self.instrumentation_key = instrumentation_key

    def track_event(self, name: str, properties: dict | None = None):
        """Noop placeholder for event tracking."""
        # In a real implementation this would call the Azure SDK.
        pass

    def is_ready(self) -> bool:
        """Return True if an instrumentation key is configured."""
        return bool(self.instrumentation_key)

