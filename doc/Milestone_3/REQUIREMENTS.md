# Milestone 3 Requirements

## Objectives
1.  **Real-time OTP Verification**:
    -   Implement SMS/Email OTP for user registration and login.
    -   Integrate with an OTP provider (e.g., Twilio, MSG91, Firebase Auth).
    -   Ensure secure verification flow (generate, send, verify, expire).

2.  **Payment Gateway Integration**:
    -   Enable online payments for application forms or premium features.
    -   Integrate with a Payment Gateway (e.g., Razorpay, Stripe, PhonePe).
    -   Handle payment lifecycle: Order creation, payment processing, webhooks/verification.

## Technical Scope
-   **Backend**: 
    -   New API endpoints for OTP (`/auth/send-otp`, `/auth/verify-otp`).
    -   New API endpoints for Payments (`/payments/create-order`, `/payments/verify`).
    -   Database schema updates for Transaction logs.
-   **Frontend**:
    -   OTP Input UI with timer and resend functionality.
    -   Payment checkout flow integration.
