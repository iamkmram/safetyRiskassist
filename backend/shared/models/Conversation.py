from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

class Conversation(Base):
    __tablename__ = "conversations"
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    # Example relationship to messages (optional)
    messages = relationship("Message", back_populates="conversation")

