from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Message(Base):
    __tablename__ = 'message'
    id = Column(Integer, primary_key=True, autoincrement=True)

    # Add additional columns as needed per entity requirements
    # Example generic fields:
    name = Column(String(255), nullable=False, unique=True)
    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=True)

    # Relationships placeholder (to be refined later)
    # e.g., user_id = Column(Integer, ForeignKey('user.id'))
    # related = relationship("OtherModel", back_populates="parent")
