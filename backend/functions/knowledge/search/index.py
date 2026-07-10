"""
FastAPI endpoint for hybrid knowledge search.
"""

from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel, Field

from backend.shared.services.SearchService import SearchService
from backend.shared.services.KnowledgeService import KnowledgeService

router = APIRouter(prefix="/api/v1/knowledge/search", tags=["knowledge"])

class SearchRequest(BaseModel):
    query: str = Field(..., description="Search term(s).")
    top: Optional[int] = Field(10, ge=1, le=100, description="Maximum number of results to return.")

class SearchResultItem(BaseModel):
    id: UUID
    title: str
    excerpt: Optional[str] = None
    score: float
    metadata: Optional[dict] = None

async def get_search_service() -> SearchService:
    return SearchService()

async def get_knowledge_service() -> KnowledgeService:
    return KnowledgeService()

@router.post("/", response_model=List[SearchResultItem])
async def search_knowledge(
    request: Request,
    payload: SearchRequest,
    search_svc: SearchService = Depends(get_search_service),
    knowledge_svc: KnowledgeService = Depends(get_knowledge_service),
) -> List[SearchResultItem]:
    """
    Perform a hybrid search over knowledge items, applying permission filtering.
    """
    # Extract user ID populated by upstream auth middleware.
    user_id: Optional[str] = getattr(request.state, "user_id", None)
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing authentication")

    # Delegate to KnowledgeService which internally uses SearchService.
    results = await knowledge_svc.search_items(query=payload.query, user_id=user_id, top=payload.top)

    # Convert dicts to Pydantic models.
    return [SearchResultItem(**item) for item in results]
