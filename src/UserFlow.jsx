import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import LandingPage from './components/Landing/LandingPage';
import MasterForm from './components/Form/MasterForm';
import DiscoveryPage from './components/Discovery/DiscoveryPage';
import AISummaryModal from './components/Modals/AISummaryModal';
import CheckoutPage from './components/Checkout/CheckoutPage';
import StudentDashboard from './components/Dashboard/StudentDashboard';
import StepIndicator from './components/Shared/StepIndicator';
import StudentLogin from './components/Auth/StudentLogin';
import { isStudentLoggedIn, clearStudentAuth } from './utils/studentAuth';

const STORAGE_KEYS = {
    selectedColleges: 'naviksha_selectedColleges',
};

function UserFlow() {
    const navigate = useNavigate();
    const location = useLocation();

    // Map current path to step number for the StepIndicator
    const getStepFromPath = (path) => {
        if (path === '/apply') return 1;
        if (path === '/discovery') return 2;
        if (path === '/checkout') return 3;
        if (path === '/success') return 4;
        return 0;
    };
    const currentStep = getStepFromPath(location.pathname);

    const [selectedColleges, setSelectedColleges] = useState(() => {
        try {
            const stored = sessionStorage.getItem(STORAGE_KEYS.selectedColleges);
            return stored ? JSON.parse(stored) : [];
        } catch { return []; }
    });
    const [isSummaryOpen, setIsSummaryOpen] = useState(false);
    const [appliedCollegeIds, setAppliedCollegeIds] = useState([]);
    const [applications, setApplications] = useState([]); // Hoisted state

    // Fetch previously applied colleges if logged in
    useEffect(() => {
        let ignore = false;
        const fetchApplications = async () => {
            if (!isStudentLoggedIn()) return;
            try {
                // Have to import studentApi dynamically or at top level. It's safe at top level.
                // We'll add the import at the top of the file in the next step.
                const { default: studentApi } = await import('./utils/studentApi');
                const res = await studentApi.get('/students/applications');
                if (ignore) return;

                const apps = res.data.applications || [];
                const ids = apps.flatMap(app => (app.colleges || []).map(c => c.collegeId));
                const uniqueIds = [...new Set(ids)];
                setAppliedCollegeIds(uniqueIds);

                // Auto-remove any already applied colleges from the current selection cart
                setSelectedColleges(prev => prev.filter(c => !uniqueIds.includes(c.id)));
                setApplications(apps); // Save full applications for dashboard
            } catch (err) {
                console.error("Failed to fetch applications in user flow:", err);
            }
        };
        fetchApplications();
        return () => { ignore = true; };
    }, []); // Run once on app mount to get baseline applied colleges

    // Persist selectedColleges to sessionStorage
    useEffect(() => {
        try { sessionStorage.setItem(STORAGE_KEYS.selectedColleges, JSON.stringify(selectedColleges)); } catch { }
    }, [selectedColleges]);

    // Handle Form Submission
    const handleFormSubmit = (data) => {
        console.log("Form Data Submitted:", data);
        navigate('/discovery');
        window.scrollTo(0, 0);
    };

    // Handle College Selection Toggle
    const toggleCollege = (college) => {
        setSelectedColleges(prev => {
            const isSelected = prev.some(c => c.id === college.id);
            if (isSelected) {
                return prev.filter(c => c.id !== college.id);
            } else {
                return [...prev, college];
            }
        });
    };

    // Navigate to checkout page
    // This function is no longer directly used, its logic is inlined in the DiscoveryPage route
    // const handleGoToCheckout = () => {
    //     navigate('/checkout');
    //     window.scrollTo(0, 0);
    // };

    return (
        <div className="min-h-screen font-sans text-slate-900 bg-slate-50 selection:bg-blue-100 selection:text-blue-900">

            {/* Global Sticky Step Indicator — visible on form, discovery & checkout pages */}
            {currentStep > 0 && <StepIndicator currentStep={currentStep} />}

            {/* Page Content */}
            <div className="animate-in fade-in duration-500">
                <Routes>
                    {/* Landing Page Route */}
                    <Route path="/" element={
                        isStudentLoggedIn() ? (
                            <Navigate to="/dashboard" replace />
                        ) : (
                            <LandingPage onGetStarted={() => { navigate('/apply'); window.scrollTo(0, 0); }} />
                        )
                    } />

                    {/* Login Route */}
                    <Route path="/login" element={
                        isStudentLoggedIn() ? (
                            <Navigate to="/dashboard" replace />
                        ) : (
                            <StudentLogin />
                        )
                    } />

                    {/* Master Form Route */}
                    <Route path="/apply" element={
                        isStudentLoggedIn() ? (
                            <Navigate to="/dashboard" replace />
                        ) : (
                            <div className="py-4 px-4">
                                <MasterForm onSubmit={handleFormSubmit} />
                            </div>
                        )
                    } />

                    {/* Discovery Route */}
                    <Route path="/discovery" element={
                        <DiscoveryPage
                            selectedColleges={selectedColleges}
                            appliedCollegeIds={appliedCollegeIds}
                            onToggleCollege={toggleCollege}
                            onOpenSummary={() => setIsSummaryOpen(true)}
                            onOpenCheckout={() => { navigate('/checkout'); window.scrollTo(0, 0); }}
                            onBackToForm={() => { navigate('/apply'); window.scrollTo(0, 0); }}
                        />
                    } />

                    {/* Checkout Route */}
                    <Route path="/checkout" element={
                        <CheckoutPage
                            colleges={selectedColleges}
                            onBack={() => { navigate('/discovery'); window.scrollTo(0, 0); }}
                            onPaymentComplete={() => {
                                navigate('/success');
                                window.scrollTo(0, 0);
                            }}
                        />
                    } />

                    {/* Success Route */}
                    <Route path="/success" element={
                        <div className="min-h-[80vh] flex items-center justify-center px-4">
                            <div className="max-w-md w-full text-center">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                                    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Payment Successful!</h1>
                                <p className="text-sm sm:text-base text-slate-500 mb-6 leading-relaxed">
                                    Your applications to <span className="font-semibold text-slate-700">{selectedColleges.length} colleges</span> have been submitted successfully. You will receive confirmation details shortly.
                                </p>
                                <div className="p-4 bg-green-50 rounded-xl border border-green-100 mb-6">
                                    <p className="text-xs sm:text-sm text-green-700 font-medium">🎉 All steps completed — your applications are being processed!</p>
                                </div>
                                <button
                                    onClick={() => { navigate('/dashboard'); window.scrollTo(0, 0); }}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                                >
                                    Go to Dashboard →
                                </button>
                            </div>
                        </div>
                    } />

                    {/* Student Dashboard Route */}
                    <Route path="/dashboard" element={
                        !isStudentLoggedIn() ? (
                            <Navigate to="/apply" replace />
                        ) : (
                            <StudentDashboard
                                onApplyMore={() => { navigate('/discovery'); window.scrollTo(0, 0); }}
                                applications={applications} // Passed down
                                onLogout={() => {
                                    clearStudentAuth();
                                    navigate('/');
                                    window.scrollTo(0, 0);
                                }}
                            />
                        )
                    } />
                </Routes>
            </div>

            {/* Modals */}
            <AISummaryModal
                isOpen={isSummaryOpen}
                onClose={() => setIsSummaryOpen(false)}
                colleges={selectedColleges}
            />

        </div>
    );
}

export default UserFlow;
