/**
 * Student API client — authenticated requests using the student JWT.
 *
 * Separate from the admin `api.js` to avoid 401 redirects to /admin/login.
 * Uses the student token from localStorage.
 */
import axios from 'axios';
import { getStudentToken, clearStudentAuth } from './studentAuth';

const studentApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach student JWT to every request
studentApi.interceptors.request.use(
    (config) => {
        const token = getStudentToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle 401 — clear student auth (don't redirect to admin login)
studentApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            clearStudentAuth();
        }
        return Promise.reject(error);
    }
);

export default studentApi;
