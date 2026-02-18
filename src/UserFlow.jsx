import React, { useState } from 'react';
import LandingPage from './components/Landing/LandingPage';
import MasterForm from './components/Form/MasterForm';
import DiscoveryPage from './components/Discovery/DiscoveryPage';
import AISummaryModal from './components/Modals/AISummaryModal';
import CheckoutPage from './components/Checkout/CheckoutPage';
import StepIndicator from './components/Shared/StepIndicator';

function UserFlow() {
    const [currentPage, setCurrentPage] = useState('landing'); // 'landing' | 'form' | 'discovery' | 'checkout' | 'success'
    const [selectedColleges, setSelectedColleges] = useState([]);
    const [isSummaryOpen, setIsSummaryOpen] = useState(false);

    // Map currentPage to step number
    const stepMap = { form: 1, discovery: 2, checkout: 3, success: 4 };
    const currentStep = stepMap[currentPage] || 0;

    // Handle Form Submission
    const handleFormSubmit = (data) => {
        console.log("Form Data Submitted:", data);
        setCurrentPage('discovery');
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
    const handleGoToCheckout = () => {
        setCurrentPage('checkout');
        window.scrollTo(0, 0);
    };

    return (
        <div className="min-h-screen font-sans text-slate-900 bg-slate-50 selection:bg-blue-100 selection:text-blue-900">

            {/* Global Sticky Step Indicator — visible on form, discovery & checkout pages */}
            {currentStep > 0 && <StepIndicator currentStep={currentStep} />}

            {/* Page Content */}
            <div className="animate-in fade-in duration-500">
                {currentPage === 'landing' && (
                    <LandingPage onGetStarted={() => { setCurrentPage('form'); window.scrollTo(0, 0); }} />
                )}

                {currentPage === 'form' && (
                    <div className="py-4 px-4">
                        <MasterForm onSubmit={handleFormSubmit} />
                    </div>
                )}

                {currentPage === 'discovery' && (
                    <DiscoveryPage
                        selectedColleges={selectedColleges}
                        onToggleCollege={toggleCollege}
                        onOpenSummary={() => setIsSummaryOpen(true)}
                        onOpenCheckout={handleGoToCheckout}
                        onBackToForm={() => { setCurrentPage('form'); window.scrollTo(0, 0); }}
                    />
                )}

                {currentPage === 'checkout' && (
                    <CheckoutPage
                        colleges={selectedColleges}
                        onBack={() => { setCurrentPage('discovery'); window.scrollTo(0, 0); }}
                        onPaymentComplete={() => {
                            setCurrentPage('success');
                            window.scrollTo(0, 0);
                        }}
                    />
                )}

                {currentPage === 'success' && (
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
                        </div>
                    </div>
                )}
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
