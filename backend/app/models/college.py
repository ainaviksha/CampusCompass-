from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from app.models.common import PyObjectId

class Coordinates(BaseModel):
    lat: float
    lng: float

class CollegeBase(BaseModel):
    id: str = Field(..., description="Unique slug-like ID, e.g. 'iif-bombay'")
    name: str
    category: Optional[str] = None
    collegeType: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    year: Optional[int] = None
    totalSeats: Optional[int] = None
    fees: Optional[str] = None
    avgPackage: Optional[str] = None
    highestPackage: Optional[str] = None
    medianPackage: Optional[str] = None
    placementPercent: Optional[float] = None
    topRecruiters: Optional[List[str]] = []
    nirfRank: Optional[int] = None
    accreditation: Optional[List[str]] = []
    entranceExams: Optional[List[str]] = []
    courses: Optional[List[str]] = []
    roi: Optional[float] = None
    campusArea: Optional[str] = None
    hostelAvailable: Optional[bool] = None
    scholarships: Optional[str] = None
    studentFacultyRatio: Optional[str] = None
    genderRatio: Optional[str] = None
    coordinates: Optional[Coordinates] = None
    cutoff: Optional[str] = None
    rating: Optional[float] = None
    alumniCount: Optional[int] = None
    autonomy: Optional[str] = None
    logo: Optional[str] = None
    logoDarkBg: Optional[bool] = None
    website: Optional[str] = None
    achievements: Optional[str] = None

class CollegeCreate(CollegeBase):
    pass

class CollegeUpdate(CollegeBase):
    # For updates, everything optional is handled by base being mostly optional.
    # But strictly, even 'id' and 'name' could be optional in a PATCH, but we usually keep ID immutable.
    pass

class CollegeInDB(CollegeBase):
    mongo_id: Optional[PyObjectId] = Field(alias="_id", default=None)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
