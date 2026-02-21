# Naviksha Master Engineering Database Architecture

This document outlines the high-level schema design for the Naviksha Master Engineering application. The backend uses **MongoDB** as its primary NoSQL data store, and data validation/serialization is strictly enforced at the application layer using **Pydantic** models in FastAPI.

---

## 1. Overview of Collections
The system currently manages the following primary collections:
1. `colleges`: Core repository of all engineering institutions, their metadata, fees, and placements.
2. `students`: Phone-verified profiles of applicants, containing their academic scores, board marks, and personal details.
3. `applications`: Records of checkout carts (sets of colleges) that a student has paid to apply to.
4. `otp_sessions`: Ephemeral collection tracking Phone OTP generation, verification status, and rate-limiting.

---

## 2. Collection Schemas

### 2.1 Colleges (`colleges`)
Houses the static and dynamic information regarding the universities shown on the Discovery Page.

| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `_id` | `ObjectId` | Yes | MongoDB primary key. |
| `id` | `String` | Yes | Slug-like unique ID used in URLs and frontend logic (e.g., `"scaler_school_tech"`). |
| `name` | `String` | Yes | Formal display name of the institution. |
| `category` | `String` | No | E.g., IIT, NIT, Private, Deemed. |
| `collegeType` | `String` | No | Private / Public / Government. |
| `city` / `state` | `String` | No | Geographical location data. |
| `year` | `Integer` | No | Foundation year. |
| `totalSeats` | `Integer` | No | Overall capacity for engineering branches. |
| `fees` | `String` | No | Formatted fee structure string. |
| `avgPackage` / `highestPackage` | `String` | No | Formatted placement stats. |
| `placementPercent` | `Float` | No | Placement success rate. |
| `nirfRank` | `Integer` | No | National institutional ranking. |
| `topRecruiters`| `List[String]`| No | Array of major hiring companies. |
| `entranceExams` | `List[String]`| No | Accepted exams (e.g., JEE Main). |
| `courses` | `List[String]`| No | Degrees offered (e.g., B.Tech, BS). |
| `coordinates` | `Object` | No | Contains `lat` (Float) and `lng` (Float). |
| `logo` | `String` | No | URL to the institution's crest/logo. |
| `website` | `String` | No | Primary web domain. |

---

### 2.2 Students (`students`)
Profiles for applicants. Students use **Phone Number** as their primary identity, meaning there is no password relying on OTP for subsequent logins.

| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `_id` | `ObjectId` | Yes | MongoDB primary key. |
| `phone` | `String` | Yes | **Unique**. 10-digit Indian Mobile number. |
| `studentName` | `String` | Yes | Applicant's full name. |
| `parentName` | `String` | No | Parent/Guardian's full name. |
| `homeState` | `String` | No | State of domicile. |
| `board` | `String` | No | Qualifying 12th Board (CBSE, ICSE, etc). |
| `marks` | `Object` | No | Subject-wise board marks. |
| `examScores` | `Object` | No | Competitive exam percentiles/ranks. |
| `olympiad` | `Object` | No | Specialized olympiad scores. |
| `phoneVerified` | `Boolean` | Yes | Defaults `False`. Set to `True` post OTP completion. |
| `createdAt` | `Datetime` | Yes | Profile inception timestamp. |
| `updatedAt` | `Datetime` | Yes | Last modified timestamp. |

**Embedded Objects Detail**:
*   `marks`: `physics` (Str), `chemistry` (Str), `math` (Str), `computerScience` (Str)
*   `examScores`: Tracks ranks/percentiles for examinations like `jeePercentile`, `bitsatScore`, `mhtcetPercentile`, `viteeeRank`, etc.

---

### 2.3 Applications (`applications`)
Generated when a student proceeds to checkout on the Discovery page. It bundles multiple `colleges` into a single transaction / order ID.

| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `_id` | `ObjectId` | Yes | MongoDB primary key. |
| `studentPhone` | `String` | Yes | Foreign Key bridging to `students`. |
| `orderId` | `String` | Yes | Human-readable tracking ID (e.g., `NAV-2026-A1B2C3`). |
| `colleges` | `List[Object]`| Yes | Array of college applications within this order. |
| `pricing` | `Object` | Yes | Invoice math calculations. |
| `paymentStatus` | `String` | Yes | Defaults to `"pending"`. Enum: `[pending, paid, failed]`. |
| `paymentId` | `String` | No | Foreign tracking ID from payment gateway (e.g., Razorpay/Stripe identifier). |
| `createdAt` | `Datetime` | Yes | Timestamp. |

**Embedded Objects Detail**:
*   `colleges[]`: Contains `collegeId` (Str), `name` (Str), `city` (Str), and `status` (Enum: `submitted`, `under_review`, `processed`).
*   `pricing`: Contains `subtotal` (Int), `discountPercent` (Int), `discountAmount` (Int), and `finalAmount` (Int).

---

### 2.4 OTP Sessions (`otp_sessions`)
Handles the lifecycle of an authentication attempt.

| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `_id` | `ObjectId` | Yes | MongoDB primary key. |
| `phone` | `String` | Yes | Phone number the OTP was sent to. |
| `otp_hash` | `String` | Yes | Bcrypt/Argon hashed version of the actual OTP. |
| `verified` | `Boolean` | Yes | Marked `True` once successfully verified. |
| `expires_at` | `Datetime` | Yes | TTL (Time-To-Live) integer/datetime. Default 10 mins. |
| `created_at` | `Datetime` | Yes | Timestamp. |

---

## 3. Relationships & Data Integrity

1.  **No Rigid Foreign Keys**: Because MongoDB is NoSQL, relational foreign keys are not strictly constrained at table boundaries. Instead, we use logical joins.
2.  **Student to Application (1:N)**: An Application maps back to its parent Student by matching `applications.studentPhone` == `students.phone`. 
3.  **Application to Colleges (N:M)**: Applications store an array of generic college representations payload rather than resolving a traditional join table, increasing read performance.
4.  **Schema Enforcement**: Enforcement is done globally using FastAPI parameter dependency injection relying on **Pydantic Validation**. Invalid payload structures throw an HTTP 422 Unprocessable Entity error natively before hitting the database connection wrapper.
