# Technical Design Document (TDD) - Milestone 3

## 1. Architecture Overview
We will integrate external services (OTP Provider, Payment Gateway) into our FastAPI backend. Frontend will handle the interactive flows.

### High-Level Flow (OTP)
1. User enters Phone -> `POST /auth/send-otp` -> Backend calls SMS Provider -> SMS sent.
2. User enters Code -> `POST /auth/verify-otp` -> Backend verifies logic -> Token issued.

### High-Level Flow (Payments)
1. User clicks Pay -> `POST /payments/create-order` -> Backend calls Gateway -> Order ID returned.
2. Frontend opens Gateway Checkout.
3. Payment Success -> Gateway calls Webhook (`POST /payments/webhook`) -> Backend updates DB.

## 2. Database Schema Changes

### Collection: `users`
- `isPhoneVerified`: boolean
- `phone`: string (unique)

### Collection: `transactions` (New)
- `_id`: ObjectId
- `userId`: ObjectId (Ref: users)
- `orderId`: string (Gateway Order ID)
- `paymentId`: string (Gateway Payment ID)
- `amount`: number
- `currency`: string
- `status`: enum ('pending', 'success', 'failed')
- `createdAt`: Date

## 3. API Endpoints
- `POST /auth/send-otp`: { phone: string }
- `POST /auth/verify-otp`: { phone: string, otp: string }
- `POST /payments/create-order`: { amount: number, note: string }
- `POST /payments/verify`: { paymentId: string, orderId: string, signature: string }

## 4. Security Considerations
- OTP Rate Limiting (prevent SMS flooding).
- Webhook Signature Verification (prevent fake payments).
- Never store Card details.
