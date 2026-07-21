from fastapi import APIRouter

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/")
def read_users():
    return {"message": "Users router is ready"}
