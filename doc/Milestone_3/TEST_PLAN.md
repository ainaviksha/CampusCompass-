# Test Plan - Milestone 3

## 1. OTP Verification
- [ ] **TC-OTP-01**: User receives SMS within 10 seconds.
- [ ] **TC-OTP-02**: Entering correct OTP verifies user.
- [ ] **TC-OTP-03**: Entering incorrect OTP shows error.
- [ ] **TC-OTP-04**: Entering expired OTP shows error.
- [ ] **TC-OTP-05**: Clicking "Resend" sends a new OTP (after timer).

## 2. Payments
- [ ] **TC-PAY-01**: Create Order returns valid Order ID.
- [ ] **TC-PAY-02**: Payment modal opens with correct amount.
- [ ] **TC-PAY-03**: Successful payment updates transaction status to 'success'.
- [ ] **TC-PAY-04**: Failed payment updates transaction status to 'failed'.
- [ ] **TC-PAY-05**: Webhook correctly processes payment update (simulation).
