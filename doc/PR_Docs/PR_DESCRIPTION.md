# Pull Request: Dynamic Backend & Admin Panel

## Summary
This PR transitions the application from a static frontend to a full-stack Dynamic App with a Python FastAPI backend and MongoDB database. It includes a comprehensive Admin Panel for managing college data.

## Key Changes

### Backend (`/backend`)
*   **Framework**: FastAPI with Uvicorn.
*   **Database**: MongoDB (via Motor async driver).
*   **Authentication**: JWT-based auth (`/auth/token`).
*   **API Endpoints**:
    *   `GET /colleges`: List colleges with pagination.
    *   `POST /colleges/import`: Bulk import from CSV/Excel.
    *   `GET /colleges/export`: Bulk export to CSV.
    *   `POST/PUT/DELETE /colleges`: CRUD operations (Admin only).
*   **Scripts**: `create_superuser.py` and `seed_colleges.py` for initialization.

### Frontend (`/src`)
*   **Admin Panel**:
    *   `src/layouts/AdminLayout.jsx`: Sticky sidebar layout.
    *   `src/pages/admin/Login.jsx`: Admin login page.
    *   `src/pages/admin/Dashboard.jsx`: Stats overview.
    *   `src/pages/admin/Colleges.jsx`: Data grid with Import/Export.
*   **Integration**:
    *   `src/utils/api.js`: Axios instance with Interceptors for Auth.
    *   `src/hooks/useColleges.js`: React Query hooks for fetching dynamic data.

## How to Test

1.  **Backend Setup**:
    ```bash
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    # Ensure .env has MONGODB_URL
    uvicorn app.main:app --reload
    ```

2.  **Frontend Setup**:
    ```bash
    npm install
    npm run dev
    ```

3.  **Verification**:
    *   Go to `/admin/login`.
    *   Login with `admin@naviksha.com` / `adminpassword`.
    *   Upload a CSV of colleges in the "Colleges" tab.
    *   Go to the main "Discovery" page (`/discovery`) and verify the data appears.

## Checklist
- [x] Backend runs without errors.
- [x] MongoDB connection is stable.
- [x] Admin Login works.
- [x] CSV Import/Export works.
- [x] Frontend displays dynamic data.
