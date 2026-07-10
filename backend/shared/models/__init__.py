# Export all SQLAlchemy model classes for convenient imports
from .User import User
from .Role import Role
from .Permission import Permission
from .Department import Department
from .Conversation import Conversation
from .Message import Message
from .KnowledgeItem import KnowledgeItem
from .Document import Document
from .AuditLog import AuditLog

__all__ = [
    "User",
    "Role",
    "Permission",
    "Department",
    "Conversation",
    "Message",
    "KnowledgeItem",
    "Document",
    "AuditLog",
]
