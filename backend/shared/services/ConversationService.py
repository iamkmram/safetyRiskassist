import logging
from typing import Any, Dict, List, Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from backend.shared.models.Conversation import Conversation
from backend.shared.models.Message import Message

logger = logging.getLogger(__name__)

class ConversationService:
    """
    Service class encapsulating conversation and message DB operations.
    """

    def __init__(self, db: Session) -> None:
        self.db = db

    # ---------- Conversation methods ----------
    def list_conversations(self, user_id: int) -> List[Conversation]:
        """Return all conversations belonging to a user."""
        logger.debug("Listing conversations for user_id=%s", user_id)
        return (
            self.db.query(Conversation)
            .filter(Conversation.user_id == user_id)
            .order_by(Conversation.created_at.desc())
            .all()
        )

    def create_conversation(self, user_id: int, data: Dict[str, Any]) -> Conversation:
        """
        Create a new conversation.

        ``data`` should contain ``title`` and optional ``metadata`` (dict).
        """
        logger.debug(
            "Creating conversation for user_id=%s with data=%s", user_id, data
        )
        conv = Conversation(
            user_id=user_id,
            title=data.get("title", ""),
            metadata=data.get("metadata", {}),
        )
        self.db.add(conv)
        self.db.commit()
        self.db.refresh(conv)
        return conv

    def get_conversation(self, user_id: int, conv_id: int) -> Conversation:
        """Retrieve a single conversation; raise 404/403 as needed."""
        logger.debug(
            "Fetching conversation conv_id=%s for user_id=%s", conv_id, user_id
        )
        conv = (
            self.db.query(Conversation)
            .filter(Conversation.id == conv_id)
            .first()
        )
        if not conv:
            logger.warning("Conversation %s not found", conv_id)
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found",
            )
        if conv.user_id != user_id:
            logger.warning(
                "Permission violation: user %s accessing conversation %s",
                user_id,
                conv_id,
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this conversation",
            )
        return conv

    def delete_conversation(self, user_id: int, conv_id: int) -> None:
        """Harddelete a conversation."""
        conv = self.get_conversation(user_id, conv_id)
        logger.debug("Deleting conversation conv_id=%s", conv_id)
        self.db.delete(conv)
        self.db.commit()

    # ---------- Message methods ----------
    def list_messages(self, user_id: int, conv_id: int) -> List[Message]:
        """List messages of a conversation ordered by timestamp."""
        logger.debug(
            "Listing messages for conversation %s (user %s)", conv_id, user_id
        )
        # Verify ownership first
        self.get_conversation(user_id, conv_id)
        return (
            self.db.query(Message)
            .filter(Message.conversation_id == conv_id)
            .order_by(Message.created_at.asc())
            .all()
        )

    def add_message(
        self, user_id: int, conv_id: int, data: Dict[str, Any]
    ) -> Message:
        """Add a new message to a conversation."""
        logger.debug(
            "Adding message to conversation %s for user %s with data=%s",
            conv_id,
            user_id,
            data,
        )
        # Ensure the conversation belongs to the user
        self.get_conversation(user_id, conv_id)

        msg = Message(
            conversation_id=conv_id,
            role=data["role"],
            content=data["content"],
        )
        self.db.add(msg)
        self.db.commit()
        self.db.refresh(msg)
        return msg

    def update_message(
        self, user_id: int, msg_id: int, data: Dict[str, Any]
    ) -> Message:
        """Update a message's content; only the owner may edit."""
        logger.debug(
            "Updating message %s for user %s with data=%s", msg_id, user_id, data
        )
        msg = self.db.query(Message).filter(Message.id == msg_id).first()
        if not msg:
            logger.warning("Message %s not found", msg_id)
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Message not found",
            )
        # Verify ownership via the parent conversation
        conv = self.db.query(Conversation).filter(Conversation.id == msg.conversation_id).first()
        if not conv or conv.user_id != user_id:
            logger.warning(
                "Permission violation: user %s trying to edit message %s", user_id, msg_id
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to edit this message",
            )
        msg.content = data.get("content", msg.content)
        self.db.commit()
        self.db.refresh(msg)
        return msg

    def delete_message(self, user_id: int, msg_id: int) -> None:
        """Delete a message; only the owner may delete."""
        logger.debug("Deleting message %s for user %s", msg_id, user_id)
        msg = self.db.query(Message).filter(Message.id == msg_id).first()
        if not msg:
            logger.warning("Message %s not found", msg_id)
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Message not found",
            )
        conv = self.db.query(Conversation).filter(Conversation.id == msg.conversation_id).first()
        if not conv or conv.user_id != user_id:
            logger.warning(
                "Permission violation: user %s trying to delete message %s", user_id, msg_id
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this message",
            )
        self.db.delete(msg)
        self.db.commit()
