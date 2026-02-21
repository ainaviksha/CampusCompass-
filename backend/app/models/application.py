"""
Application model — tracks college applications made by students.

Each application represents a checkout event: a set of colleges with pricing
and payment status.
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class AppliedCollege(BaseModel):
    """Individual college within an application."""
    collegeId: str
    name: str
    city: Optional[str] = None
    status: str = "submitted"  # submitted | under_review | processed


class ApplicationPricing(BaseModel):
    subtotal: int
    discountPercent: int = 0
    discountAmount: int = 0
    finalAmount: int


class ApplicationCreateRequest(BaseModel):
    """Request body when creating a new application at checkout."""
    colleges: List[AppliedCollege]
    pricing: ApplicationPricing


class ApplicationResponse(BaseModel):
    """Public-facing application response."""
    id: Optional[str] = Field(None, alias="_id")
    studentPhone: str
    orderId: str
    colleges: List[AppliedCollege]
    pricing: ApplicationPricing
    paymentStatus: str = "pending"  # pending | paid | failed
    paymentId: Optional[str] = None
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {datetime: lambda v: v.isoformat() if v else None}
