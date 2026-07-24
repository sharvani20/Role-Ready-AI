from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.dependencies import get_db
from app.models.users import User
from app.utils.auth import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/")
def read_users():
    return {"message": "Users router is ready"}

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email
    }
