import os
import logging
from opencensus.ext.azure.log_exporter import AzureLogHandler

class AppInsightsClient:
    """Minimal wrapper for Azure Application Insights logging."""

    def __init__(self):
        instrumentation_key = os.getenv("APP_INSIGHTS_INSTRUMENTATION_KEY")
        self.logger = logging.getLogger("appinsights")
        if instrumentation_key:
            self.logger.addHandler(
                AzureLogHandler(
                    connection_string=f"InstrumentationKey={instrumentation_key}"
                )
            )
        self.logger.setLevel(logging.INFO)

    def log(self, message: str, level: int = logging.INFO):
        self.logger.log(level, message)
