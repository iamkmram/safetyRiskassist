"""
KnowledgeService provides CRUD operations for KnowledgeItem entities,
integrates with Azure AI Search for indexing/search, and enforces
permission checks via PermissionService.
"""
import logging
import uuid
from typing import List, Dict, Any, Optional

from fastapi import HTTPException, status

# Import the Pydantic/SQLAlchemy model (assumed to be a Pydantic BaseModel for simplicity)
from backend.shared.models.KnowledgeItem import KnowledgeItem

# Shared services
from backend.shared.services.DatabaseService import DatabaseService
from backend.shared.services.SearchService import SearchService
from backend.shared.services.PermissionService import PermissionService

logger = logging.getLogger(__name__)

class KnowledgeService:
    """
    Service layer encapsulating business logic for knowledge items.
    All methods are async to match the surrounding FastAPI ecosystem.
    """

    def __init__(self) -> None:
        self.db = DatabaseService()
        self.search = SearchService()
        self.perm = PermissionService()

    # ------------------------------------------------------------------
    # CRUD helpers
    # ------------------------------------------------------------------
    async def create_item(self, item_data: Dict[str, Any], creator_id: str) -> KnowledgeItem:
        """
        Persist a new KnowledgeItem and index it in Azure Search.
        """
        # Permission check: creator must have "create_knowledge" permission.
        if not await self.perm.check_permission(user_id=creator_id, action="create_knowledge"):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")

        # Create model instance (assuming KnowledgeItem can be instantiated from dict)
        item = KnowledgeItem(**item_data, created_by=creator_id)
        await self.db.add(item)  # Persist
        await self.db.commit()

        # Index in Azure Search (asynchronous but fireandforget for now)
        try:
            await self.search.client.upload_documents([item.dict()])
        except Exception as exc:
            logger.warning(f"Failed to index KnowledgeItem {item.id}: {exc}")

        return item

    async def update_item(self, item_id: uuid.UUID, updates: Dict[str, Any], user_id: str) -> KnowledgeItem:
        """
        Update an existing KnowledgeItem after permission validation.
        """
        item = await self.get_item(item_id, user_id, require_permission=False)
        if not await self.perm.check_permission(user_id=user_id, resource=item, action="update_knowledge"):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")

        for key, value in updates.items():
            setattr(item, key, value)
        await self.db.commit()

        # Reindex the updated document.
        try:
            await self.search.client.upload_documents([item.dict()])
        except Exception as exc:
            logger.warning(f"Failed to reindex KnowledgeItem {item.id}: {exc}")

        return item

    async def delete_item(self, item_id: uuid.UUID, user_id: str) -> None:
        """
        Softdelete a KnowledgeItem after permission validation.
        """
        item = await self.get_item(item_id, user_id, require_permission=False)
        if not await self.perm.check_permission(user_id=user_id, resource=item, action="delete_knowledge"):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")

        item.is_deleted = True
        await self.db.commit()

        # Remove from Azure Search index.
        try:
            await self.search.client.delete_documents(key_names="id", key_values=[str(item.id)])
        except Exception as exc:
            logger.warning(f"Failed to delete KnowledgeItem {item.id} from search index: {exc}")

    async def get_item(
        self,
        item_id: uuid.UUID,
        user_id: str,
        require_permission: bool = True,
    ) -> KnowledgeItem:
        """
        Retrieve a KnowledgeItem by ID, optionally enforcing view permission.
        """
        item = await self.db.get(KnowledgeItem, item_id)
        if item is None or getattr(item, "is_deleted", False):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Knowledge item not found")

        if require_permission:
            if not await self.perm.check_permission(user_id=user_id, resource=item, action="view_knowledge"):
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
        return item

    # ------------------------------------------------------------------
    # Search & citation helpers
    # ------------------------------------------------------------------
    async def search_items(self, query: str, user_id: str, top: int = 10) -> List[Dict[str, Any]]:
        """
        Perform a hybrid search and filter results based on user permissions.
        """
        raw_results = await self.search.search(query=query, user_id=user_id, top=top)
        # Filter out items the user may not view.
        permitted = []
        for result in raw_results:
            # Lazy fetch the full item to verify permission.
            item = await self.db.get(KnowledgeItem, result["id"])
            if item and await self.perm.check_permission(user_id=user_id, resource=item, action="view_knowledge"):
                permitted.append(result)
        return permitted

    async def list_citations(self, item_id: uuid.UUID) -> List[Dict[str, Any]]:
        """
        Return a list of KnowledgeItems that cite the given item.
        The underlying schema is assumed to have a manytomany relationship
        via a `citations` association table.
        """
        # Simple implementation: query the DB directly.
        # Assuming KnowledgeItem has a relationship `cited_by` (list of KnowledgeItem)
        item = await self.db.get(KnowledgeItem, item_id)
        if item is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Knowledge item not found")

        citations = []
        for citing in getattr(item, "cited_by", []):
            citations.append({
                "citing_item_id": citing.id,
                "title": getattr(citing, "title", ""),
            })
        return citations
