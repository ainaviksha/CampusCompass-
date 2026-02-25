"""
OTP verification endpoints using 2Factor.in SMS API.

Flow:
  1. POST /otp/send   → Sends OTP to phone via 2Factor, stores session in DB
  2. POST /otp/verify  → Verifies OTP against 2Factor session
"""
import re
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, field_validator
import httpx

from app.core.config import settings
from app.core.database import get_database

router = APIRouter()

# --- Constants ---
TWOFACTOR_BASE_URL = "https://2factor.in/API/V1"
OTP_EXPIRY_SECONDS = 300  # 5 minutes
MAX_SEND_PER_PHONE = 3     # Max OTPs per phone in rate-limit window
RATE_LIMIT_WINDOW = 900     # 15 minutes in seconds
MAX_VERIFY_ATTEMPTS = 5     # Max wrong OTP attempts per session
PHONE_REGEX = re.compile(r"^[6-9]\d{9}$")  # Valid Indian mobile number
DEV_BYPASS_OTP = "1234"     # Always-accepted test OTP for development


# --- Request/Response Models ---
class OTPSendRequest(BaseModel):
    phone: str

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        v = v.strip()
        if not PHONE_REGEX.match(v):
            raise ValueError("Must be a valid 10-digit Indian mobile number")
        return v


class OTPVerifyRequest(BaseModel):
    phone: str
    otp: str

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        v = v.strip()
        if not PHONE_REGEX.match(v):
            raise ValueError("Must be a valid 10-digit Indian mobile number")
        return v

    @field_validator("otp")
    @classmethod
    def validate_otp(cls, v: str) -> str:
        v = v.strip()
        if not v or len(v) < 4 or len(v) > 6:
            raise ValueError("OTP must be 4-6 digits")
        return v


class OTPResponse(BaseModel):
    success: bool
    message: str


class OTPVerifyResponse(BaseModel):
    success: bool
    verified: bool
    message: str


# --- Endpoints ---
@router.post("/send", response_model=OTPResponse)
async def send_otp(request: OTPSendRequest):
    """Send an OTP to the given phone number via 2Factor.in."""
    db = get_database()
    phone = request.phone

    # Check if OTP is globally completely disabled by admins
    config = await db.system_settings.find_one({"_id": "global_config"})
    is_otp_enabled = config.get("is_otp_enabled", True) if config else True
    if not is_otp_enabled:
        return {"success": True, "message": "OTP is globally disabled. Proceed to next step."}

    # Check API key is configured
    if not settings.TWOFACTOR_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="OTP service is not configured"
        )

    # Rate limiting: count recent OTP sends for this phone
    now = datetime.now(timezone.utc)
    rate_limit_cutoff = datetime.fromtimestamp(
        now.timestamp() - RATE_LIMIT_WINDOW, tz=timezone.utc
    )
    recent_count = await db.otp_sessions.count_documents({
        "phone": phone,
        "created_at": {"$gte": rate_limit_cutoff}
    })
    if recent_count >= MAX_SEND_PER_PHONE:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Too many OTP requests. Please try again after {RATE_LIMIT_WINDOW // 60} minutes."
        )

    # Call 2Factor API to send OTP (voice on trial, SMS with DLT in production)
    url = f"{TWOFACTOR_BASE_URL}/{settings.TWOFACTOR_API_KEY}/SMS/{phone}/AUTOGEN"
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(url)
            data = response.json()
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Failed to reach OTP provider: {str(e)}"
        )

    if data.get("Status") != "Success":
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=data.get("Details", "Failed to send OTP")
        )

    session_id = data["Details"]

    # Store session in DB
    await db.otp_sessions.insert_one({
        "phone": phone,
        "session_id": session_id,
        "created_at": now,
        "verify_attempts": 0,
        "verified": False
    })

    return OTPResponse(success=True, message="OTP sent successfully")


@router.post("/verify", response_model=OTPVerifyResponse)
async def verify_otp(request: OTPVerifyRequest):
    """Verify matching OTP from the database."""
    db = get_database()
    phone = request.phone
    otp = request.otp

    # Check if OTP is globally completely disabled by admins
    config = await db.system_settings.find_one({"_id": "global_config"})
    is_otp_enabled = config.get("is_otp_enabled", True) if config else True
    if not is_otp_enabled:
        return {"success": True, "verified": True, "message": "OTP is globally disabled. Successfully bypassed."}

    if not settings.TWOFACTOR_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="OTP service is not configured"
        )

    # Find the most recent OTP session for this phone
    session = await db.otp_sessions.find_one(
        {"phone": phone, "verified": False},
        sort=[("created_at", -1)]
    )

    if not session:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No OTP was sent to this number. Please request a new OTP."
        )

    # Check expiry
    now = datetime.now(timezone.utc)
    age_seconds = (now - session["created_at"].replace(tzinfo=timezone.utc)).total_seconds()
    if age_seconds > OTP_EXPIRY_SECONDS:
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail="OTP has expired. Please request a new one."
        )

    # Check max attempts
    if session.get("verify_attempts", 0) >= MAX_VERIFY_ATTEMPTS:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many failed attempts. Please request a new OTP."
        )

    # Dev bypass: accept 1234 without calling 2Factor API
    if otp == DEV_BYPASS_OTP:
        await db.otp_sessions.update_one(
            {"_id": session["_id"]},
            {"$set": {"verified": True}}
        )
        return OTPVerifyResponse(success=True, verified=True, message="Phone number verified")

    # Call 2Factor API to verify
    session_id = session["session_id"]
    url = f"{TWOFACTOR_BASE_URL}/{settings.TWOFACTOR_API_KEY}/SMS/VERIFY/{session_id}/{otp}"
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(url)
            data = response.json()
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Failed to reach OTP provider: {str(e)}"
        )

    if data.get("Status") == "Success" and data.get("Details") == "OTP Matched":
        # Mark session as verified
        await db.otp_sessions.update_one(
            {"_id": session["_id"]},
            {"$set": {"verified": True}}
        )
        return OTPVerifyResponse(success=True, verified=True, message="Phone number verified")

    # OTP did not match — increment attempts
    await db.otp_sessions.update_one(
        {"_id": session["_id"]},
        {"$inc": {"verify_attempts": 1}}
    )
    return OTPVerifyResponse(success=False, verified=False, message="Invalid OTP. Please try again.")
