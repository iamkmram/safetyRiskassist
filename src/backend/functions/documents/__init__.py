from fastapi import APIRouter, Depends, HTTPException, Query
from uuid import UUID
from src.backend.shared.services.PermissionService import canViewHelp
from src.backend.shared.services.DatabaseService import (
    getHelpArticles,
    getHelpArticleById,
)

router = APIRouter(prefix="/help", tags=["Help"])

def verify_permission(user_role: str = "user"):
    """Dependency that checks if the user can view help articles."""
    if not canViewHelp(user_role):
        raise HTTPException(status_code=403, detail="Forbidden")
    return True

@router.get("/articles", response_model=dict)
async def list_help_articles(
    category: str | None = Query(default=None),
    search: str | None = Query(default=None),
    popular: bool = Query(default=False),
    recent: bool = Query(default=False),
    _: bool = Depends(verify_permission),
):
    """
    Returns a list of help articles with optional filtering.
    """
    filter_params = {
        "category": category,
        "search": search,
        "popular": popular,
        "recent": recent,
    }
    articles = await getHelpArticles(filter_params)
    return {"articles": articles}

@router.get("/articles/{article_id}", response_model=dict)
async def get_help_article(
    article_id: UUID,
    _: bool = Depends(verify_permission),
):
    """
    Returns a single help article identified by its UUID.
    """
    article = await getHelpArticleById(str(article_id))
    if not article:
        raise HTTPException(status_code=404, detail="Help article not found")
    return article
