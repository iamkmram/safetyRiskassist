"""
FastAPI endpoint that returns items citing a given KnowledgeItem.
"""

from uuid import UUID
from typing import List

from fastapi import APIRouter, Depends, Request, HTTPException, status
from pydantic import BaseModel

from backend.shared.services.KnowledgeService import KnowledgeService

router = APIRouter(prefix="/api/v1/knowledge", tags=["knowledge"])

class CitationResponse(BaseModel):
    citing_item_id: UUID
    title: str

async def get_knowledge_service() -> KnowledgeService:
    return KnowledgeService()

@router.get("/{item_id}/citations", response_model=List[CitationResponse])
async def get_citations(
    item_id: UUID,
    request: Request,
    knowledge_svc: KnowledgeService = Depends(get_knowledge_service),
):
    """
    List all knowledge items that cite the provided item.
    """
    # Authentication required for any knowledge access
    user_id: str = getattr(request.state, "user_id", None)
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing authentication")

    # Permission enforcement is handled inside the service if needed.
    citations = await knowledge_svc.list_citations(item_id=item_id)
    return [CitationResponse(**c) for c in citations]
