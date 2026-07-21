# Resume model will go here.
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    original_file_name = Column(String)
    stored_file_name = Column(String)
    file_path = Column(String)
    extracted_text = Column(Text)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="resumes")
    analysis = relationship("ResumeAnalysis", back_populates="resume", uselist=False)