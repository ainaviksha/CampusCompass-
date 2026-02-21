"""
Student model — phone-first student profiles.

Students authenticate via OTP; their phone number is the primary identifier.
Separate from the admin User model (email + password).
"""
from datetime import datetime
from typing import Optional, Dict
from pydantic import BaseModel, Field, field_validator
from app.models.common import PyObjectId
import re

PHONE_REGEX = re.compile(r"^[6-9]\d{9}$")


class ExamScores(BaseModel):
    jeePercentile: Optional[str] = None
    bitsatScore: Optional[str] = None
    comedkRank: Optional[str] = None
    viteeeRank: Optional[str] = None
    kcetRank: Optional[str] = None
    mhtcetPercentile: Optional[str] = None
    eapcetRank: Optional[str] = None
    srmjeeRank: Optional[str] = None
    wbjeeRank: Optional[str] = None


class BoardMarks(BaseModel):
    physics: Optional[str] = None
    chemistry: Optional[str] = None
    math: Optional[str] = None
    computerScience: Optional[str] = None


class OlympiadScores(BaseModel):
    physics: Optional[str] = None
    math: Optional[str] = None
    chemistry: Optional[str] = None


class StudentOnboardRequest(BaseModel):
    """Request body when a student submits the master form after OTP verification."""
    phone: str
    studentName: str
    parentName: Optional[str] = None
    homeState: Optional[str] = None
    board: Optional[str] = None
    marks: Optional[BoardMarks] = None
    examScores: Optional[ExamScores] = None
    olympiad: Optional[OlympiadScores] = None

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        v = v.strip()
        if not PHONE_REGEX.match(v):
            raise ValueError("Must be a valid 10-digit Indian mobile number")
        return v


class StudentUpdateRequest(BaseModel):
    """Partial update — only provided fields are updated."""
    studentName: Optional[str] = None
    parentName: Optional[str] = None
    homeState: Optional[str] = None
    board: Optional[str] = None
    marks: Optional[BoardMarks] = None
    examScores: Optional[ExamScores] = None
    olympiad: Optional[OlympiadScores] = None


class StudentResponse(BaseModel):
    """Public-facing student profile response."""
    id: Optional[str] = Field(None, alias="_id")
    phone: str
    studentName: str
    parentName: Optional[str] = None
    homeState: Optional[str] = None
    board: Optional[str] = None
    marks: Optional[BoardMarks] = None
    examScores: Optional[ExamScores] = None
    olympiad: Optional[OlympiadScores] = None
    phoneVerified: bool = False
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {datetime: lambda v: v.isoformat() if v else None}
