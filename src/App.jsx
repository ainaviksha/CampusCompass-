import React, { useState, useEffect } from 'react';
import LandingPage from './components/Landing/LandingPage';
import MasterForm from './components/Form/MasterForm';
import DiscoveryPage from './components/Discovery/DiscoveryPage';
import AISummaryModal from './components/Modals/AISummaryModal';
import CheckoutModal from './components/Modals/CheckoutModal';

function App() {
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing' | 'form' | 'discovery'
  const [formData, setFormData] = useState(null);
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

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

  return (
    <div className="min-h-screen font-sans text-slate-900 bg-slate-50 selection:bg-blue-100 selection:text-blue-900">

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
            onOpenCheckout={() => setIsCheckoutOpen(true)}
          />
        )}
      </div>

      {/* Modals */}
      <AISummaryModal
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        colleges={selectedColleges}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        colleges={selectedColleges}
      />

    </div>
  );
}

export default App;
