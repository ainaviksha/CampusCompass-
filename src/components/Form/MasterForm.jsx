import React, { useState } from 'react';
import { ChevronRight, Check, AlertCircle, Sparkles, Target, BookOpen } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
    const [formData, setFormData] = useState({
        studentName: '',
        parentName: '',
        contact: '',
        jeeNotAppeared: false,
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
        pcm: '',
        olympiad: ''
    });

    const [errors, setErrors] = useState({});
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otpInput, setOtpInput] = useState('');

    const validate = () => {
        const newErrors = {};
        if (!formData.studentName.trim()) newErrors.studentName = "Student Name is required";
        if (!formData.parentName.trim()) newErrors.parentName = "Parent Name is required";
        if (!formData.contact.match(/^\d{10}$/)) newErrors.contact = "Valid 10-digit number required";
        if (!formData.jeePercentile || formData.jeePercentile < 0 || formData.jeePercentile > 100) {
            newErrors.jeePercentile = "Valid JEE Percentile (0-100) required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSendOTP = () => {
        if (!formData.contact.match(/^\d{10}$/)) {
            setErrors(prev => ({ ...prev, contact: "Enter valid number first" }));
            return;
        }
        setOtpSent(true);
        // Mock OTP send
        setTimeout(() => alert(`Mock OTP for ${formData.contact}: 1234`), 1000);
    };

    const handleVerifyOTP = () => {
        if (otpInput === '1234') {
            setOtpVerified(true);
            setErrors(prev => ({ ...prev, otp: null }));
        } else {
            setErrors(prev => ({ ...prev, otp: "Invalid OTP" }));
        }
    };

    const handleSubmit = () => {
        if (validate()) {
            if (!otpVerified) {
                setErrors(prev => ({ ...prev, otp: "Please verify contact number" }));
                return;
            }
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
                                    disabled={otpVerified}
                                />
                                {otpVerified && <Check size={16} className="absolute right-2.5 top-2.5 text-green-500" />}
                            </div>

                            {!otpVerified ? (
                                !otpSent ? (
                                    <button
                                        onClick={handleSendOTP}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
                                    >
                                        Verify OTP
                                    </button>
                                ) : (
                                    <div className="flex gap-2 animate-in slide-in-from-right fade-in duration-300 w-full sm:w-auto">
                                        <input
                                            type="text"
                                            placeholder="OTP"
                                            className="w-20 px-2 py-2 rounded-lg border border-slate-200 outline-none focus:border-blue-500 text-sm text-center tracking-widest"
                                            maxLength={4}
                                            value={otpInput}
                                            onChange={e => setOtpInput(e.target.value)}
                                        />
                                        <button
                                            onClick={handleVerifyOTP}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors"
                                        >
                                            Verify
                                        </button>
                                    </div>
                                )
                            ) : (
                                <div className="px-4 py-2 bg-green-50 text-green-700 text-sm font-semibold rounded-lg border border-green-200 flex items-center gap-1.5">
                                    <Check size={18} /> Verified
                                </div>
                            )}
                        </div>
                        {errors.otp && <p className="text-xs text-red-500 font-medium mt-1">{errors.otp}</p>}
                    </div>
                </section>

                <hr className="border-slate-100" />

                {/* Section 2: Academic Scores */}
                <section>
                    <div className="flex items-center gap-2 mb-3 text-slate-800">
                        <div className="p-1.5 bg-indigo-100 rounded-md text-indigo-600">
                            <BookOpen size={16} />
                        </div>
                        <h3 className="text-sm font-bold">Academic Scores</h3>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                        <InputField
                            label="JEE Mains Percentile"
                            placeholder="e.g. 94.50"
                            type="number"
                            value={formData.jeePercentile}
                            onChange={e => setFormData({ ...formData, jeePercentile: e.target.value })}
                            error={errors.jeePercentile}
                        />

                        <InputField
                            label="BITSAT Score"
                            placeholder="Out of 390"
                            type="number"
                            value={formData.bitsatScore}
                            onChange={e => setFormData({ ...formData, bitsatScore: e.target.value })}
                        />
                        <InputField
                            label="COMEDK Rank"
                            placeholder="All India Rank"
                            type="number"
                            value={formData.comedkRank}
                            onChange={e => setFormData({ ...formData, comedkRank: e.target.value })}
                        />
                        <InputField
                            label="VITEEE Rank"
                            placeholder="Rank"
                            type="number"
                            value={formData.viteeeRank}
                            onChange={e => setFormData({ ...formData, viteeeRank: e.target.value })}
                        />
                        <InputField
                            label="KCET Rank"
                            placeholder="CET Rank"
                            type="number"
                            value={formData.kcetRank}
                            onChange={e => setFormData({ ...formData, kcetRank: e.target.value })}
                        />
                        <InputField
                            label="MHT-CET Percentile"
                            placeholder="e.g. 95.50"
                            type="number"
                            value={formData.mhtcetPercentile}
                            onChange={e => setFormData({ ...formData, mhtcetPercentile: e.target.value })}
                        />
                        <InputField
                            label="EAPCET Rank"
                            placeholder="Rank"
                            type="number"
                            value={formData.eapcetRank}
                            onChange={e => setFormData({ ...formData, eapcetRank: e.target.value })}
                        />
                        <InputField
                            label="SRMJEE Rank"
                            placeholder="Rank"
                            type="number"
                            value={formData.srmjeeRank}
                            onChange={e => setFormData({ ...formData, srmjeeRank: e.target.value })}
                        />
                        <InputField
                            label="WBJEE Rank"
                            placeholder="Rank"
                            type="number"
                            value={formData.wbjeeRank}
                            onChange={e => setFormData({ ...formData, wbjeeRank: e.target.value })}
                        />
                    </div>
                </section>

                {/* Section 3: Optional Details (Accordion) */}
                <details className="group border rounded-lg border-slate-200 overflow-hidden">
                    <summary className="flex items-center justify-between px-3 py-2.5 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors text-sm">
                        <span className="font-semibold text-slate-700">Additional Details (Optional)</span>
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
                            <option value="">Home State</option>
                            <option value="Karnataka">Karnataka</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Tamil Nadu">Tamil Nadu</option>
                            <option value="Other">Other</option>
                        </select>

                        <InputField
                            label="PCM Aggregate %"
                            placeholder="e.g. 88.5"
                            type="number"
                            value={formData.pcm}
                            onChange={e => setFormData({ ...formData, pcm: e.target.value })}
                        />

                        <InputField
                            label="Olympiad Achievements"
                            placeholder="e.g. RMO qualified"
                            value={formData.olympiad}
                            onChange={e => setFormData({ ...formData, olympiad: e.target.value })}
                        />
                    </div>
                </details>

                {/* Submit Action */}
                <div className="pt-3">
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm py-3 rounded-lg shadow-md shadow-blue-200 transition-all active:scale-[0.99] flex items-center justify-center gap-2 group"
                    >
                        <span>Continue to College Selection</span>
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
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
