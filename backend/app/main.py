from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import Base, engine
from app.routers import auth, users, resumes, roadmap
import os

Base.metadata.create_all(bind=engine)

app = FastAPI(title="RoleReady AI")

@app.get("/")
def read_root():
  return {"message": "RoleReady AI API is running"}

### 1. Pull the live frontend URL from environment variables, or default to an empty list

FRONTEND_PROD_URL = os.getenv("FRONTEND_URL")

origins = [
"http://localhost:5173",
"http://localhost:5174",
]

### If you configure FRONTEND_URL on Render later, it gets added here dynamically

if FRONTEND_PROD_URL:
    origins.append(FRONTEND_PROD_URL)

app.add_middleware(
CORSMiddleware,
allow_origins=origins,
allow_credentials=True,
allow_methods=["*"],
allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(resumes.router)
app.include_router(roadmap.router)