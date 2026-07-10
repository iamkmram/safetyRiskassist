"""Shared SearchService used by knowledge functions."""

class SearchService:
    def __init__(self):
        # Initialize any vector store or keyword index here
        pass

    def hybrid_search(self, query: str, top_k: int = 10):
        """Perform combined keyword and vector search.
        Returns a list of matching knowledge item IDs.
        """
        # Placeholder implementation
        return []

