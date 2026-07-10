"""
Document function package.

Provides:
- upload_document(file, metadata, user_id)
- get_document(document_id, user_id)

Both functions raise informative exceptions on failure.
"""

import os
import uuid
import logging
from typing import Dict, Any

# Configure basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# In a real deployment you'd use cloud storage SDK (e.g., boto3 for S3).
# Here we store files under a local 'uploads' folder for illustration.

UPLOAD_ROOT = os.getenv('DOCUMENT_UPLOAD_ROOT', '/tmp/uploads')
os.makedirs(UPLOAD_ROOT, exist_ok=True)

def _store_file(file_bytes: bytes, original_name: str) -> str:
    """Store file locally and return a generated storage key."""
    ext = os.path.splitext(original_name)[1]
    storage_key = f"{uuid.uuid4()}{ext}"
    path = os.path.join(UPLOAD_ROOT, storage_key)
    try:
        with open(path, 'wb') as f:
            f.write(file_bytes)
        logger.info('File stored', extra={'key': storage_key, 'size': len(file_bytes)})
        return storage_key
    except Exception as e:
        logger.error('Failed to store file', exc_info=True)
        raise RuntimeError('File storage error') from e

def upload_document(file_bytes: bytes, filename: str, mime_type: str,
                   size_bytes: int, user_id: str, title: str) -> Dict[str, Any]:
    """
    Validate input, store the file, and return metadata for DB insertion.
    Raises RuntimeError on any failure.
    """
    if not all([file_bytes, filename, mime_type, size_bytes, user_id, title]):
        raise ValueError('All parameters are required.')

    if size_bytes != len(file_bytes):
        raise ValueError('Provided size does not match actual file size.')

    storage_key = _store_file(file_bytes, filename)

    # Return data that the caller can insert into the DB.
    return {
        'title': title,
        'file_key': storage_key,
        'mime_type': mime_type,
        'size_bytes': size_bytes,
        'uploaded_by': user_id,
    }

def get_document(document_id: str, user_id: str) -> Dict[str, Any]:
    """
    Fetch document metadata from DB and ensure the requesting user has permission.
    This stub assumes permission is already validated elsewhere.
    """
    # Placeholder: real implementation would query the database.
    raise NotImplementedError('Database fetch not implemented in stub.')
