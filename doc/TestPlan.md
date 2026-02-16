# Test Plan & Test Cases — CampusCompass

> **Version**: 1.0  
> **Last Updated**: 2026-02-16  
> **Author**: QA Team  
> **Environment**: Chrome 120+, Safari 17+, Mobile Chrome (Android), Safari (iOS)

---

## 1. Test Strategy

| Area | Approach |
|---|---|
| **Unit** | Component-level rendering and state logic |
| **Integration** | Page navigation, form → discovery data flow |
| **E2E / Manual** | Full user journey: Form → Discovery → Selection → Modal → Checkout |
| **Responsive** | Chrome DevTools: iPhone SE (375px), iPad (768px), Desktop (1440px) |
| **Accessibility** | Keyboard navigation, screen reader compatibility, color contrast |

---

## 2. Test Cases — Page 1: Master Application Form

### 2.1 Personal Details

| TC-ID | Scenario | Input | Expected Result | Pass/Fail |
|---|---|---|---|---|
| TC-001 | Submit with empty Student Name | Leave blank, click Continue | Error: "Student Name is required" displayed. Form does NOT navigate. | |
| TC-002 | Submit with empty Parent Name | Leave blank, click Continue | Error: "Parent Name is required" displayed. | |
| TC-003 | Enter valid Student Name | "Rohan Sharma" | Input accepts text. No error shown. | |
| TC-004 | Enter valid Parent Name | "Suresh Sharma" | Input accepts text. No error shown. | |

### 2.2 Contact Number & OTP

| TC-ID | Scenario | Input | Expected Result | Pass/Fail |
|---|---|---|---|---|
| TC-005 | Enter < 10 digit contact | "98765" → click Verify OTP | Error: "Enter valid number first". OTP not sent. | |
| TC-006 | Enter non-numeric contact | "abcdefghij" | Input may restrict or show error on submit. | |
| TC-007 | Enter valid 10-digit number | "9876543210" → click Verify OTP | OTP input field slides in. Mock alert shows OTP "1234". | |
| TC-008 | Enter wrong OTP | "5678" → click Verify | Error: "Invalid OTP" displayed. | |
| TC-009 | Enter correct OTP | "1234" → click Verify | Green "✓ Verified" badge appears. Contact input disables. | |
| TC-010 | Submit without OTP verification | Fill all fields but skip OTP → click Continue | Error: "Please verify contact number". | |

### 2.3 Academic Scores

| TC-ID | Scenario | Input | Expected Result | Pass/Fail |
|---|---|---|---|---|
| TC-011 | Leave JEE Percentile empty | Leave blank (checkbox unchecked) → Continue | Error: "Valid JEE Percentile (0-100) required" | |
| TC-012 | Enter JEE Percentile > 100 | "105" | Error: "Valid JEE Percentile (0-100) required" | |
| TC-013 | Enter JEE Percentile < 0 | "-5" | Error: "Valid JEE Percentile (0-100) required" | |
| TC-014 | Enter valid JEE Percentile | "94.50" | Input accepts. No error. | |
| TC-015 | Check "Not Appeared" for JEE | Toggle checkbox ON | JEE input disables and greys out. No error on submit. | |
| TC-016 | Enter BITSAT score | "285" | Input accepts number. No validation enforced. | |
| TC-017 | Enter COMEDK rank | "1500" | Input accepts number. No validation enforced. | |
| TC-018 | Enter VITEEE rank | "800" | Input accepts number. No validation enforced. | |

### 2.4 Optional Details (Accordion)

| TC-ID | Scenario | Input | Expected Result | Pass/Fail |
|---|---|---|---|---|
| TC-019 | Toggle accordion open | Click "Additional Details" | Accordion expands with Board, State, PCM, Olympiad fields. Chevron rotates. | |
| TC-020 | Select Board | Choose "CBSE" | Dropdown shows "CBSE" selected. | |
| TC-021 | Select Home State | Choose "Karnataka" | Dropdown shows "Karnataka". | |
| TC-022 | Enter PCM Aggregate | "88.5" | Input accepts number. | |
| TC-023 | Enter Olympiad text | "RMO qualified" | Input accepts text. | |
| TC-024 | Submit with no optional fields | Leave all optional fields empty | Form submits successfully (only required fields validated). | |

### 2.5 Form Submission (Happy Path)

| TC-ID | Scenario | Input | Expected Result | Pass/Fail |
|---|---|---|---|---|
| TC-025 | Complete valid form with OTP | All required fields valid + OTP verified → Continue | Page transitions to Discovery page. Console logs form data. | |
| TC-026 | Form data carries to Discovery | Complete form → check Discovery page | Discovery page renders. No data loss. | |

---

## 3. Test Cases — Page 2: College Discovery

### 3.1 Layout & Rendering

| TC-ID | Scenario | Input | Expected Result | Pass/Fail |
|---|---|---|---|---|
| TC-027 | Page loads correctly | Navigate from Form → Discovery | All 5 category sections render: Recommended, New-Age, Elite, Affordable, Online. | |
| TC-028 | Sticky header visible | Scroll down the page | Header stays pinned to top with blur backdrop. | |
| TC-029 | College cards render | Inspect any category | Cards show: Name, City, Est. Year, Avg Package, Fees. | |

### 3.2 Search

