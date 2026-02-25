/**
 * StudentDashboard — post-login view for returning students.
 *
 * Shows: profile summary, applications, exam scores, and recommended actions.
 */
import React, { useState, useEffect } from 'react';
import {
    User, Phone, MapPin, GraduationCap, FileText, CreditCard,
    ChevronRight, Sparkles, BookOpen, LogOut, Loader2, AlertCircle,
    CheckCircle2, Clock, ArrowRight, Edit3
} from 'lucide-react';
import studentApi from '../../utils/studentApi';
import { getStudentPhone, clearStudentAuth } from '../../utils/studentAuth';
import EditProfileModal from './EditProfileModal';

const StudentDashboard = ({ onApplyMore, onLogout, applications }) => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const loadStudentProfile = async () => {
        try {
            const res = await studentApi.get('/students/me');
            setStudent(res.data);
        } catch (err) {
            console.error('Refetch failed', err);
        }
    };

    useEffect(() => {
        let ignore = false;

        const fetchData = async () => {
            try {
                const [profileRes] = await Promise.all([
                    studentApi.get('/students/me')
                ]);
                if (!ignore) {
                    setStudent(profileRes.data);
                }
            } catch (err) {
                if (ignore) return;
                console.error('Dashboard fetch error:', err);
                if (err.response?.status === 401) {
                    clearStudentAuth();
                    if (onLogout) onLogout();
                    return;
                }
                setError('Failed to load dashboard. Please try again.');
            } finally {
                if (!ignore) setLoading(false);
            }
        };
        fetchData();

        return () => { ignore = true; };
    }, []); // Run once on mount

    const handleLogout = () => {
        clearStudentAuth();
        if (onLogout) onLogout();
    };

    // Compute stats
    const totalCollegesApplied = applications.reduce(
        (sum, app) => sum + (app.colleges?.length || 0), 0
    );
    const totalSpent = applications
        .filter(a => a.paymentStatus === 'paid')
        .reduce((sum, a) => sum + (a.pricing?.finalAmount || 0), 0);
    const pendingPayments = applications.filter(a => a.paymentStatus === 'pending').length;

    // Get filled exam scores
    const getFilledExams = () => {
        if (!student?.examScores) return [];
        const labels = {
            jeePercentile: 'JEE Main',
            bitsatScore: 'BITSAT',
            comedkRank: 'COMEDK',
            viteeeRank: 'VITEEE',
            kcetRank: 'KCET',
            mhtcetPercentile: 'MHT-CET',
            eapcetRank: 'EAPCET',
            srmjeeRank: 'SRMJEE',
            wbjeeRank: 'WBJEE',
        };
        const units = {
            jeePercentile: 'Percentile',
            bitsatScore: 'Score',
            mhtcetPercentile: 'Percentile',
        };
        return Object.entries(student.examScores)
            .filter(([, val]) => val && String(val).trim() !== '')
            .map(([key, val]) => ({
                label: labels[key] || key,
                value: val,
                unit: units[key] || 'Rank',
            }));
    };

    const statusIcon = {
        submitted: <CheckCircle2 size={14} className="text-green-500" />,
        under_review: <Clock size={14} className="text-amber-500" />,
        processed: <CheckCircle2 size={14} className="text-blue-500" />,
    };

    const statusLabel = {
        submitted: 'Submitted',
        under_review: 'Under Review',
        processed: 'Processed',
    };

    const paymentBadge = {
        paid: 'bg-green-100 text-green-700',
        pending: 'bg-amber-100 text-amber-700',
        failed: 'bg-red-100 text-red-700',
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex items-center gap-2 text-slate-500">
                    <Loader2 size={20} className="animate-spin" />
                    <span className="text-sm font-medium">Loading your dashboard...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <AlertCircle size={32} className="text-red-400 mx-auto mb-3" />
                    <p className="text-sm text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-sm text-blue-600 hover:underline font-medium"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const filledExams = getFilledExams();

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-5 sm:py-6">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Sparkles size={14} className="text-yellow-300" />
                            <span className="text-[10px] sm:text-xs font-semibold text-blue-100">Student Dashboard</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] sm:text-xs font-medium text-white transition-colors"
                            >
                                <Edit3 size={12} />
                                <span className="hidden sm:inline">Edit Profile</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1 text-[10px] sm:text-xs text-blue-200 hover:text-white transition-colors ml-2"
                            >
                                <LogOut size={12} />
                                <span className="hidden sm:inline">Log out</span>
                            </button>
                        </div>
                    </div>

                    <h1 className="text-lg sm:text-xl font-bold">
                        👋 Welcome back, {student?.studentName || 'Student'}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-blue-100">
                        {student?.phone && (
                            <span className="flex items-center gap-1">
                                <Phone size={11} />
                                {student.phone} {student.phoneVerified && <CheckCircle2 size={10} className="text-green-300" />}
                            </span>
                        )}
                        {student?.homeState && (
                            <span className="flex items-center gap-1">
                                <MapPin size={11} />
                                {student.homeState}
                            </span>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-5 space-y-5">
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white rounded-xl p-3.5 border border-slate-100 shadow-sm text-center">
                        <p className="text-2xl font-bold text-slate-900">{totalCollegesApplied}</p>
                        <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">Applied</p>
                    </div>
                    <div className="bg-white rounded-xl p-3.5 border border-slate-100 shadow-sm text-center">
                        <p className="text-2xl font-bold text-amber-600">{pendingPayments}</p>
                        <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">Pending</p>
                    </div>
                    <div className="bg-white rounded-xl p-3.5 border border-slate-100 shadow-sm text-center">
                        <p className="text-2xl font-bold text-emerald-600">₹{totalSpent.toLocaleString()}</p>
                        <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">Spent</p>
                    </div>
                </div>

                {/* My Applications */}
                <section>
                    <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                        <FileText size={14} className="text-blue-600" />
                        My Applications
                    </h2>

                    {applications.length === 0 ? (
                        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 text-center">
                            <GraduationCap size={28} className="text-slate-300 mx-auto mb-2" />
                            <p className="text-sm text-slate-500 mb-3">No applications yet</p>
                            <button
                                onClick={onApplyMore}
                                className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 mx-auto"
                            >
                                Browse Colleges <ArrowRight size={14} />
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {applications.map(app => (
                                <div key={app.orderId} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                                    <div className="px-4 py-3 flex items-center justify-between border-b border-slate-50">
                                        <div>
                                            <span className="text-xs font-bold text-slate-700">
                                                {app.orderId}
                                            </span>
                                            <span className="text-[10px] text-slate-400 ml-2">
                                                {app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                }) : ''}
                                            </span>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${paymentBadge[app.paymentStatus] || 'bg-slate-100 text-slate-600'}`}>
                                            {app.paymentStatus}
                                        </span>
                                    </div>
                                    <div className="divide-y divide-slate-50">
                                        {(app.colleges || []).map((col, idx) => (
                                            <div key={idx} className="px-4 py-2 flex items-center justify-between">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    {statusIcon[col.status] || statusIcon.submitted}
                                                    <span className="text-xs text-slate-700 truncate">{col.name}</span>
                                                </div>
                                                <span className="text-[10px] text-slate-400 flex-shrink-0">
                                                    {statusLabel[col.status] || 'Submitted'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="px-4 py-2 bg-slate-50 flex items-center justify-between">
                                        <span className="text-[10px] text-slate-500">
                                            {app.colleges?.length || 0} college{(app.colleges?.length || 0) !== 1 ? 's' : ''}
                                        </span>
                                        <span className="text-xs font-bold text-slate-700">
                                            ₹{(app.pricing?.finalAmount || 0).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Exam Profile */}
                {filledExams.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                            <BookOpen size={14} className="text-indigo-600" />
                            Your Exam Profile
                        </h2>
                        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {filledExams.map(exam => (
                                    <div key={exam.label} className="flex flex-col">
                                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">{exam.label}</span>
                                        <span className="text-sm font-bold text-slate-800 mt-0.5">
                                            {exam.value} <span className="text-[10px] font-normal text-slate-400">{exam.unit}</span>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Recommended Actions */}
                <section>
                    <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                        <Sparkles size={14} className="text-amber-500" />
                        Recommended Actions
                    </h2>
                    <div className="space-y-2">
                        {filledExams.length < 3 && (
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="w-full text-left bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-3 transition-colors group cursor-pointer"
                            >
                                <BookOpen size={16} className="text-blue-500 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-semibold text-blue-800">Complete your exam profile</p>
                                    <p className="text-[10px] text-blue-600 mt-0.5">Adding more exam scores improves college recommendations</p>
                                </div>
                                <ArrowRight size={14} className="text-blue-400 group-hover:text-blue-600 transition-colors" />
                            </button>
                        )}
                        <button
                            onClick={onApplyMore}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold py-3 rounded-xl shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-2"
                        >
                            <GraduationCap size={16} />
                            Apply to More Colleges
                        </button>
                    </div>
                </section>
            </main>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                student={student}
                onUpdate={loadStudentProfile}
            />
        </div>
    );
};

export default StudentDashboard;
