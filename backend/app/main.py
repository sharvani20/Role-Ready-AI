from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI,APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import Base, engine
from app.routers import auth, users, resumes, roadmap

Base.metadata.create_all(bind=engine)

app = FastAPI(title="RoleReady AI")

@app.get("/")
def read_root():
    return {"message": "RoleReady AI API is running"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(resumes.router)
app.include_router(roadmap.router)