| TC-ID | Scenario | Input | Expected Result | Pass/Fail |
|---|---|---|---|---|
| TC-030 | Search by college name | Type "Scaler" in search | Only "Scaler School of Technology" and related cards appear across categories. | |
| TC-031 | Search by city | Type "Bangalore" | All Bangalore-based colleges appear. | |
| TC-032 | Search with no results | Type "xyz123" | All category sections show empty (no cards). | |
| TC-033 | Clear search | Delete all text from search bar | All colleges reappear in original categories. | |

### 3.3 Selection

| TC-ID | Scenario | Input | Expected Result | Pass/Fail |
|---|---|---|---|---|
| TC-034 | Select a college | Tap on "Scaler" card | Card highlights (blue border, checkmark). FAB appears with "1 Selected". | |
| TC-035 | Deselect a college | Tap on selected "Scaler" card again | Card returns to default. FAB updates count or disappears if 0. | |
| TC-036 | Select multiple colleges | Tap 3 different cards | FAB shows "3 Selected". All 3 cards show checkmarks. | |
| TC-037 | FAB hidden when 0 selected | Deselect all colleges | FAB slides out / disappears. | |

### 3.4 Expand / Collapse

| TC-ID | Scenario | Input | Expected Result | Pass/Fail |
|---|---|---|---|---|
| TC-038 | Click "View All" on New-Age | Click button | Cards switch to flex-wrap grid layout. Button text changes to "Show Less". | |
| TC-039 | Click "Show Less" | Click button after expanding | Cards return to horizontal scroll. Button text changes back to "View All". | |

### 3.5 Horizontal Scrolling

| TC-ID | Scenario | Input | Expected Result | Pass/Fail |
|---|---|---|---|---|
| TC-040 | Horizontal scroll on mobile | Swipe left on a card row | Cards scroll smoothly with snap points. | |
| TC-041 | Horizontal scroll on desktop | Mouse scroll / trackpad | Cards scroll horizontally within the container. | |

---

## 4. Test Cases — AI Summary Modal

| TC-ID | Scenario | Input | Expected Result | Pass/Fail |
|---|---|---|---|---|
| TC-042 | Open modal | Select 2 colleges → click "Learn More" | Modal opens with fade-in + zoom animation. Shows 2 college detail cards. | |
| TC-043 | College details correct | Inspect Scaler card in modal | Shows: Avg ₹21.6 LPA, Highest ₹1.5 Cr, Fees ₹21.5L, ROI 266%. | |
| TC-044 | Stats grid layout (desktop) | View on 1440px width | 4-column grid: Avg, Highest, Fees, Alumni. | |
| TC-045 | Stats grid layout (mobile) | View on 375px width | 2-column grid. | |
| TC-046 | "Visit Website" button | Click button for Scaler | Opens `https://scaler.com/school-of-technology` in new tab. | |
| TC-047 | Close modal via X | Click ✕ button | Modal closes. Discovery page visible again. | |
| TC-048 | Close modal via backdrop | Click dark overlay | Modal closes (if implemented). | |
| TC-049 | Scroll inside modal | Add 5+ colleges → open modal | Inner content scrolls. Page behind does NOT scroll. | |

---

## 5. Test Cases — Checkout Modal

| TC-ID | Scenario | Input | Expected Result | Pass/Fail |
|---|---|---|---|---|
| TC-050 | Open checkout | Select 2 colleges → click "Apply Now" | Modal opens. Lists 2 colleges with ₹500 each. Total: ₹1,000. | |
| TC-051 | Discount logic (≤ 3) | Select 2 colleges | No discount shown. Total = ₹1,000. | |
| TC-052 | Discount logic (> 3) | Select 4 colleges | Discount: -₹200 shown in green. Total = ₹1,800. | |
| TC-053 | Payment button | Click "Pay ₹X Securely" | Spinner appears. After 2s, success alert shows. Modal closes. | |
| TC-054 | College numbering | Select 3 colleges | Listed as ①, ②, ③ in order. | |
| TC-055 | Close checkout | Click ✕ | Modal closes. Selection preserved. | |

---

## 6. Test Cases — Non-Functional Requirements

| TC-ID | Scenario | Criteria | Expected Result | Pass/Fail |
|---|---|---|---|---|
| TC-056 | Page load performance | Lighthouse / DevTools | Form page loads in < 2 seconds on 4G. | |
| TC-057 | Mobile responsiveness (375px) | iPhone SE simulation | All elements fit. No horizontal overflow. Touch targets ≥ 44px. | |
| TC-058 | Tablet responsiveness (768px) | iPad simulation | 2-column form layout. Cards scroll horizontally. | |
| TC-059 | Desktop layout (1440px) | Full browser window | Full layout with all sections visible. No wasted space. | |
| TC-060 | Keyboard navigation | Tab through entire form | All inputs, buttons, accordion, and cards are reachable via Tab key. | |
| TC-061 | SSL trust badge | Inspect checkout modal | "256-bit SSL Encrypted Payment" text and icon visible. | |
| TC-062 | Selection text a11y | Use VoiceOver / NVDA | College names and stats are read aloud by screen reader. | |

---

## 7. Test Execution Summary Template

| Metric | Value |
|---|---|
| Total Test Cases | 62 |
| Passed | — |
| Failed | — |
| Blocked | — |
| Not Tested | — |
| Pass Rate | — |
| Last Execution Date | — |
| Tested By | — |
