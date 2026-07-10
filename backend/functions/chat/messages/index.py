import json
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.shared.middleware.auth import get_current_user
from backend.shared.services.ConversationService import ConversationService
from backend.shared.models.Message import Message

router = APIRouter(
    prefix="/api/v1/chat/messages",
    tags=["messages"],
    dependencies=[Depends(get_current_user)],
)

@router.get("/conversation/{conversation_id}", response_model=List[dict])
def list_messages(
    conversation_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(lambda: None),
):
    """
    List messages for a conversation ordered by timestamp.
    """
    service = ConversationService(db)
    msgs = service.list_messages(current_user.id, conversation_id)
    return [
        {
            "id": m.id,
            "conversation_id": m.conversation_id,
            "role": m.role,
            "content": m.content,
            "created_at": m.created_at.isoformat(),
        }
        for m in msgs
    ]

@router.post("/conversation/{conversation_id}", status_code=status.HTTP_201_CREATED, response_model=dict)
def add_message(
    conversation_id: int,
    payload: dict,
    current_user=Depends(get_current_user),
    db: Session = Depends(lambda: None),
):
    """
    Add a new message to a conversation.
    Expected payload: { "role": "user|assistant", "content": "string" }
    """
    service = ConversationService(db)
    msg = service.add_message(current_user.id, conversation_id, payload)
    return {
        "id": msg.id,
        "conversation_id": msg.conversation_id,
        "role": msg.role,
        "content": msg.content,
        "created_at": msg.created_at.isoformat(),
    }

@router.put("/{message_id}", response_model=dict)
def update_message(
    message_id: int,
    payload: dict,
    current_user=Depends(get_current_user),
    db: Session = Depends(lambda: None),
):
    """
    Update a message's content. Only the owner can edit.
    Payload may contain ``content``.
    """
    service = ConversationService(db)
    msg = service.update_message(current_user.id, message_id, payload)
    return {
        "id": msg.id,
        "conversation_id": msg.conversation_id,
        "role": msg.role,
        "content": msg.content,
        "created_at": msg.created_at.isoformat(),
    }

@router.delete("/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_message(
    message_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(lambda: None),
):
    """
    Delete a message.
    """
    service = ConversationService(db)
    service.delete_message(current_user.id, message_id)
    return
