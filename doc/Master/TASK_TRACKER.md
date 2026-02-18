# Task & Issue Tracker - Dynamic Backend Migration

## Phase 1: Backend Infrastructure (Python + MongoDB)
- [x] **Setup**: Initialize `backend/` directory with `venv` and `requirements.txt`.
- [x] **Database Connection**: Configure `motor` connection to MongoDB Atlas.
- [x] **Models**: Define `College` and `User` Pydantic models.
- [x] **Environment**: Set up `.env` for secrets and DB URI.

## Phase 2: Authentication & Security
- [x] **JWT Utils**: Implement token creation and verification logic.
- [x] **Login Endpoint**: `POST /auth/token` receiving username/password.
- [x] **User Creation**: Script to create initial super-admin user in DB.
- [x] **Middleware**: CORS configuration for frontend origin.

## Phase 3: College Managment API
- [x] **List API**: `GET /colleges` with pagination and sorting.
- [x] **Create API**: `POST /colleges` (Admin only).
- [x] **Update API**: `PUT /colleges/{id}` (Admin only).
- [x] **Delete API**: `DELETE /colleges/{id}` (Admin only).
- [x] **Bulk Import**: `POST /colleges/import` (CSV/Excel upload logic with `pandas`).
- [x] **Bulk Export**: `GET /colleges/export` (Generate CSV).

## Phase 4: Frontend Admin Panel
- [x] **Admin Pages**: Route structure (`/admin/login`, `/admin/dashboard`).
- [x] **Authentication**: Login form and saving JWT to localStorage/cookie.
- [x] **Protected Routes**: Wrapper component to redirect unauthenticated users.
- [x] **College List UI**: Data Grid with Edit/Delete buttons.
- [x] **Import/Export UI**: Drag-and-drop zone and Download button.

## Phase 5: Client-Side Integration
- [x] **API Client**: `axios` or `fetch` wrapper with Auth header injection.
- [x] **React Query**: Replace static JSON data with API hooks (`useColleges`).
- [ ] **Testing**: Verify flow from Admin CSV upload -> Frontend updates.

---

## Issue Tracker

| ID | Issue Description | Status | Priority | Notes |
|---|---|---|---|---|
| | | | | |
