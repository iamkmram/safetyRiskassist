import json
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.shared.middleware.auth import get_current_user  # Adjust import if name differs
from backend.shared.services.ConversationService import ConversationService
from backend.shared.models.Conversation import Conversation

router = APIRouter(
    prefix="/api/v1/chat/conversations",
    tags=["conversations"],
    dependencies=[Depends(get_current_user)],
)

def _error_response(exc: HTTPException):
    return {
        "error": exc.detail,
        "detail": exc.detail,
        "code": exc.status_code,
    }

@router.get("/", response_model=List[dict])
def list_conversations(
    current_user=Depends(get_current_user), db: Session = Depends(lambda: None)
):
    """
    List all conversations belonging to the authenticated user.
    """
    service = ConversationService(db)
    conversations = service.list_conversations(current_user.id)
    # Convert ORM objects to snake_case dicts
    return [
        {
            "id": c.id,
            "title": c.title,
            "metadata": c.metadata,
            "created_at": c.created_at.isoformat(),
        }
        for c in conversations
    ]

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=dict)
def create_conversation(
    payload: dict,
    current_user=Depends(get_current_user),
    db: Session = Depends(lambda: None),
):
    """
    Create a new conversation.
    Expected JSON: { "title": "string", "metadata": { ... } }
    """
    service = ConversationService(db)
    try:
        conv = service.create_conversation(current_user.id, payload)
        return {
            "id": conv.id,
            "title": conv.title,
            "metadata": conv.metadata,
            "created_at": conv.created_at.isoformat(),
        }
    except HTTPException as exc:
        raise exc

@router.get("/{conversation_id}", response_model=dict)
def get_conversation(
    conversation_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(lambda: None),
):
    """
    Retrieve a single conversation with its metadata.
    """
    service = ConversationService(db)
    try:
        conv = service.get_conversation(current_user.id, conversation_id)
        return {
            "id": conv.id,
            "title": conv.title,
            "metadata": conv.metadata,
            "created_at": conv.created_at.isoformat(),
        }
    except HTTPException as exc:
        raise exc

@router.delete("/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_conversation(
    conversation_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(lambda: None),
):
    """
    Harddelete a conversation.
    """
    service = ConversationService(db)
    try:
        service.delete_conversation(current_user.id, conversation_id)
        return
    except HTTPException as exc:
        raise exc
