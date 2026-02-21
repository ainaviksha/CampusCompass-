# feat: OTP Verification, College Logo Fixes & Recommendation Engine

## Summary

This PR adds phone OTP verification via 2Factor.in, fixes broken college logos across the app and database, resolves several UI/UX issues, and introduces a recommendation engine that personalizes the college discovery page based on student profile data.

---

## Changes

### 🔐 OTP Verification (2Factor.in)

**Files:** `backend/app/api/otp.py`, `backend/app/core/config.py`, `backend/app/main.py`, `src/components/Form/MasterForm.jsx`

- New `/otp/send` and `/otp/verify` API endpoints using 2Factor.in
- Voice OTP delivery (trial account limitation — DLT registration needed for SMS)
- Rate limiting: max 5 OTP requests per phone per 10 minutes
- OTP expiry: 5 minutes, max 3 verification attempts per session
- Dev bypass: OTP `1234` always verifies (skips API call for testing)
- Frontend: 6-digit OTP input, loading spinners, 30s resend cooldown timer, error handling

### 🖼️ College Logo Fixes

**Files:** `src/data/colleges.js`

| College | Issue | Fix |
|---------|-------|-----|
| Scaler (SST) | 500 Server Error | → S3-hosted PNG |
| Newton School | 404 Not Found | → CloudFront PNG |
| Rishihood | Site migrated to Framer | → Framer-hosted PNG |
| Masai School | User-provided URL | → CDN WebP |

All URLs verified with HTTP 200 responses. Updated in both `colleges.js` (frontend) and `naviksha_master_db.colleges` (MongoDB).

### 🌙 White Logo Dark Background Support

**Files:** `src/data/colleges.js`, `src/components/Discovery/CollegeCard.jsx`, `src/components/Modals/AISummaryModal.jsx`, `backend/app/models/college.py`

- Added `logoDarkBg: boolean` field to college data model
- When `true`, logo container renders with a dark slate background instead of white
- Applied to Plaksha University (white logo on transparent background)
- Extensible: just set `logoDarkBg: true` on any future college with a white logo

### 💰 Fees Display Fix

**Files:** `src/components/Discovery/CollegeCard.jsx`, `src/components/Modals/AISummaryModal.jsx`

- **Before:** Showed only `₹21.5` (confusing — no unit)
- **After:** Shows `₹21.5 Lakhs`
- Changed `fees.split(' ')[0]` → `fees.split(' ').slice(0, 2).join(' ')`

### 🔁 Duplicate API Call Fix

**File:** `src/hooks/useColleges.js`

- React 18 `<StrictMode>` causes `useEffect` to run twice in dev mode
- Added `AbortController` + `ignore` flag to cancel the first mount's request on cleanup
- Result: only one `/colleges` API call per page load

### 🎯 College Recommendation Engine

**Files:** `src/utils/recommend.js` *(new)*, `src/components/Discovery/DiscoveryPage.jsx`

Multi-factor scoring algorithm that personalizes the "Recommended For You" row:

| Factor | Max Points | Logic |
|--------|-----------|-------|
| Exam Match | 40 | College accepts exams student has taken |
| Home State | 15 | College is in student's home state |
| Affordability | 10 | Lower fees → higher score |
| Quality | 25 | Placement % + college rating |
| NIRF Rank | 10 | Ranked colleges get bonus points |

- Reads `formData` from `sessionStorage` (set by MasterForm)
- Falls back to rating-based sorting if no student data is available

---

## Testing

- [x] Build passes (`vite build` — no errors)
- [x] OTP send/verify flow works with voice OTP and `1234` bypass
- [x] All logo URLs return HTTP 200
- [x] Fees display correctly with "Lakhs" unit
- [x] Single API call in Network tab (no duplicate)
- [x] Plaksha logo visible on dark background
- [x] Recommendations change based on form data (exam scores, home state)

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TWOFACTOR_API_KEY` | Yes | 2Factor.in API key for OTP |
| `TWOFACTOR_OTP_TEMPLATE` | No | SMS template name (unused with voice OTP) |
