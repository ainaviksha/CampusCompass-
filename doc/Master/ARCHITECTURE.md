# Dynamic Backend & Admin Panel Plan (Python + MongoDB)

## 1. Overview
Transition the "Master Engineering Application" to a robust, production-grade architecture using **Python (FastAPI)** for the backend and **MongoDB** for the database. This system will support real-time data updates via a secure **Admin Panel** with bulk Excel/CSV import/export capabilities.

## 2. Architecture

### Backend: Python (FastAPI)
- **Framework**: FastAPI (High performance, easy to use, auto-docs).
- **Database Driver**: Motor (Async MongoDB driver).
- **Authentication**: JWT (JSON Web Tokens) with OAuth2 Password Flow.
- **Data Processing**: `pandas` for robust Excel/CSV parsing and validation.

### Database: MongoDB
- **Cluster**: MongoDB Atlas (Connected via MCP).
- **Collections**:
    - `colleges`: Stores all college data.
    - `users`: Stores admin credentials.
    - `logs`: Audit logs for admin actions.

### Frontend: React + Vite
- **Admin Routes**: Protected `/admin/*` routes.
- **State Management**: TanStack Query (React Query) for API data caching.
- **UI Components**: Reusing existing UI components for the Admin Dashboard.

## 3. Directory Structure
```
/
├── backend/                # New Python Backend
│   ├── app/
│   │   ├── api/            # Route handlers
│   │   ├── core/           # Config, Security
│   │   ├── models/         # Pydantic models & DB schemas
│   │   ├── services/       # Business logic (CSV processing)
│   │   └── main.py         # Entry point
│   ├── requirements.txt
│   └── .env
├── src/                    # Existing React Frontend
│   ├── components/
│   │   └── Admin/          # New Admin Components
│   └── ...
└── doc/
    └── PLAN_DYNAMIC_BACKEND.md
```

## 4. Database Schema (MongoDB)

### Collection: `colleges`
Flexible schema to accommodate varying college data points.
```json
{
  "_id": "ObjectId",
  "name": "IIT Bombay",
  "location": { "city": "Mumbai", "state": "Maharashtra" },
  "logo_url": "https://...",
  "ranking": { "nirf": 3, "qs": 150 },
  "fees": { "tuition": 200000, "currency": "INR", "unit": "Per Year" },
  "placement": { "average_package": 2100000, "highest_package": 15000000 },
  "exams_accepted": ["JEE Advanced", "JEE Mains"],
  "application_link": "https://...",
  "is_featured": true,
  "updated_at": "ISO Date"
}
```

### Collection: `users`
```json
{
  "_id": "ObjectId",
  "email": "admin@naviksha.com",
  "hashed_password": "script_hash...",
  "role": "admin"
}
```

## 5. Admin Panel Features

### Dashboard (`/admin/dashboard`)
- **Data Grid**: View all colleges with sorting and filtering.
- **Inline Editing**: Quick updates to specific fields.
- **Delete/Hide**: Soft delete or toggle visibility.

### Bulk Import/Export
- **Export**: Button to download `colleges.csv` or `.xlsx` reflecting current DB state.
- **Import**: Drag-and-drop Excel/CSV file.
    - **Validation**: Backend validates schema (e.g., *Check if 'name' exists*, *Check if 'fees' is numeric*).
    - **Preview**: Show diff or errors before committing.
    - **Upsert Logic**: Update existing colleges by Name/ID, insert new ones.

## 6. Implementation Steps

### Phase 1: Backend Setup
1.  Setup `backend/` directory with `venv` and install `fastapi`, `uvicorn`, `motor`, `pandas`, `python-multipart`, `pydantic`.
2.  Configure MongoDB connection using the provided connection string.
3.  Create Pydantic models for `College` and `User`.

### Phase 2: Authentication API
1.  Implement `POST /auth/token` (Login).
2.  Implement `POST /auth/register` (Initial Admin Setup - to be disabled later).
3.  Protect routes with `Depends(get_current_user)`.

### Phase 3: College CRUD API
1.  `GET /colleges`: List with pagination.
2.  `POST /colleges`: Create single.
3.  `PUT /colleges/{id}`: Update.
4.  `DELETE /colleges/{id}`: Delete.

### Phase 4: Bulk Import/Export API
1.  `POST /colleges/import`: Accept file, parse with pandas, validate, bulk write to MongoDB.
2.  `GET /colleges/export`: Generate CSV/Excel from MongoDB data.

### Phase 5: Frontend Admin Panel
1.  Create Admin Login Page.
2.  Create Protected Route wrapper.
3.  Build Dashboard with Data Table.
4.  Implement Import/Export UI.

## 7. Security Best Practices
- **Environment Variables**: Store Mongo URI and Secret Keys in `.env`.
- **CORS**: Allow only frontend origin.
- **Input Validation**: Strict Pydantic models for all incoming data.
- **Password Hashing**: Use `bcrypt` or `argon2`.
