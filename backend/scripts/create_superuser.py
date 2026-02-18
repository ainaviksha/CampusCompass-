import asyncio
import sys
import os

# Add backend to python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.core.database import connect_to_mongo, get_database, close_mongo_connection
from app.models.user import UserInDB
from app.core.security import get_password_hash

async def create_superuser():
    await connect_to_mongo()
    db = get_database()
    
    email = "admin@naviksha.com"
    password = "adminpassword"
    
    existing_user = await db.users.find_one({"email": email})
    if existing_user:
        print(f"User {email} already exists.")
    else:
        hashed_password = get_password_hash(password)
        user_in = UserInDB(
            email=email,
            hashed_password=hashed_password
        )
        # Exclude None to avoid _id: None if not set
        await db.users.insert_one(user_in.model_dump(by_alias=True, exclude={"id"}))
        print(f"Superuser {email} created successfully.")
    
    await close_mongo_connection()

if __name__ == "__main__":
    asyncio.run(create_superuser())
