"""
Student authentication dependency.

Extracts and validates a student JWT token. The token contains:
  - sub: phone number
  - role: "student"

This is separate from the admin `get_current_user` dependency.
"""
from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt

from app.core.config import settings

# Use HTTPBearer instead of OAuth2PasswordBearer since students
# don't use username/password — they get tokens from /students/onboard.
student_bearer = HTTPBearer(auto_error=False)


async def get_current_student(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(student_bearer)],
) -> str:
    """
    Extract and validate a student JWT. Returns the student's phone number.

    Raises 401 if token is missing, invalid, or not a student token.
    """
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please log in.",
        )

    token = credentials.credentials
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        phone: str = payload.get("sub")
        role: str = payload.get("role")

        if phone is None or role != "student":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid student token",
            )
        return phone

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired. Please verify your phone again.",
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
        )
