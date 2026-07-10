"""
Documents package initializer.
Provides helper functions to interact with the documents table.
"""

from typing import List, Dict, Any
import os
import logging
import psycopg2
from psycopg2.extras import RealDictCursor

logger = logging.getLogger(__name__)

# Simple connection helper - in production this would be a pooling solution.
def _get_connection():
    try:
        conn = psycopg2.connect(
            dsn=os.getenv('DATABASE_URL')
        )
        return conn
    except Exception as exc:
        logger.exception("Database connection failed")
        raise

def list_documents_by_knowledge_item(knowledge_item_id: str) -> List[Dict[str, Any]]:
    """
    Returns all document metadata linked to a given knowledge_item_id.
    """
    query = """
        SELECT id, filename, file_url, uploaded_at
        FROM documents
        WHERE knowledge_item_id = %s
        ORDER BY uploaded_at DESC
    """
    try:
        with _get_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(query, (knowledge_item_id,))
                return cur.fetchall()
    except Exception as exc:
        logger.exception("Failed to fetch documents for knowledge_item_id %s", knowledge_item_id)
        raise
