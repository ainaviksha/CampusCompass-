import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { saveStudentAuth } from '../../utils/studentAuth';
import axios from 'axios';

const StudentLogin = () => {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (phone.length !== 10) {
            setError("Please enter a valid 10-digit mobile number.");
            return;
        }

        setError(null);
        setLoading(true);

        try {
            // First check if OTP is globally completely disabled by admins
            const apiRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/settings/otp`);
            const isOtpBypassed = !apiRes.data.is_otp_enabled;

            // If bypassed, use the dev-login endpoint instantly. If not, use standard OTP verify flow (or redirect appropriately).
            // Currently, this handles pure dev-login style. If OTP is enabled, we'd normally trigger an OTP request here.

            if (!isOtpBypassed) {
                // If OTP is strictly enabled, the pure "Login" page needs actual OTP verification
                // As a stop-gap for this specific implementation, we will alert the user if they try to auto-login.
                setError("OTP is strictly enforced. Please login via the main application page.");
                setLoading(false);
                return;
            }

            // Using the dev-login endpoint that bypasses OTP
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/students/dev-login`, {
                phone: phone
            });

            if (res.data && res.data.token) {
                saveStudentAuth(res.data.token, phone);
                navigate('/dashboard');
                window.scrollTo(0, 0);
            } else {
                setError("Login failed. No token received.");
            }
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError("No account found with this number. Please apply first.");
            } else {
                setError("An error occurred during login. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen font-sans text-slate-900 bg-slate-50 flex items-center justify-center p-4 selection:bg-blue-100 selection:text-blue-900">
            <div className="w-full max-w-md">
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <img src="/logo.png" alt="Applichoice" className="w-12 h-12 rounded-xl border border-slate-200 shadow-sm mx-auto mb-4" />
                    <h1 className="text-2xl font-black tracking-tight text-slate-900">Welcome Back</h1>
                    <p className="text-sm text-slate-500 mt-1">Log in to view your applications & dashboard</p>
                </div>

                {/* Login Card */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-6 sm:p-8">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                                Mobile Number
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-medium">+91</span>
                                <input
                                    type="tel"
                                    placeholder="Enter your registered 10-digit number"
                                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm transition-all text-slate-900 font-medium placeholder:font-normal placeholder:text-slate-400"
                                    maxLength={10}
                                    value={phone}
                                    onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs font-medium text-red-600 animate-in fade-in zoom-in-95 duration-200">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || phone.length < 10}
                            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed disabled:shadow-none text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-blue-200/50 hover:shadow-lg hover:shadow-blue-300/50 active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Authenticating...</>
                            ) : (
                                <>Continue to Dashboard <ArrowRight size={16} /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-slate-500">
                            Haven't applied yet?{' '}
                            <button
                                onClick={() => navigate('/apply')}
                                className="text-blue-600 hover:text-blue-700 font-bold hover:underline"
                            >
                                Start Application
                            </button>
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => navigate('/')}
                    className="mt-8 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors mx-auto"
                >
                    <ArrowLeft size={14} /> Back to Home
                </button>
            </div>
        </div>
    );
};

export default StudentLogin;
