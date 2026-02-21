/**
 * Student authentication utilities.
 *
 * Manages the student JWT token in localStorage and provides
 * helpers for login state, token storage, and logout.
 */

const STUDENT_TOKEN_KEY = 'naviksha_student_token';
const STUDENT_PHONE_KEY = 'naviksha_student_phone';

/**
 * Store student credentials after successful onboarding.
 */
export function saveStudentAuth(token, phone) {
    localStorage.setItem(STUDENT_TOKEN_KEY, token);
    localStorage.setItem(STUDENT_PHONE_KEY, phone);
}

/**
 * Get the stored student JWT token.
 */
export function getStudentToken() {
    return localStorage.getItem(STUDENT_TOKEN_KEY);
}

/**
 * Get the stored student phone number.
 */
export function getStudentPhone() {
    return localStorage.getItem(STUDENT_PHONE_KEY);
}

/**
 * Check if a student is currently logged in.
 */
export function isStudentLoggedIn() {
    const token = getStudentToken();
    if (!token) return false;

    // Check if token is expired by decoding the payload
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiry = payload.exp * 1000; // Convert to milliseconds
        return Date.now() < expiry;
    } catch {
        return false;
    }
}

/**
 * Clear student credentials (logout).
 */
export function clearStudentAuth() {
    localStorage.removeItem(STUDENT_TOKEN_KEY);
    localStorage.removeItem(STUDENT_PHONE_KEY);
}
