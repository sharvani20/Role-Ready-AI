from sqlalchemy import Column, Integer, ForeignKey, DateTime, JSON
from sqlalchemy.sql import func
from app.db.database import Base


class Roadmap(Base):
    __tablename__ = "roadmaps"

    id = Column(Integer, primary_key=True, index=True)

    resume_id = Column(
        Integer,
        ForeignKey("resumes.id", ondelete="CASCADE"),
        unique=True,
        nullable=False
    )

    # SQLite-compatible JSON columns
    career_level = Column(JSON)
    learning_roadmap = Column(JSON)
    recommended_projects = Column(JSON)
    interview_questions = Column(JSON)
    certifications = Column(JSON)
    career_advice = Column(JSON)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )