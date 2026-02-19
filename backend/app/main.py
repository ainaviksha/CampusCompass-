from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.database import connect_to_mongo, close_mongo_connection
from app.api import auth, colleges, otp

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to DB
    await connect_to_mongo()
    yield
    # Shutdown: Disconnect DB
    await close_mongo_connection()

app = FastAPI(
    title="Naviksha Master Engineering API",
    description="Backend for Dynamic College Data & Admin Panel",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
# CORS Configuration
origins = [
    "https://master-application-form.vercel.app",
    "https://applichoice.naviksha.co.in",
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(colleges.router, prefix="/colleges", tags=["colleges"])
app.include_router(otp.router, prefix="/otp", tags=["otp"])

@app.get("/")
async def root():
    return {"message": "Naviksha API is running", "status": "ok"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
