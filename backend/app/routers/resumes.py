# Resume routes will go here.
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid, os

from app.db.dependencies import get_db
from app.models.resumes import Resume
from app.models.resume_analysis import ResumeAnalysis
from app.models.users import User
from app.utils.auth import get_current_user
from app.services.pdf_service import extract_text_from_pdf
from app.services.ai_service import analyze_resume

router = APIRouter(prefix="/resumes", tags=["Resumes"])

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if file.content_type != "application/pdf":
        raise HTTPException(400, "Only PDF files are allowed")

    os.makedirs("uploads", exist_ok=True)

    file_name = f"{uuid.uuid4()}.pdf"
    file_path = f"uploads/{file_name}"

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    resume_text = extract_text_from_pdf(file_path)

    analysis = analyze_resume(resume_text, job_description)

    resume = Resume(
        user_id=current_user.id,
        original_file_name=file.filename,
        stored_file_name=file_name,
        file_path=file_path,
        extracted_text=resume_text
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)

    resume_analysis = ResumeAnalysis(
        resume_id=resume.id,
        score=analysis["score"],
        skills=", ".join(analysis["skills"]),
        missing_skills=", ".join(analysis["missing_skills"]),
        strengths="\n".join(analysis["strengths"]),
        weaknesses="\n".join(analysis["weaknesses"]),
        suggestions="\n".join(analysis["suggestions"])
    )

    db.add(resume_analysis)
    db.commit()

    return {
        "resume_id": resume.id,
        "score": analysis["score"],
        "skills": analysis.get("skills", []),
        "missing_skills": analysis.get("missing_skills", []),
        "strengths": analysis.get("strengths", []),
        "weaknesses": analysis.get("weaknesses", []),
        "suggestions": analysis.get("suggestions", []),
        "message": "Resume analyzed successfully"
    }
@router.get("/{resume_id}/analysis")
def get_analysis(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    analysis = db.query(ResumeAnalysis).filter(ResumeAnalysis.resume_id == resume_id).first()

    if not analysis:
        raise HTTPException(404, "Analysis not found")

    return {
        "score": analysis.score,
        "skills": analysis.skills.split(", ") if analysis.skills else [],
        "missing_skills": analysis.missing_skills.split(", ") if analysis.missing_skills else [],
        "strengths": analysis.strengths.split("\n") if analysis.strengths else [],
        "weaknesses": analysis.weaknesses.split("\n") if analysis.weaknesses else [],
        "suggestions": analysis.suggestions.split("\n") if analysis.suggestions else []
    }

@router.get("/latest/summary")
def get_latest_resume_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.id.desc()).first()
    if not resume:
        return {"has_resume": False}
        
    return {
        "has_resume": True,
        "resume_id": resume.id,
        "filename": resume.original_file_name,
        "score": resume.analysis.score if resume.analysis else 0,
        "uploaded_at": resume.uploaded_at
    }