# Deployment Guide

## 1. Backend Deployment (Render.com)

**Render** is recommended for free Python/FastAPI hosting.

### Steps:
1.  Push your code to GitHub.
2.  Log in to [Render](https://render.com/).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository.
5.  **Configure Service**:
    *   **Name**: `naviksha-backend`
    *   **Region**: Singapore (or nearest)
    *   **Branch**: `feature/backend-and-admin-panel`
    *   **Root Directory**: `.` (leave empty or `.`)
    *   **Runtime**: **Python 3**
    *   **Build Command**: `pip install -r backend/requirements.txt`
    *   **Start Command**: `uvicorn backend.app.main:app --host 0.0.0.0 --port 10000`
6.  **Environment Variables** (Add these in "Advanced"):
    *   `PYTHON_VERSION`: `3.12.0` (or similar)
    *   `MONGODB_URL`: (Your MongoDB Atlas URL)
    *   `SECRET_KEY`: (Generate a strong random string)
    *   `ACCESS_TOKEN_EXPIRE_MINUTES`: `10080` (7 days)

7.  Click **Create Web Service**.
8.  Once deployed, copy the **Service URL** (e.g., `https://naviksha-backend.onrender.com`).

---

## 2. Frontend Deployment (Vercel)

**Vercel** is ideal for React/Vite apps.

### Steps:
1.  Log in to [Vercel](https://vercel.com/).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Configure Project**:
    *   **Framework Preset**: **Vite**
    *   **Root Directory**: `.`
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
5.  **Environment Variables**:
    *   `VITE_API_URL`: The URL of your **deployed backend** (e.g., `https://naviksha-backend.onrender.com`).
        *   *Note: Ensure NO trailing slash.*

6.  Click **Deploy**.

---

## 3. Post-Deployment Checks

1.  Open the deployed Frontend URL.
2.  Go to `/admin/login` and try to log in.
3.  If you get a CORS error, you might need to update `backend/app/main.py` CORS origins to include your Vercel domain.
    *   Update `allow_origins=["*"]` is safest for starting, but for production, list specific domains.
