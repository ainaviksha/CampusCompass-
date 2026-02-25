from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from app.core.database import get_database
from app.api.deps import get_current_user
from datetime import datetime

router = APIRouter()


class SettingsUpdate(BaseModel):
    is_otp_enabled: bool


class SettingsResponse(BaseModel):
    is_otp_enabled: bool
    updatedAt: Optional[datetime] = None


@router.get("/otp", response_model=SettingsResponse)
async def get_otp_settings():
    """
    Publicly accessible endpoint (used by React app on boot).
    Tells the client whether it should enforce OTP UI or bypass it.
    """
    db = get_database()
    settings = await db.system_settings.find_one({"_id": "global_config"})

    # Default to True if setting doesn't exist yet
    if not settings:
        return {"is_otp_enabled": True}

    return {
        "is_otp_enabled": settings.get("is_otp_enabled", True),
        "updatedAt": settings.get("updatedAt")
    }


@router.put("/otp")
async def update_otp_settings(request: SettingsUpdate, admin: dict = Depends(get_current_user)):
    """
    Admin-only endpoint to toggle OTP enforcement globally.
    """
    db = get_database()
    result = await db.system_settings.update_one(
        {"_id": "global_config"},
        {
            "$set": {
                "is_otp_enabled": request.is_otp_enabled,
                "updatedAt": datetime.utcnow()
            }
        },
        upsert=True
    )

    return {"success": True, "message": f"OTP Enabled set to {request.is_otp_enabled}"}
