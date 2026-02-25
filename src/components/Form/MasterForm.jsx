import React, { useState, useEffect } from 'react';
import { ChevronRight, Check, AlertCircle, Sparkles, Target, BookOpen, X, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { saveStudentAuth } from '../../utils/studentAuth';

const STORAGE_KEYS = {
    formData: 'naviksha_formData',
    notAppeared: 'naviksha_notAppeared',
};

const DEFAULT_FORM_DATA = {
    studentName: '',
    parentName: '',
    contact: '',
    jeePercentile: '',
    bitsatScore: '',
    comedkRank: '',
    kcetRank: '',
    mhtcetPercentile: '',
    viteeeRank: '',
    srmjeeRank: '',
    wbjeeRank: '',
    eapcetRank: '',
    board: '',
    homeState: '',
    marks: {
        physics: '',
        chemistry: '',
        math: '',
        computerScience: ''
    },
    olympiad: {
        physics: '',
        math: '',
        chemistry: ''
    }
};


const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    // Union Territories
    'Andaman & Nicobar Islands', 'Chandigarh', 'Dadra & Nagar Haveli and Daman & Diu',
    'Delhi (NCT)', 'Jammu & Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

const EXAM_FIELDS = [
    { key: 'jeePercentile', label: 'JEE Mains', placeholder: 'e.g. 94.50', unit: 'Percentile' },
    { key: 'bitsatScore', label: 'BITSAT', placeholder: 'Out of 390', unit: 'Score' },
    { key: 'comedkRank', label: 'COMEDK', placeholder: 'All India Rank', unit: 'Rank' },
    { key: 'viteeeRank', label: 'VITEEE', placeholder: 'Rank', unit: 'Rank' },
    { key: 'kcetRank', label: 'KCET', placeholder: 'CET Rank', unit: 'Rank' },
    { key: 'mhtcetPercentile', label: 'MHT-CET', placeholder: 'e.g. 95.50', unit: 'Percentile' },
    { key: 'eapcetRank', label: 'EAPCET', placeholder: 'Rank', unit: 'Rank' },
    { key: 'srmjeeRank', label: 'SRMJEE', placeholder: 'Rank', unit: 'Rank' },
    { key: 'wbjeeRank', label: 'WBJEE', placeholder: 'Rank', unit: 'Rank' },
];

const InputField = ({ label, error, ...props }) => (
    <div className="space-y-0.5">
        <label className="block text-xs font-medium text-slate-600">{label}</label>
        <div className="relative">
            <input
                className={twMerge(
                    "w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 outline-none",
                    error
                        ? "border-red-300 bg-red-50 focus:border-red-500"
                        : "border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                )}
                {...props}
            />
            {error && <AlertCircle size={14} className="absolute right-2.5 top-2.5 text-red-500" />}
        </div>
        {error && <p className="text-[11px] text-red-500 font-medium ml-0.5">{error}</p>}
    </div>
);

const MasterForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState(() => {
        try {
            const stored = sessionStorage.getItem(STORAGE_KEYS.formData);
            return stored ? { ...DEFAULT_FORM_DATA, ...JSON.parse(stored) } : DEFAULT_FORM_DATA;
        } catch { return DEFAULT_FORM_DATA; }
    });

    // Track which exams the user has NOT appeared for
    const [notAppeared, setNotAppeared] = useState(() => {
        try {
            const stored = sessionStorage.getItem(STORAGE_KEYS.notAppeared);
            return stored ? JSON.parse(stored) : {};
        } catch { return {}; }
    });

    // Persist formData to sessionStorage
    useEffect(() => {
        try { sessionStorage.setItem(STORAGE_KEYS.formData, JSON.stringify(formData)); } catch { }
    }, [formData]);

    // Persist notAppeared to sessionStorage
    useEffect(() => {
        try { sessionStorage.setItem(STORAGE_KEYS.notAppeared, JSON.stringify(notAppeared)); } catch { }
    }, [notAppeared]);

    const toggleNotAppeared = (key) => {
        setNotAppeared(prev => {
            const updated = { ...prev, [key]: !prev[key] };
            // Clear the score if marking as not appeared
            if (updated[key]) {
                setFormData(fd => ({ ...fd, [key]: '' }));
                setErrors(errs => ({ ...errs, [key]: null }));
            }
            return updated;
        });
    };

    const [errors, setErrors] = useState({});
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otpInput, setOtpInput] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [isOtpGloballyEnabled, setIsOtpGloballyEnabled] = useState(true);
    const timerRef = React.useRef(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    // Fetch Global OTP Settings on Mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch(`${API_URL}/settings/otp`);
                const data = await res.json();
                setIsOtpGloballyEnabled(data.is_otp_enabled);
                // If disabled, automatically mark OTP as verified to unlock the UI
                if (!data.is_otp_enabled) {
                    setOtpVerified(true);
                }
            } catch (err) {
                console.error("Failed to fetch OTP settings", err);
            }
        };
        fetchSettings();
    }, [API_URL]);

    // Start 30-second resend countdown
    const startResendTimer = () => {
        setResendTimer(30);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setResendTimer(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // Cleanup timer on unmount
    useEffect(() => {
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, []);

    const validate = () => {
        const newErrors = {};
        if (!formData.studentName.trim()) newErrors.studentName = "Student Name is required";
        if (!formData.parentName.trim()) newErrors.parentName = "Parent Name is required";
        if (!formData.contact.match(/^\d{10}$/)) newErrors.contact = "Valid 10-digit number required";

        // Check that user has appeared for at least one exam
        const appearedForAny = EXAM_FIELDS.some(f => !notAppeared[f.key] && formData[f.key]);
        if (!appearedForAny) {
            newErrors._exams = "Please enter at least one exam score";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSendOTP = async () => {
        if (!formData.contact.match(/^\d{10}$/)) {
            setErrors(prev => ({ ...prev, contact: "Enter valid 10-digit number first" }));
            return;
        }
        setOtpLoading(true);
        setErrors(prev => ({ ...prev, otp: null }));
        try {
            const res = await fetch(`${API_URL}/otp/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: formData.contact })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setOtpSent(true);
                startResendTimer();
            } else {
                setErrors(prev => ({ ...prev, otp: data.detail || data.message || "Failed to send OTP" }));
            }
        } catch {
            setErrors(prev => ({ ...prev, otp: "Network error. Please try again." }));
        } finally {
            setOtpLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!otpInput.trim()) {
            setErrors(prev => ({ ...prev, otp: "Please enter the OTP" }));
            return;
        }
        setVerifyLoading(true);
        setErrors(prev => ({ ...prev, otp: null }));
        try {
            const res = await fetch(`${API_URL}/otp/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: formData.contact, otp: otpInput.trim() })
            });
            const data = await res.json();
            if (res.ok && data.verified) {
                setOtpVerified(true);
                if (timerRef.current) clearInterval(timerRef.current);
            } else {
                setErrors(prev => ({ ...prev, otp: data.detail || data.message || "Invalid OTP" }));
            }
        } catch {
            setErrors(prev => ({ ...prev, otp: "Network error. Please try again." }));
        } finally {
            setVerifyLoading(false);
        }
    };

    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!validate()) return;
        if (isOtpGloballyEnabled && !otpVerified) {
            setErrors(prev => ({ ...prev, otp: "Please verify contact number" }));
            return;
        }

        setSubmitting(true);
        try {
            // Transform formData to match backend StudentOnboardRequest schema
            const onboardPayload = {
                phone: formData.contact,
                studentName: formData.studentName,
                parentName: formData.parentName || undefined,
                homeState: formData.homeState || undefined,
                board: formData.board || undefined,
                marks: formData.marks,
                examScores: {
                    jeePercentile: formData.jeePercentile || undefined,
                    bitsatScore: formData.bitsatScore || undefined,
                    comedkRank: formData.comedkRank || undefined,
                    viteeeRank: formData.viteeeRank || undefined,
                    kcetRank: formData.kcetRank || undefined,
                    mhtcetPercentile: formData.mhtcetPercentile || undefined,
                    eapcetRank: formData.eapcetRank || undefined,
                    srmjeeRank: formData.srmjeeRank || undefined,
                    wbjeeRank: formData.wbjeeRank || undefined,
                },
                olympiad: formData.olympiad,
            };

            const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const res = await fetch(`${API_BASE}/students/onboard`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(onboardPayload),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.token) {
                    saveStudentAuth(data.token, formData.contact);
                }
            }
            // Proceed to discovery even if onboard call fails — data is in sessionStorage
        } catch (err) {
            console.warn('Student onboard API call failed:', err.message);
        } finally {
            setSubmitting(false);
            onSubmit(formData);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 sm:px-5 py-3 sm:py-4 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-semibold mb-2 border border-white/20">
                        <Sparkles size={11} className="text-yellow-300" />
                        <span>India's Smartest Application Platform</span>
                    </div>
                    <h1 className="text-lg sm:text-xl font-bold mb-1">Master Engineering Application Form</h1>
                    <p className="text-blue-100 text-[11px] sm:text-xs max-w-xl">Single form to apply to 120+ curated colleges based on your marks & achievements</p>
                </div>
            </div>

            <div className="p-3.5 sm:p-5 space-y-4 sm:space-y-5">
                {/* Section 1: Personal Details */}
                <section>
                    <div className="flex items-center gap-2 mb-3 text-slate-800">
                        <div className="p-1.5 bg-blue-100 rounded-md text-blue-600">
                            <Target size={16} />
                        </div>
                        <h3 className="text-sm font-bold">Personal & Contact Details</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <InputField
                            label="Student Name"
                            placeholder="Enter full name"
                            value={formData.studentName}
                            onChange={e => setFormData({ ...formData, studentName: e.target.value })}
                            error={errors.studentName}
                        />
                        <InputField
                            label="Parent Name"
                            placeholder="Father/Mother's name"
                            value={formData.parentName}
                            onChange={e => setFormData({ ...formData, parentName: e.target.value })}
                            error={errors.parentName}
                        />
                    </div>

                    <div className="mt-3">
                        <label className="block text-xs font-medium text-slate-600 mb-0.5">Contact Number</label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <div className="flex-1 relative">
                                <input
                                    type="tel"
                                    placeholder="10-digit mobile number"
                                    className={twMerge(
                                        "w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all",
                                        errors.contact ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    )}
                                    value={formData.contact}
                                    onChange={e => setFormData({ ...formData, contact: e.target.value })}
                                    disabled={isOtpGloballyEnabled && otpVerified}
                                />
                                {isOtpGloballyEnabled && otpVerified && <Check size={16} className="absolute right-2.5 top-2.5 text-green-500" />}
                            </div>

                            {isOtpGloballyEnabled && (
                                !otpVerified ? (
                                    !otpSent ? (
                                        <button
                                            type="button"
                                            onClick={handleSendOTP}
                                            disabled={otpLoading}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5"
                                        >
                                            {otpLoading ? (
                                                <><span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Sending...</>
                                            ) : (
                                                'Send OTP'
                                            )}
                                        </button>
                                    ) : (
                                        <div className="flex flex-col gap-2 animate-in slide-in-from-right fade-in duration-300 w-full sm:w-auto">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Enter OTP"
                                                    className="w-24 px-2 py-2 rounded-lg border border-slate-200 outline-none focus:border-blue-500 text-sm text-center tracking-widest"
                                                    maxLength={6}
                                                    value={otpInput}
                                                    onChange={e => setOtpInput(e.target.value.replace(/\D/g, ''))}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleVerifyOTP}
                                                    disabled={verifyLoading}
                                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                                                >
                                                    {verifyLoading ? (
                                                        <><span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Verifying</>
                                                    ) : (
                                                        'Verify'
                                                    )}
                                                </button>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleSendOTP}
                                                disabled={resendTimer > 0 || otpLoading}
                                                className="text-[11px] text-blue-600 hover:text-blue-700 disabled:text-slate-400 disabled:cursor-not-allowed font-medium text-left"
                                            >
                                                {otpLoading ? 'Sending...' : resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                                            </button>
                                        </div>
                                    )
                                ) : (
                                    <div className="px-4 py-2 bg-green-50 text-green-700 text-sm font-semibold rounded-lg border border-green-200 flex items-center gap-1.5 whitespace-nowrap">
                                        <Check size={18} /> Verified
                                    </div>
                                )
                            )}
                        </div>
                        {errors.otp && <p className="text-xs text-red-500 font-medium mt-1">{errors.otp}</p>}
                    </div>
                </section>

                <hr className="border-slate-100" />

                {/* Section 2: Exam Scores */}
                <section>
                    <div className="flex items-center gap-2 mb-1 text-slate-800">
                        <div className="p-1.5 bg-indigo-100 rounded-md text-indigo-600">
                            <BookOpen size={16} />
                        </div>
                        <h3 className="text-sm font-bold">Exam Scores</h3>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-3 ml-8">
                        Enter scores for exams you've appeared in. Toggle "Didn't appear" for exams you haven't taken. We use these to match you with eligible colleges.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                        {EXAM_FIELDS.map(exam => (
                            <div
                                key={exam.key}
                                className={twMerge(
                                    "rounded-lg border p-2.5 transition-all duration-200",
                                    notAppeared[exam.key]
                                        ? "border-slate-100 bg-slate-50 opacity-60"
                                        : "border-slate-200 bg-white"
                                )}
                            >
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-xs font-semibold text-slate-700">{exam.label} <span className="text-[10px] font-normal text-slate-400">({exam.unit})</span></span>
                                    <button
                                        type="button"
                                        onClick={() => toggleNotAppeared(exam.key)}
                                        className={twMerge(
                                            "text-[10px] font-medium px-2 py-0.5 rounded-full transition-colors",
                                            notAppeared[exam.key]
                                                ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                                                : "bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200"
                                        )}
                                    >
                                        {notAppeared[exam.key] ? "Update" : "Didn't appear"}
                                    </button>
                                </div>
                                {notAppeared[exam.key] ? (
                                    <div className="text-[11px] text-slate-400 italic py-1.5">Didn't appear</div>
                                ) : (
                                    <input
                                        type="number"
                                        placeholder={exam.placeholder}
                                        className={twMerge(
                                            "w-full px-2.5 py-1.5 rounded-md border text-sm outline-none transition-all",
                                            errors[exam.key]
                                                ? "border-red-300 bg-red-50 focus:border-red-500"
                                                : "border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        )}
                                        value={formData[exam.key]}
                                        onChange={e => setFormData(fd => ({ ...fd, [exam.key]: e.target.value }))}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    {errors._exams && (
                        <p className="text-xs text-red-500 font-medium mt-2 flex items-center gap-1">
                            <AlertCircle size={12} /> {errors._exams}
                        </p>
                    )}
                </section>

                {/* Section 3: Optional Details (Accordion) */}
                <details className="group border rounded-lg border-slate-200 overflow-hidden">
                    <summary className="flex items-center justify-between px-3 py-2.5 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors text-sm">
                        <span className="font-semibold text-slate-700">Optional Details (Boost Recommendations)</span>
                        <ChevronRight size={16} className="text-slate-400 group-open:rotate-90 transition-transform" />
                    </summary>
                    <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-200 bg-white">
                        <select
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-blue-500 bg-white text-sm"
                            value={formData.board}
                            onChange={e => setFormData({ ...formData, board: e.target.value })}
                        >
                            <option value="">Select Board</option>
                            <option value="CBSE">CBSE</option>
                            <option value="ICSE">ICSE</option>
                            <option value="State">State Board</option>
                            <option value="IB">IB</option>
                        </select>

                        <select
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-blue-500 bg-white text-sm"
                            value={formData.homeState}
                            onChange={e => setFormData({ ...formData, homeState: e.target.value })}
                        >
                            <option value="">Home State / UT</option>
                            {INDIAN_STATES.map(state => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>


                        <div className="col-span-1 sm:col-span-2 mt-2">
                            <label className="block text-xs font-medium text-slate-600 mb-2">PCM + CS Marks (%)</label>
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="number"
                                    placeholder="Physics %"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-blue-500 bg-white text-sm"
                                    value={formData.marks.physics}
                                    onChange={e => setFormData({ ...formData, marks: { ...formData.marks, physics: e.target.value } })}
                                />
                                <input
                                    type="number"
                                    placeholder="Chemistry %"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-blue-500 bg-white text-sm"
                                    value={formData.marks.chemistry}
                                    onChange={e => setFormData({ ...formData, marks: { ...formData.marks, chemistry: e.target.value } })}
                                />
                                <input
                                    type="number"
                                    placeholder="Math %"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-blue-500 bg-white text-sm"
                                    value={formData.marks.math}
                                    onChange={e => setFormData({ ...formData, marks: { ...formData.marks, math: e.target.value } })}
                                />
                                <input
                                    type="number"
                                    placeholder="Comp. Sci %"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-blue-500 bg-white text-sm"
                                    value={formData.marks.computerScience}
                                    onChange={e => setFormData({ ...formData, marks: { ...formData.marks, computerScience: e.target.value } })}
                                />
                            </div>
                        </div>

                        <div className="col-span-1 sm:col-span-2 mt-2">
                            <label className="block text-xs font-medium text-slate-600 mb-2">Olympiad Scores</label>
                            <div className="grid grid-cols-3 gap-3">
                                <input
                                    type="text"
                                    placeholder="Physics"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-blue-500 bg-white text-sm"
                                    value={formData.olympiad.physics}
                                    onChange={e => setFormData({ ...formData, olympiad: { ...formData.olympiad, physics: e.target.value } })}
                                />
                                <input
                                    type="text"
                                    placeholder="Math"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-blue-500 bg-white text-sm"
                                    value={formData.olympiad.math}
                                    onChange={e => setFormData({ ...formData, olympiad: { ...formData.olympiad, math: e.target.value } })}
                                />
                                <input
                                    type="text"
                                    placeholder="Chemistry"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-blue-500 bg-white text-sm"
                                    value={formData.olympiad.chemistry}
                                    onChange={e => setFormData({ ...formData, olympiad: { ...formData.olympiad, chemistry: e.target.value } })}
                                />
                            </div>
                        </div>
                    </div>
                </details>

                {/* Submit Action */}
                <div className="pt-3">
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-400 text-white font-semibold text-sm py-3 rounded-lg shadow-md shadow-blue-200 transition-all active:scale-[0.99] flex items-center justify-center gap-2 group"
                    >
                        {submitting ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                <span>Saving your profile...</span>
                            </>
                        ) : (
                            <>
                                <span>Continue to College Selection</span>
                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                    <p className="text-center text-[11px] text-slate-400 mt-3 flex items-center justify-center gap-1">
                        <Check size={10} /> Your data is 100% secure and encrypted
                    </p>
                    <p className="text-center text-[10px] text-slate-300 mt-1 flex items-center justify-center gap-1">
                        <Sparkles size={9} className="text-indigo-400" /> Powered by Naviksha AI
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MasterForm;
