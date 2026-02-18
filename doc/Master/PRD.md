# Product Requirements Document (PRD): CampusCompass

## 1. Executive Summary
**CampusCompass** — *Guiding you to the right campus* — is a unified platform allowing engineering aspirants to apply to 120+ curated colleges through a single form. The platform simplifies the application process ("Netflix-style" discovery) and provides AI-driven insights to help students make informed decisions.

## 2. Product Goals
*   **Simplify Application**: Reduce the repetitive data entry for students applying to multiple engineering colleges.
*   **Enhance Discovery**: Provide a user-friendly, visual interface for exploring colleges based on varying criteria (Rank, City, Exam, ROI).
*   **Data-Driven Decisions**: Offer AI-generated summaries and metrics (ROI, Placements) to aid decision-making.
*   **Increase Conversion**: Streamline the checkout process for multiple applications.

## 3. User Personas
*   **Rohan (Aspirant)**: 17-18 years old, preparing for JEE. Overwhelmed by multiple forms. Wants a quick, reliable way to apply to backup options.
*   **Suresh (Parent)**: Concerned about ROI, fees, and safety. Wants transparent data on placements and campus life.

## 4. Functional Requirements

### 4.1 Page 1: Master Application Form
**Goal**: Collect all necessary data for eligibility and application submission.
*   **Personal Details**:
    *   Student Name (Text)
    *   Parent Name (Text)
    *   Contact Number (10-digit, numeric) + **OTP Verification Module**
*   **Academic Scores**:
    *   **JEE Mains Percentile** (Numeric, up to 2 decimal places) - *Primary sorting metric*
    *   *Other Exams (Grid/List)*: BITSAT, COMEDK, KCET, MHTCET, EAPCET, VITEEE, SRMJEE, WBJEE (Input: Percentile or Rank where applicable).
    *   Board (Dropdown: CBSE, ICSE, State, etc.)
    *   *Optional*: Home State (Dropdown)
    *   *Optional*: PCM+CS Marks (Numeric breakdown)
    *   *Optional*: Olympiad Scores (Physics, Math, Other)
*   **Validation**: Real-time validation for phone numbers and logical score ranges.

### 4.2 Page 2: College Discovery & Selection
**Goal**: Allow users to browse, select, and finalize colleges.
*   **Layout**: "Netflix-style" horizontal scrolling rails.
*   **Segments**:
    1.  Recommended for You (AI Logic based on scores)
    2.  New-Age Skill-First Institutes
    3.  Affordable Universities
    4.  Elite Universities
    5.  Online Bachelor's
*   **College Card**:
    *   Top: College Name
    *   Center: Logo/Icon
    *   Interaction: Tap to Select (Visual cue: Blue border/Checkmark).
    *   *Feature*: "Expand" button at the bottom of rows to view grid style.
*   **Floating Action Bar (FAB)**:
    *   Appears when >0 colleges selected.
    *   **Button 1: Apply Now** -> Triggers Checkout.
    *   **Button 2: Learn More** -> Triggers AI Summary Modal.

### 4.3 AI Summary Modal
**Goal**: Provide deep insights into selected colleges.
*   **Format**: Scrollable modal or side-sheet.
*   **Content per College**:
    *   Header: Logo, Name, Location.
    *   Stats: Year Est., Campus Size (Photos), Batch Size.
    *   Performance: Alumni Strength (Noteworthy names), Placement (Avg/Highest), ROI calculation.
    *   Financials: Fees structure.
    *   Call to Action: "Visit Website" button.

### 4.4 Checkout & Payment
**Goal**: Finalize applications.
*   **Summary**: List of selected colleges with individual fee.
*   **Total**: Combined calculation.
*   **Payment**: Integration with payment gateway (Razorpay/Stripe).

## 5. Non-Functional Requirements
*   **Performance**: Page load < 2s. Smooth scrolling on mobile.
*   **Responsiveness**: Mobile-first design, fully responsive on desktop/tablet.
*   **Security**: Data encryption (HTTPS), reduced PII exposure.

## 6. Metrics for Success
*   **Conversion Rate**: % of users moving from Form -> Selection -> Payment.
*   **Average Basket Size**: Number of colleges selected per user.
*   **Time on Site**: Engagement with "Learn More" content.
