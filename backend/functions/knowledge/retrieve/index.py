"""
FastAPI endpoint to retrieve a single KnowledgeItem by its UUID.
"""

from uuid import UUID
from fastapi import APIRouter, Depends, Request, HTTPException, status
from pydantic import BaseModel

from backend.shared.models.KnowledgeItem import KnowledgeItem
from backend.shared.services.KnowledgeService import KnowledgeService

router = APIRouter(prefix="/api/v1/knowledge", tags=["knowledge"])

class KnowledgeItemResponse(BaseModel):
    id: UUID
    title: str
    content: str
    metadata: dict = {}

async def get_knowledge_service() -> KnowledgeService:
    return KnowledgeService()

@router.get("/{item_id}", response_model=KnowledgeItemResponse)
async def retrieve_knowledge(
    item_id: UUID,
    request: Request,
    knowledge_svc: KnowledgeService = Depends(get_knowledge_service),
):
    """
    Retrieve a knowledge item with permission enforcement.
    """
    user_id: str = getattr(request.state, "user_id", None)
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing authentication")

    item = await knowledge_svc.get_item(item_id=item_id, user_id=user_id)
    return KnowledgeItemResponse(
        id=item.id,
        title=item.title,
        content=item.content,
        metadata=getattr(item, "metadata", {}),
    )
