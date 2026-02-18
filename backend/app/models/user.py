from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Any
from bson import ObjectId
from pydantic_core import core_schema
from app.models.common import PyObjectId

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(UserBase):
    password: str

class UserInDB(UserBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    hashed_password: str

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
