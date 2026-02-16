import React, { useState, useEffect } from 'react';
import LandingPage from './components/Landing/LandingPage';
import MasterForm from './components/Form/MasterForm';
import DiscoveryPage from './components/Discovery/DiscoveryPage';
import AISummaryModal from './components/Modals/AISummaryModal';
import CheckoutPage from './components/Checkout/CheckoutPage';
import StepIndicator from './components/Shared/StepIndicator';

function App() {
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing' | 'form' | 'discovery' | 'checkout'
  const [formData, setFormData] = useState(null);
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  // Map currentPage to step number
  const stepMap = { form: 1, discovery: 2, checkout: 3 };
  const currentStep = stepMap[currentPage] || 0;

  // Handle Form Submission
  const handleFormSubmit = (data) => {
    console.log("Form Data Submitted:", data);
    setFormData(data);
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
          <div className="py-12 px-4">
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
              setCurrentPage('landing');
              setSelectedColleges([]);
              setFormData(null);
              window.scrollTo(0, 0);
            }}
          />
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

export default App;
