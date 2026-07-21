# Resume analysis model will go here.
from sqlalchemy import Column, Integer, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base

class ResumeAnalysis(Base):
    __tablename__ = "resume_analyses"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), unique=True)

    score = Column(Integer)
    skills = Column(Text)
    missing_skills = Column(Text)
    strengths = Column(Text)
    weaknesses = Column(Text)
    suggestions = Column(Text)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    resume = relationship("Resume", back_populates="analysis")