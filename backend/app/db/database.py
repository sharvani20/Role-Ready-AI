from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DEFAULT_DB_PATH = f"sqlite:///{BASE_DIR}/resume_analyzer.db"

DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_DB_PATH)

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()
