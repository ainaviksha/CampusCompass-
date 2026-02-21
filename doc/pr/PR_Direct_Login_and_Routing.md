# Pull Request: Direct Login, React Router Refactor, & Architecture Docs

## Description
This Pull Request encapsulates several iterative enhancements aimed at improving the Naviksha Master Engineering platform's navigation, authentication testing capabilities, and developer documentation. 

The most prominent feature is the introduction of a complete `react-router-dom` implementation to replace the previous fragile state-based rendering. Alongside this, a direct "returning student" login flow (currently functioning as a development bypass) has been added to streamline testing without relying on live OTP SMS gateways.

## Key Features & Changes

### 1. React Router Refactoring (Navigation)
- Completely replaced state-driven component mounting (`currentPage`) with URL-based routing in `UserFlow.jsx` and `App.jsx`.
- Established discrete routes for `/` (Landing), `/login`, `/apply` (Master Form), `/discovery`, `/checkout`, `/success`, and `/dashboard`.
- Improved back-navigation and direct URL deep-linking logic.

### 2. Direct Login Flow (Returning Students)
- **Frontend**: Created a dedicated `/login` route featuring the new `StudentLogin.jsx` component. Links to this route were strategically placed on the `LandingPage.jsx` CTAs.
- **Backend API**: Engineered a zero-friction development endpoint `POST /students/dev-login` to authenticate returning users strictly by phone number (temporarily bypassing OTP).
- **Session Management**: JWT saving mechanism implemented through `/login` correctly resolves into the protected `/dashboard` view.

### 3. Dashboard API Optimization
- Resolved an aggressive React fetching loop where `/students/applications` was being executed up to 5 times concurrently upon navigating to `/dashboard`.
- Hoisted the `applications` network array state to the parent `UserFlow.jsx`, passing it directly into `StudentDashboard.jsx` as a prop.
- Temporarily suspended React `<StrictMode>` in `main.jsx` to suppress the duplicate `useEffect` invocations inherent to the Vite dev environment.

### 4. Developer Tools & Documentation
- **Database Architecture**: Drafted a professional MongoDB schema layout representing collections (`students`, `colleges`, `applications`, `otp_sessions`) in `doc/Master/Database_Schema.md`.
- **Postman API Suite**: Constructed a complete JSON Postman Collection mapping out all Auth, Public, Admin, and Student application API nodes in `doc/Master/Master_APIs.postman_collection.json`.

## Technical Testing & Verifications
- Tested the Vite React build module successfully.
- Verified MongoDB inserts and Pydantic validation via the newly built Postman endpoints.
- Reconciled Uvicorn/FastAPI port bindings explicitly.

## Future Recommendations
- Re-instate physical OTP checking into the exact same UI in `StudentLogin.jsx` prior to moving this to a production cluster.
- Re-enable React `<StrictMode>` for edge case memory tracking as the dashboard component structure begins to scale.
