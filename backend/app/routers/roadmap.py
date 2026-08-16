from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from app.db.dependencies import get_db
from app.models.roadmap import Roadmap
from app.models.users import User
from app.models.resumes import Resume
from app.utils.auth import get_current_user

router = APIRouter(prefix="/roadmap", tags=["Roadmap"])


class SkillRoadmapRequest(BaseModel):
    target_role: str
    missing_skills: List[str]


@router.post("/generate/{resume_id}")
def generate_roadmap(resume_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(404, "Resume not found")

    existing = db.query(Roadmap).filter(Roadmap.resume_id == resume_id).first()
    if existing:
        return {
            "resume_id": existing.resume_id,
            "career_level": existing.career_level,
            "learning_roadmap": existing.learning_roadmap,
            "recommended_projects": existing.recommended_projects,
            "interview_questions": existing.interview_questions,
            "certifications": existing.certifications,
            "career_advice": existing.career_advice,
        }

    roadmap_data = {
        "career_level": "Intermediate",
        "learning_roadmap": [
            {
                "week": 1,
                "title": "Foundations & Resume Gap Alignment",
                "topics": [
                    "Review your personal resume gaps and target job keywords",
                    "Strengthen core fundamentals (algorithms, data structures)",
                    "Set up local development environments and target tools"
                ],
                "study_hours": 8,
                "resources": [
                    {"title": "Roadmap Starter Guide", "url": "https://example.com/guide", "icon": "book"},
                    {"title": "Interactive Fundamentals Practice", "url": "https://example.com/practice", "icon": "code"}
                ]
            },
            {
                "week": 2,
                "title": "Core AI & Framework Integration",
                "topics": [
                    "Understand RESTful APIs and response parsing",
                    "Deep dive into modern front-end concepts and hooks",
                    "Learn responsive CSS layout patterns"
                ],
                "study_hours": 10,
                "resources": [
                    {"title": "API Integration Video Tutorial", "url": "https://example.com/api-video", "icon": "video"},
                    {"title": "Modern Layout Guide", "url": "https://example.com/layouts", "icon": "link"}
                ]
            },
            {
                "week": 3,
                "title": "Backend Engineering & Security",
                "topics": [
                    "Design relational database schemas and relationships",
                    "Build secure endpoints with authentication (JWT, OAuth)",
                    "Optimize database query performance and indexes"
                ],
                "study_hours": 12,
                "resources": [
                    {"title": "FastAPI & SQLAlchemy Docs", "url": "https://example.com/fastapi-docs", "icon": "book"},
                    {"title": "Backend Security Best Practices", "url": "https://example.com/security", "icon": "code"}
                ]
            },
            {
                "week": 4,
                "title": "Testing, Deployment & Interview Prep",
                "topics": [
                    "Write robust unit and integration tests",
                    "Deploy to staging environments and setup CI/CD",
                    "Practice core behavioral and technical interview questions"
                ],
                "study_hours": 6,
                "resources": [
                    {"title": "Testing Strategies Video Course", "url": "https://example.com/testing-video", "icon": "video"},
                    {"title": "Technical Interview Playbook", "url": "https://example.com/interview-playbook", "icon": "link"}
                ]
            }
        ],
        "recommended_projects": [
            "Build a full-stack SaaS starter with user authentication and database persistence",
            "Develop an automated API integration testing suite with reporting"
        ],
        "interview_questions": [
            "Explain the difference between JWT and Session-based authentication.",
            "How do you profile and optimize slow database queries in an active web app?",
            "Tell me about a time you resolved a major bug under tight deadlines."
        ],
        "certifications": [
            "AWS Certified Developer - Associate",
            "FastAPI Advanced backend certification"
        ],
        "career_advice": [
            "Ensure all projects are showcased in a neat public GitHub repository.",
            "Publish short posts or summaries of your weekly learning on LinkedIn to build authority.",
            "Practice mock coding interviews under timed constraints."
        ]
    }

    roadmap_entry = Roadmap(
        resume_id=resume.id,
        career_level=roadmap_data["career_level"],
        learning_roadmap=roadmap_data["learning_roadmap"],
        recommended_projects=roadmap_data["recommended_projects"],
        interview_questions=roadmap_data["interview_questions"],
        certifications=roadmap_data["certifications"],
        career_advice=roadmap_data["career_advice"],
    )

    db.add(roadmap_entry)
    db.commit()
    db.refresh(roadmap_entry)

    return {
        "resume_id": roadmap_entry.resume_id,
        "career_level": roadmap_entry.career_level,
        "learning_roadmap": roadmap_entry.learning_roadmap,
        "recommended_projects": roadmap_entry.recommended_projects,
        "interview_questions": roadmap_entry.interview_questions,
        "certifications": roadmap_entry.certifications,
        "career_advice": roadmap_entry.career_advice,
    }


@router.post("/generate-by-skills")
def generate_roadmap_by_skills(
    request: SkillRoadmapRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    skills_str = ", ".join(request.missing_skills)

    roadmap_data = {
        "career_level": "Intermediate",
        "learning_roadmap": [
            {
                "week": 1,
                "title": f"Foundations for {request.target_role}",
                "topics": [
                    f"Review core concepts for {request.target_role}",
                    f"Study fundamentals of: {skills_str}",
                    "Set up development environment and tools"
                ],
                "study_hours": 8,
                "resources": [
                    {"title": "Getting Started Guide", "url": "https://example.com/guide", "icon": "book"},
                    {"title": "Interactive Practice", "url": "https://example.com/practice", "icon": "code"}
                ]
            },
            {
                "week": 2,
                "title": f"Deep Dive: {request.missing_skills[0] if request.missing_skills else 'Core Skills'}",
                "topics": [
                    f"Advanced concepts in {request.missing_skills[0] if request.missing_skills else 'core area'}",
                    "Hands-on projects and exercises",
                    "Best practices and design patterns"
                ],
                "study_hours": 10,
                "resources": [
                    {"title": "Advanced Tutorial", "url": "https://example.com/advanced", "icon": "video"},
                    {"title": "Practice Problems", "url": "https://example.com/problems", "icon": "code"}
                ]
            },
            {
                "week": 3,
                "title": f"Integration: {request.missing_skills[1] if len(request.missing_skills) > 1 else 'Architecture'}",
                "topics": [
                    f"Master {request.missing_skills[1] if len(request.missing_skills) > 1 else 'system architecture'}",
                    "Build integration projects",
                    "Performance optimization techniques"
                ],
                "study_hours": 12,
                "resources": [
                    {"title": "Integration Guide", "url": "https://example.com/integration", "icon": "book"},
                    {"title": "Project Walkthrough", "url": "https://example.com/project", "icon": "video"}
                ]
            },
            {
                "week": 4,
                "title": "Interview Prep & Portfolio",
                "topics": [
                    f"Practice {request.target_role} interview questions",
                    "Build portfolio projects showcasing skills",
                    "Mock interview preparation"
                ],
                "study_hours": 8,
                "resources": [
                    {"title": "Interview Playbook", "url": "https://example.com/interview", "icon": "book"},
                    {"title": "Portfolio Guide", "url": "https://example.com/portfolio", "icon": "link"}
                ]
            }
        ],
        "recommended_projects": [
            f"Build a full-stack project demonstrating {skills_str}",
            f"Create a portfolio piece for {request.target_role} role"
        ],
        "interview_questions": [
            f"Explain your experience with {request.missing_skills[0] if request.missing_skills else 'relevant technologies'}.",
            f"How would you approach a complex {request.target_role} challenge?",
            "Tell me about a time you learned a new technology quickly."
        ],
        "certifications": [
            f"{request.target_role} Professional Certification",
            "Cloud Platform Associate Certification"
        ],
        "career_advice": [
            f"Focus on building projects that showcase {skills_str}",
            "Contribute to open source projects in your target domain",
            "Network with professionals in your target role"
        ]
    }

    # Try to find an existing resume to link to
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.id.desc()).first()

    if resume:
        existing = db.query(Roadmap).filter(Roadmap.resume_id == resume.id).first()
        if existing:
            return {
                "resume_id": existing.resume_id,
                "career_level": existing.career_level,
                "learning_roadmap": existing.learning_roadmap,
                "recommended_projects": existing.recommended_projects,
                "interview_questions": existing.interview_questions,
                "certifications": existing.certifications,
                "career_advice": existing.career_advice,
            }

        roadmap_entry = Roadmap(
            resume_id=resume.id,
            career_level=roadmap_data["career_level"],
            learning_roadmap=roadmap_data["learning_roadmap"],
            recommended_projects=roadmap_data["recommended_projects"],
            interview_questions=roadmap_data["interview_questions"],
            certifications=roadmap_data["certifications"],
            career_advice=roadmap_data["career_advice"],
        )
        db.add(roadmap_entry)
        db.commit()
        db.refresh(roadmap_entry)

        return {
            "resume_id": roadmap_entry.resume_id,
            "career_level": roadmap_entry.career_level,
            "learning_roadmap": roadmap_entry.learning_roadmap,
            "recommended_projects": roadmap_entry.recommended_projects,
            "interview_questions": roadmap_entry.interview_questions,
            "certifications": roadmap_entry.certifications,
            "career_advice": roadmap_entry.career_advice,
        }

    # No resume exists - return roadmap data without persisting
    return {
        "resume_id": None,
        "career_level": roadmap_data["career_level"],
        "learning_roadmap": roadmap_data["learning_roadmap"],
        "recommended_projects": roadmap_data["recommended_projects"],
        "interview_questions": roadmap_data["interview_questions"],
        "certifications": roadmap_data["certifications"],
        "career_advice": roadmap_data["career_advice"],
    }


@router.get("/list")
def list_roadmaps(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    roadmaps = db.query(Roadmap).join(Resume).filter(Resume.user_id == current_user.id).order_by(Roadmap.id.desc()).all()
    result = []
    for rm in roadmaps:
        resume = db.query(Resume).filter(Resume.id == rm.resume_id).first()
        result.append({
            "resume_id": rm.resume_id,
            "career_level": rm.career_level,
            "target_role": resume.original_file_name if resume else "Unknown",
            "created_at": None
        })
    return result


@router.get("/{resume_id}")
def get_roadmap(resume_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    roadmap_entry = db.query(Roadmap).join(Resume).filter(Roadmap.resume_id == resume_id, Resume.user_id == current_user.id).first()
    if not roadmap_entry:
        raise HTTPException(404, "Roadmap not found")

    return {
        "resume_id": roadmap_entry.resume_id,
        "career_level": roadmap_entry.career_level,
        "learning_roadmap": roadmap_entry.learning_roadmap,
        "recommended_projects": roadmap_entry.recommended_projects,
        "interview_questions": roadmap_entry.interview_questions,
        "certifications": roadmap_entry.certifications,
        "career_advice": roadmap_entry.career_advice,
    }
