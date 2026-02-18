# Setup Instructions - Milestone 2

Follow these steps to run the application with the new dynamic backend.

## Prerequisites
- Python 3.12+
- Node.js 18+
- MongoDB Atlas Account (or local MongoDB)

## 1. Backend Setup

1. **Navigate to backend**:
   ```bash
   cd backend
   ```
2. **Create Virtual Environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
4. **Configure Environment**:
   Create `.env` in `backend/`:
   ```env
   MONGODB_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   SECRET_KEY=your_secret_key_here
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```
5. **Run Server**:
   ```bash
   uvicorn app.main:app --reload
   ```
   Server will start at `http://localhost:8000`.

## 2. Frontend Setup

1. **Navigate to project root**:
   ```bash
   cd ..
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Run Dev Server**:
   ```bash
   npm run dev
   ```
   App will start at `http://localhost:5173`.

## 3. Initial Data Seeding

To populate the database with initial data:
1. Ensure backend is running.
2. Run the seed script:
   ```bash
   python backend/scripts/seed_colleges.py
   ```
3. Create a superuser for Admin access:
   ```bash
   python backend/scripts/create_superuser.py
   ```
