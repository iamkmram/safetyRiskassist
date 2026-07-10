from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True)
    knowledge_item_id = Column(Integer, ForeignKey("knowledge_items.id"))
    filename = Column(String, nullable=False)
    data = Column(Text)  # In a real app this would be a BLOB or external storage reference
    knowledge_item = relationship("KnowledgeItem")

