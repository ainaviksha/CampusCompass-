import React, { useState, useEffect } from 'react';
import { X, Check, Loader2, Sparkles, BookOpen, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import studentApi from '../../utils/studentApi';

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

const EditProfileModal = ({ isOpen, onClose, student, onUpdate }) => {
    const [formData, setFormData] = useState({
        studentName: '',
        homeState: '',
        board: '',
        examScores: {}
    });

    const [notAppeared, setNotAppeared] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Initialize form when opened or student changes
    useEffect(() => {
        if (student && isOpen) {
            const initialExamScores = student.examScores || {};
            const initialNotAppeared = {};

            // Reconstruct "notAppeared" based on which exams are empty
            EXAM_FIELDS.forEach(exam => {
                const val = initialExamScores[exam.key];
                if (!val) {
                    initialNotAppeared[exam.key] = true;
                } else {
                    initialNotAppeared[exam.key] = false;
                }
            });

            setFormData({
                studentName: student.studentName || '',
                homeState: student.homeState || '',
                board: student.board || '',
                examScores: initialExamScores
            });
            setNotAppeared(initialNotAppeared);
            setError(null);
        }
    }, [student, isOpen]);

    if (!isOpen) return null;

    const toggleNotAppeared = (key) => {
        setNotAppeared(prev => {
            const updated = { ...prev, [key]: !prev[key] };
            if (updated[key]) {
                // Clear out the score locally on toggle
                setFormData(fd => ({
                    ...fd,
                    examScores: { ...fd.examScores, [key]: '' }
                }));
            }
            return updated;
        });
    };

    const handleExamChange = (key, value) => {
        setFormData(fd => ({
            ...fd,
            examScores: { ...fd.examScores, [key]: value }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Clean examScores (remove empty strings before transmission)
            const cleanExamScores = {};
            EXAM_FIELDS.forEach(exam => {
                if (!notAppeared[exam.key] && formData.examScores[exam.key]) {
                    cleanExamScores[exam.key] = formData.examScores[exam.key];
                }
            });

            const payload = {
                studentName: formData.studentName,
                homeState: formData.homeState,
                board: formData.board,
                examScores: cleanExamScores
            };

            await studentApi.patch('/students/me', payload);

            if (onUpdate) onUpdate(); // Trigger a refetch or state update
            onClose(); // Close modal
        } catch (err) {
            console.error('Failed to update profile:', err);
            setError(err.response?.data?.detail || "An error occurred while saving your profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                            <Sparkles size={18} />
                        </div>
                        <h2 className="text-base sm:text-lg font-bold text-slate-800">Edit Profile & Exams</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Body - Scrollable */}
                <div className="overflow-y-auto flex-1 p-6">
                    {error && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg text-sm font-medium text-red-600 flex items-center gap-2">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-8">
                        {/* Personal Details Section */}
                        <section>
                            <h3 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-2 mb-4">Personal Details</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField
                                    label="Student Name"
                                    type="text"
                                    placeholder="Full Name"
                                    value={formData.studentName}
                                    onChange={e => setFormData({ ...formData, studentName: e.target.value })}
                                />
                                <div className="space-y-0.5">
                                    <label className="block text-xs font-medium text-slate-600">Home State</label>
                                    <select
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                                        value={formData.homeState}
                                        onChange={e => setFormData({ ...formData, homeState: e.target.value })}
                                    >
                                        <option value="">Select State</option>
                                        {INDIAN_STATES.map(state => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-0.5">
                                    <label className="block text-xs font-medium text-slate-600">Class 12th Board</label>
                                    <select
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                                        value={formData.board}
                                        onChange={e => setFormData({ ...formData, board: e.target.value })}
                                    >
                                        <option value="">Select Board</option>
                                        <option value="CBSE">CBSE</option>
                                        <option value="ICSE/ISC">ICSE / ISC</option>
                                        <option value="State Board">State Board</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* Exam Scores Section */}
                        <section>
                            <div className="mb-4 text-slate-800">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <BookOpen size={16} className="text-indigo-600" />
                                    <h3 className="text-sm font-bold border-b border-slate-100 pb-1 flex-1">Exam Scores</h3>
                                </div>
                                <p className="text-[11px] text-slate-500">
                                    Update your scores. Toggle "Didn't appear" if you haven't taken the exam yet.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {EXAM_FIELDS.map(exam => (
                                    <div
                                        key={exam.key}
                                        className={twMerge(
                                            "border rounded-xl p-3 transition-colors",
                                            notAppeared[exam.key] ? "bg-slate-50 border-slate-200" : "bg-white border-blue-100 shadow-sm"
                                        )}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-xs font-bold text-slate-700">{exam.label}</label>
                                            <label className="flex items-center gap-1.5 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    className="w-3.5 h-3.5 rounded border-slate-300 text-slate-500 focus:ring-slate-400 transition-colors"
                                                    checked={notAppeared[exam.key] || false}
                                                    onChange={() => toggleNotAppeared(exam.key)}
                                                />
                                                <span className="text-[10px] sm:text-xs font-medium text-slate-500 group-hover:text-slate-700 transition-colors">
                                                    Didn't appear
                                                </span>
                                            </label>
                                        </div>

                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder={exam.placeholder}
                                                className={twMerge(
                                                    "w-full px-3 py-2 rounded-lg border outline-none text-sm tracking-wide transition-all",
                                                    notAppeared[exam.key]
                                                        ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                                                        : "bg-white border-blue-200 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                )}
                                                value={notAppeared[exam.key] ? '' : (formData.examScores[exam.key] || '')}
                                                onChange={e => {
                                                    // Allow numbers and one decimal dot
                                                    const val = e.target.value.replace(/[^0-9.]/g, '');
                                                    if ((val.match(/\./g) || []).length > 1) return;
                                                    handleExamChange(exam.key, val);
                                                }}
                                                disabled={notAppeared[exam.key]}
                                            />
                                            {!notAppeared[exam.key] && (
                                                <span className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest pointer-events-none">
                                                    {exam.unit}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </form>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 rounded-b-2xl">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        form="edit-profile-form"
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-400 text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                    >
                        {loading ? (
                            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Saving</>
                        ) : (
                            <><Check size={16} /> Save Changes</>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default EditProfileModal;
