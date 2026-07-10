"""
FastAPI login endpoint (mock Azure AD).

POST /auth/login
Request body: { "username": "...", "password": "..." }
Response: { "access_token": "...", "token_type": "bearer", "expires_in": 3600 }
"""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
import jwt
import datetime

router = APIRouter()

# Mock secret - in production use a secure secret store
SECRET_KEY = "CHANGE_ME_TO_SECURE_RANDOM"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_SECONDS = 3600

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int

@router.post("/auth/login", response_model=LoginResponse)
async def login(payload: LoginRequest):
    # Very naive mock validation - replace with real Azure AD call
    if payload.username != "testuser" or payload.password != "testpass":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    expire = datetime.datetime.utcnow() + datetime.timedelta(seconds=ACCESS_TOKEN_EXPIRE_SECONDS)
    to_encode = {
        "sub": payload.username,
        "exp": expire,
        "role": "user",          # mock role
        "department": "general" # mock department
    }
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return LoginResponse(
        access_token=encoded_jwt,
        expires_in=ACCESS_TOKEN_EXPIRE_SECONDS
    )
