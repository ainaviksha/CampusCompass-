# Product Requirements Document (PRD) - Milestone 3
**Version:** 1.0  
**Status:** Draft  
**Date:** 2026-02-18

## 1. Introduction
This milestone focuses on securing user access via real-time OTP verification and enabling monetization through a payment gateway integration.

## 2. Problem Statement
- Currently, users can sign up with invalid emails/phones, leading to spam.
- There is no mechanism to collect payments for application forms or premium services.

## 3. Goals & Success Metrics
- **Goal:** Verify 100% of new user phone numbers via OTP.
- **Goal:** Enable successful payment processing for test transactions.
- **Metric:** < 5% drop-off rate at OTP screen.
- **Metric:** 99.9% uptime for payment processing.

## 4. User Stories
| ID | Actor | Story | Acceptance Criteria |
|----|-------|-------|---------------------|
| 3.1 | User | As a user, I want to verify my phone number via OTP so that I can secure my account. | User receives SMS, enters code, and gets verified. |
| 3.2 | User | As a user, I want to resend OTP if I didn't receive it. | 'Resend' button becomes active after 30s. |
| 3.3 | User | As a user, I want to pay for an application form using UPI/Card. | Payment modal opens, transaction completes, success message shown. |
| 3.4 | Admin | As an admin, I want to see transaction history. | Table showing Order ID, User, Amount, Status. |

## 5. Scope (In/Out)
**In Scope:**
- SMS OTP (via Provider).
- Payment Integration (Razorpay/Stripe).
- Transaction Logs.

**Out of Scope:**
- Subscription management (recurring payments).
- Biometric authentication.
