"""
SearchService wraps Azure AI Search to provide hybrid (keyword + vector) search.

It constructs a hybrid query that combines a traditional fulltext search
with a vector similarity search.  The vector is generated using a simple
placeholder embedding function; in a real deployment this would call an
embedding model (e.g., Azure OpenAI embeddings).

All I/O is async so the service can be used in FastAPI routes without
blocking the event loop.
"""
import os
import json
import logging
from typing import List, Dict, Any

from azure.core.credentials import AzureKeyCredential
from azure.search.documents import SearchClient
from azure.search.documents.models import Vector, VectorQuery, ScoringProfile

from fastapi import HTTPException, status

# Import configuration utilities (assumed to return env vars)
from backend.shared.utils.azure_config import get_azure_search_endpoint, get_azure_search_key, get_azure_search_index

logger = logging.getLogger(__name__)

def _simple_embed(text: str) -> List[float]:
    """
    Placeholder embedding generator.
    Returns a deterministic 1536dimensional vector for the given text.
    In production replace with an actual embedding model.
    """
    # Simple deterministic pseudoembedding: hash the text and repeat.
    import hashlib, struct
    hash_bytes = hashlib.sha256(text.encode("utf-8")).digest()
    # Convert first 8 bytes to a float and repeat to fill vector size.
    base = struct.unpack("d", hash_bytes[:8])[0]
    return [float(base) for _ in range(1536)]

class SearchService:
    """
    Provides a single public method `search` that performs a hybrid
    search against Azure AI Search and returns a list of normalized
    result dictionaries.
    """

    def __init__(self) -> None:
        endpoint = get_azure_search_endpoint()
        key = get_azure_search_key()
        index_name = get_azure_search_index()

        if not all([endpoint, key, index_name]):
            raise RuntimeError("Azure Search configuration missing.")

        credential = AzureKeyCredential(key)
        self.client = SearchClient(endpoint=endpoint, index_name=index_name, credential=credential)

    async def search(
        self,
        query: str,
        user_id: str,
        top: int = 10,
        skip: int = 0,
    ) -> List[Dict[str, Any]]:
        """
        Execute a hybrid search.

        Args:
            query (str): The user query string.
            user_id (str): ID of the requesting user (used for logging/audit).
            top (int): Number of results to return.
            skip (int): Number of results to skip (pagination).

        Returns:
            List[dict]: Normalized search result items.
        """
        # Generate vector representation of the query.
        vector = _simple_embed(query)

        # Build the hybrid query.
        # Azure Search hybrid query combines 'search' (keyword) with a VectorQuery.
        # The SDK does not expose a direct hybrid helper, so we build a raw OData filter.
        try:
            # Vector query object
            vector_query = VectorQuery(vector=vector, k=top + skip, fields=["contentVector"])
            # Combine with keyword search using 'search' parameter.
            results = self.client.search(
                search_text=query,
                vectors=[vector_query],
                top=top,
                skip=skip,
                query_type="semantic",  # using semantic to enable richer scoring; optional.
                include_total_count=True,
                # Ensure the full document is returned.
                select="*",
            )
        except Exception as exc:
            logger.exception("Azure Search error")
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Search service unavailable: {str(exc)}",
            ) from exc

        normalized = []
        async for result in results:
            # Azure Search returns a SearchResult object; we turn it into a plain dict.
            doc = result.get_document()
            normalized.append({
                "id": doc.get("id"),
                "title": doc.get("title"),
                "excerpt": doc.get("excerpt"),
                "score": result.get("@search.score", 0.0),
                "metadata": doc.get("metadata", {}),
            })
        return normalized
