"""
Admin package initializer.
Provides utilities for administrative tasks such as user provisioning.
"""

import logging
import os
import psycopg2
from psycopg2.extras import RealDictCursor

logger = logging.getLogger(__name__)

def _connect():
    try:
        conn = psycopg2.connect(dsn=os.getenv('DATABASE_URL'))
        return conn
    except Exception as exc:
        logger.exception("Failed to connect to the database for admin tasks")
        raise

def create_user(email: str, password_hash: str, full_name: str):
    """
    Inserts a new user record. Returns the new user's UUID.
    """
    sql = """
        INSERT INTO users (email, password_hash, full_name)
        VALUES (%s, %s, %s)
        RETURNING id;
    """
    try:
        with _connect() as conn:
            with conn.cursor() as cur:
                cur.execute(sql, (email, password_hash, full_name))
                user_id = cur.fetchone()[0]
                conn.commit()
                logger.info("Created admin user %s", email)
                return user_id
    except Exception as exc:
        logger.exception("Failed to create admin user %s", email)
        raise
