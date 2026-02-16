import React, { useState } from 'react';
import { ChevronRight, Check, AlertCircle, Sparkles, Target, BookOpen } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const InputField = ({ label, error, ...props }) => (
    <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">{label}</label>
        <div className="relative">
            <input
                className={twMerge(
                    "w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none",
                    error
                        ? "border-red-300 bg-red-50 focus:border-red-500"
                        : "border-slate-200 bg-white focus:border-blue-500 focus:shadow-md focus:shadow-blue-100"
                )}
                {...props}
            />
            {error && <AlertCircle size={18} className="absolute right-3 top-3.5 text-red-500" />}
        </div>
        {error && <p className="text-xs text-red-500 font-medium ml-1">{error}</p>}
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
        if (!formData.jeeNotAppeared && (!formData.jeePercentile || formData.jeePercentile < 0 || formData.jeePercentile > 100)) {
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
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-3 border border-white/20">
                        <Sparkles size={14} className="text-yellow-300" />
                        <span>Single Application Form</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">CampusCompass</h1>
                    <p className="text-blue-100 max-w-xl">Guiding you to the right campus. Apply to 120+ top engineering colleges with a single form — curated based on your percentiles & achievements.</p>
                </div>
            </div>

            <div className="p-8 space-y-8">
                {/* Section 1: Personal Details */}
                <section>
                    <div className="flex items-center gap-2 mb-4 text-slate-800">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <Target size={20} />
                        </div>
                        <h3 className="text-lg font-bold">Personal & Contact Details</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
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

                    <div className="mt-5">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number</label>
                        <div className="flex gap-3">
                            <div className="flex-1 relative">
                                <input
                                    type="tel"
                                    placeholder="10-digit mobile number"
                                    className={twMerge(
                                        "w-full px-4 py-3 rounded-xl border-2 outline-none transition-all",
                                        errors.contact ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-blue-500"
                                    )}
                                    value={formData.contact}
                                    onChange={e => setFormData({ ...formData, contact: e.target.value })}
                                    disabled={otpVerified}
                                />
                                {otpVerified && <Check size={20} className="absolute right-3 top-3.5 text-green-500" />}
                            </div>

                            {!otpVerified ? (
                                !otpSent ? (
                                    <button
                                        onClick={handleSendOTP}
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors whitespace-nowrap"
                                    >
                                        Verify OTP
                                    </button>
                                ) : (
                                    <div className="flex gap-2 animate-in slide-in-from-right fade-in duration-300">
                                        <input
                                            type="text"
                                            placeholder="OTP"
                                            className="w-24 px-3 py-3 rounded-xl border-2 border-slate-200 outline-none focus:border-blue-500 text-center tracking-widest"
                                            maxLength={4}
                                            value={otpInput}
                                            onChange={e => setOtpInput(e.target.value)}
                                        />
                                        <button
                                            onClick={handleVerifyOTP}
                                            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors"
                                        >
                                            Verify
                                        </button>
                                    </div>
                                )
                            ) : (
                                <div className="px-6 py-3 bg-green-50 text-green-700 font-semibold rounded-xl border border-green-200 flex items-center gap-2">
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
                    <div className="flex items-center gap-2 mb-4 text-slate-800">
                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                            <BookOpen size={20} />
                        </div>
                        <h3 className="text-lg font-bold">Academic Scores</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-slate-700">JEE Mains Percentile</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="jeeNA"
                                        className="w-4 h-4 rounded text-blue-600"
                                        checked={formData.jeeNotAppeared}
                                        onChange={e => setFormData({ ...formData, jeeNotAppeared: e.target.checked })}
                                    />
                                    <label htmlFor="jeeNA" className="text-xs text-slate-500 cursor-pointer">Not Appeared</label>
                                </div>
                            </div>
                            <input
                                type="number"
                                placeholder="e.g. 94.50"
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-blue-500 outline-none disabled:bg-slate-100 disabled:text-slate-400"
                                value={formData.jeePercentile}
                                onChange={e => setFormData({ ...formData, jeePercentile: e.target.value })}
                                disabled={formData.jeeNotAppeared}
                            />
                            {errors.jeePercentile && <p className="text-xs text-red-500 mt-1">{errors.jeePercentile}</p>}
                        </div>

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
                <details className="group border rounded-xl border-slate-200 overflow-hidden">
                    <summary className="flex items-center justify-between p-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                        <span className="font-semibold text-slate-700">Additional Details (Optional)</span>
                        <ChevronRight className="text-slate-400 group-open:rotate-90 transition-transform" />
                    </summary>
                    <div className="p-5 grid md:grid-cols-2 gap-5 border-t border-slate-200 bg-white">
                        <select
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 outline-none focus:border-blue-500 bg-white"
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
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 outline-none focus:border-blue-500 bg-white"
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
                <div className="pt-4">
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.99] flex items-center justify-center gap-2 group"
                    >
                        <span>Continue to College Selection</span>
                        <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
                        <Check size={12} /> Your data is 100% secure and encrypted
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MasterForm;
