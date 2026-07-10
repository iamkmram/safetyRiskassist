"""
Alert function package initialisation.

Provides helper to publish alert messages to a queue or topic.
All functions within this package should import `publish_alert` from here.
"""

import json
import logging
import os
from typing import Any, Dict

# Configure a logger for this package
logger = logging.getLogger(__name__)
if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter(
        fmt='[%(asctime)s] %(levelname)s %(name)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)

def publish_alert(alert: Dict[str, Any]) -> None:
    """
    Publishes an alert dictionary to the configured Azure Service Bus queue
    or any other messaging system defined by environment variables.

    Args:
        alert: Dictionary containing alert data (must be JSONserialisable).

    Raises:
        RuntimeError: If publishing fails.
    """
    try:
        # Example placeholder - replace with real client when wiring up
        queue_name = os.getenv('ALERTS_QUEUE_NAME')
        if not queue_name:
            raise RuntimeError('ALERTS_QUEUE_NAME env var not set.')

        payload = json.dumps(alert)
        # In a real implementation you would use ServiceBusSender or similar.
        logger.info(f'Publishing alert to queue {queue_name}: {payload}')
        # Simulated success
    except Exception as exc:
        logger.error(f'Failed to publish alert: {exc}')
        raise RuntimeError('Alert publishing failed') from exc
