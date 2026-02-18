# Technical Specification - Milestone 2

## 1. Backend Architecture
The backend is built with **Python 3.12** using the **FastAPI** framework, chosen for its high performance (async support) and automatic OpenAPI documentation.

### 1.1 Tech Stack
- **Framework**: FastAPI
- **Server**: Uvicorn (ASGI)
- **Database Driver**: Motor (AsyncIOMotorClient)
- **Data Validation**: Pydantic v2
- **Authentication**: PyJWT + Passlib (Bcrypt)

### 1.2 Authentication Flow
1. **User Login**: `POST /auth/token` with `username` (email) and `password`.
2. **Verification**: Backend hashes password and compares with DB hash.
3. **Token Issue**: Returns a JWT Access Token (expires in 30 minutes).
4. **Protected Requests**: Client sends `Authorization: Bearer <token>`.
5. **Dependency Injection**: `get_current_user` dependency verifies token and fetches user from DB.

## 2. Database Schema (MongoDB)

### 2.1 Collections
- `users`: Stores admin credentials.
- `colleges`: Stores college data.

### 2.2 Models
**Colleges (`CollegeBase`)**:
- `id` (String, Unique Index): Custom slug (e.g., `iit-bombay`).
- `name` (String)
- `city`, `state` (Strings)
- `coordinates` (Object: `lat`, `lng`)
- `...` (Various optional fields matching the frontend form).

**Users (`UserBase`)**:
- `email` (String, Unique Index)
- `hashed_password` (String)
- `is_active` (Boolean)
- `is_superuser` (Boolean)

## 3. Security Measures
- **Password Hashing**: Bcrypt with salt.
- **Environment Variables**: `SECRET_KEY`, `MONGODB_URL` stored in `.env`.
- **CORS**: Configured to allow requests from the frontend origin.

## 4. Scalability Considerations
- **Async I/O**: Non-blocking database operations for high concurrency.
- **Bulk Operations**: `pandas` used for efficient bulk inserts/updates via CSV.
