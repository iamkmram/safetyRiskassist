"""
Documents function package initialisation.

Provides common utilities for document CRUD Azure Functions.
"""

import logging
from typing import Any, Dict

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

def validate_document_payload(payload: Dict[str, Any]) -> None:
    """
    Validates that a document payload contains the required fields.

    Raises:
        ValueError: If validation fails.
    """
    required = {'title', 'content', 'author_id'}
    missing = required - payload.keys()
    if missing:
        raise ValueError(f'Missing required document fields: {", ".join(missing)}')
