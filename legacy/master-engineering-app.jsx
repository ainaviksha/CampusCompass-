import React, { useState } from 'react';
import { Check, X, ChevronRight, Building2, MapPin, Users, TrendingUp, DollarSign, Award, ExternalLink, ShoppingCart, Sparkles, Phone, Mail, Calendar, GraduationCap, BookOpen, Target } from 'lucide-react';

// College Data Structure
const COLLEGE_DATA = {
  'new-age': [
    { id: 'scaler', name: 'Scaler School of Technology', city: 'Bangalore', year: 2019, batch: 300, avgPackage: '12 LPA', highestPackage: '45 LPA', fees: '4.5 Lakh', roi: 266, alumni: 1200 },
    { id: 'newton', name: 'Newton School of Technology', city: 'Bangalore', year: 2021, batch: 250, avgPackage: '10 LPA', highestPackage: '40 LPA', fees: '3.8 Lakh', roi: 263, alumni: 800 },
    { id: 'masters-union', name: "Master's Union", city: 'Gurgaon', year: 2019, batch: 200, avgPackage: '15 LPA', highestPackage: '50 LPA', fees: '6 Lakh', roi: 250, alumni: 600 },
    { id: 'polaris', name: 'Polaris School of Technology', city: 'Chennai', year: 2022, batch: 180, avgPackage: '9 LPA', highestPackage: '35 LPA', fees: '3.5 Lakh', roi: 257, alumni: 400 },
    { id: 'nxtwave', name: 'NxtWave Institute', city: 'Hyderabad', year: 2020, batch: 400, avgPackage: '8 LPA', highestPackage: '30 LPA', fees: '3 Lakh', roi: 266, alumni: 1500 },
    { id: 'masai', name: 'Masai School', city: 'Bangalore', year: 2019, batch: 500, avgPackage: '7.5 LPA', highestPackage: '28 LPA', fees: '2.5 Lakh', roi: 300, alumni: 2000 },
    { id: 'upgrad', name: 'Upgrad School of Technology', city: 'Mumbai', year: 2021, batch: 350, avgPackage: '11 LPA', highestPackage: '42 LPA', fees: '4 Lakh', roi: 275, alumni: 900 },
    { id: 'pw', name: 'PW Institute of Innovation', city: 'Noida', year: 2022, batch: 600, avgPackage: '8.5 LPA', highestPackage: '32 LPA', fees: '3.2 Lakh', roi: 265, alumni: 1200 },
  ],
  'affordable': [
    { id: 'rv', name: 'RV University', city: 'Bangalore', year: 2020, batch: 800, avgPackage: '9 LPA', highestPackage: '38 LPA', fees: '4.2 Lakh', roi: 214, alumni: 2400 },
    { id: 'upes', name: 'UPES Dehradun', city: 'Dehradun', year: 2003, batch: 2500, avgPackage: '7.5 LPA', highestPackage: '35 LPA', fees: '3.8 Lakh', roi: 197, alumni: 40000 },
    { id: 'lpu', name: 'Lovely Professional University', city: 'Jalandhar', year: 2005, batch: 5000, avgPackage: '6.5 LPA', highestPackage: '42 LPA', fees: '3.2 Lakh', roi: 203, alumni: 80000 },
    { id: 'bennett', name: 'Bennett University', city: 'Greater Noida', year: 2016, batch: 1200, avgPackage: '8 LPA', highestPackage: '40 LPA', fees: '4 Lakh', roi: 200, alumni: 4800 },
    { id: 'amity', name: 'Amity University', city: 'Noida', year: 2005, batch: 3000, avgPackage: '6.8 LPA', highestPackage: '32 LPA', fees: '3.5 Lakh', roi: 194, alumni: 100000 },
    { id: 'nmims', name: 'NMIMS University', city: 'Mumbai', year: 1981, batch: 1500, avgPackage: '9.5 LPA', highestPackage: '45 LPA', fees: '4.5 Lakh', roi: 211, alumni: 60000 },
    { id: 'shiv-nadar', name: 'Shiv Nadar University', city: 'Greater Noida', year: 2011, batch: 600, avgPackage: '10 LPA', highestPackage: '48 LPA', fees: '5 Lakh', roi: 200, alumni: 5000 },
    { id: 'mahindra', name: 'Mahindra University', city: 'Hyderabad', year: 2020, batch: 400, avgPackage: '8.5 LPA', highestPackage: '36 LPA', fees: '4.2 Lakh', roi: 202, alumni: 1200 },
    { id: 'adani', name: 'Adani University', city: 'Ahmedabad', year: 2016, batch: 500, avgPackage: '8 LPA', highestPackage: '35 LPA', fees: '3.8 Lakh', roi: 210, alumni: 2500 },
    { id: 'bml', name: 'BML Munjal University', city: 'Gurgaon', year: 2014, batch: 450, avgPackage: '8.2 LPA', highestPackage: '38 LPA', fees: '4.5 Lakh', roi: 182, alumni: 3600 },
    { id: 'jindal', name: 'OP Jindal University', city: 'Raigarh', year: 2020, batch: 350, avgPackage: '7.8 LPA', highestPackage: '34 LPA', fees: '3.5 Lakh', roi: 222, alumni: 1400 },
    { id: 'amrita', name: 'Amrita Vishwa Vidyapeetham', city: 'Coimbatore', year: 2003, batch: 3000, avgPackage: '7.2 LPA', highestPackage: '40 LPA', fees: '3.2 Lakh', roi: 225, alumni: 50000 },
  ],
  'elite': [
    { id: 'ashoka', name: 'Ashoka University', city: 'Sonipat', year: 2014, batch: 400, avgPackage: '12 LPA', highestPackage: '52 LPA', fees: '6.5 Lakh', roi: 184, alumni: 3200 },
    { id: 'krea', name: 'Krea University', city: 'Chittoor', year: 2018, batch: 300, avgPackage: '11 LPA', highestPackage: '48 LPA', fees: '6 Lakh', roi: 183, alumni: 1200 },
    { id: 'flame', name: 'Flame University', city: 'Pune', year: 2015, batch: 350, avgPackage: '10 LPA', highestPackage: '45 LPA', fees: '5.5 Lakh', roi: 181, alumni: 2100 },
    { id: 'plaksha', name: 'Plaksha University', city: 'Mohali', year: 2021, batch: 200, avgPackage: '14 LPA', highestPackage: '55 LPA', fees: '7 Lakh', roi: 200, alumni: 600 },
    { id: 'mitwpu', name: 'MIT World Peace University', city: 'Pune', year: 2017, batch: 800, avgPackage: '9.5 LPA', highestPackage: '42 LPA', fees: '5 Lakh', roi: 190, alumni: 4800 },
  ],
  'online': [
    { id: 'iitm', name: 'IIT Madras (Online)', city: 'Chennai', year: 2019, batch: 2000, avgPackage: '8 LPA', highestPackage: '35 LPA', fees: '2 Lakh', roi: 400, alumni: 8000 },
    { id: 'iitj', name: 'IIT Jodhpur (Online)', city: 'Jodhpur', year: 2021, batch: 500, avgPackage: '7.5 LPA', highestPackage: '32 LPA', fees: '2.2 Lakh', roi: 340, alumni: 1500 },
    { id: 'iitp', name: 'IIT Patna (Online)', city: 'Patna', year: 2022, batch: 400, avgPackage: '7.8 LPA', highestPackage: '33 LPA', fees: '2.1 Lakh', roi: 371, alumni: 800 },
    { id: 'bits', name: 'BITS Pilani (Online)', city: 'Pilani', year: 2020, batch: 1000, avgPackage: '8.5 LPA', highestPackage: '38 LPA', fees: '2.5 Lakh', roi: 340, alumni: 4000 },
  ],
};

const MasterEngineeringApp = () => {
  const [currentPage, setCurrentPage] = useState('form');
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    contact: '',
    jeeMains: '',
    bitsat: '',
    comedk: '',
    kcet: '',
    mhtcet: '',
    eapcet: '',
    viteee: '',
    srmjee: '',
    wbjee: '',
    board: '',
    homeState: '',
    physics: '',
    chemistry: '',
    math: '',
    cs: '',
    olympiadPhysics: '',
    olympiadMath: '',
    olympiadOther: '',
  });
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});

  // Eligibility Engine
  const calculateEligibility = () => {
    const jee = parseInt(formData.jeeMains) || 0;
    const hasOlympiad = formData.olympiadPhysics || formData.olympiadMath || formData.olympiadOther;
    
    if (jee > 200 || hasOlympiad) return 'elite';
    if (jee > 100) return 'balanced';
    return 'skill-first';
  };

  const getRecommendedColleges = () => {
    const profile = calculateEligibility();
    const all = Object.values(COLLEGE_DATA).flat();
    
    if (profile === 'elite') {
      return [...COLLEGE_DATA.elite, ...COLLEGE_DATA['new-age'].slice(0, 3), ...COLLEGE_DATA.affordable.slice(0, 3)];
    } else if (profile === 'balanced') {
      return [...COLLEGE_DATA.affordable.slice(0, 5), ...COLLEGE_DATA['new-age'], ...COLLEGE_DATA.online];
    } else {
      return [...COLLEGE_DATA['new-age'], ...COLLEGE_DATA.affordable.slice(0, 4), ...COLLEGE_DATA.online];
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const sendOTP = () => {
    setOtpSent(true);
    setTimeout(() => setOtpVerified(true), 1500);
  };

  const handleFormSubmit = () => {
    if (!otpVerified) {
      alert('Please verify your contact number first');
      return;
    }
    setCurrentPage('discovery');
  };

  const toggleCollegeSelection = (college) => {
    setSelectedColleges(prev => {
      const exists = prev.find(c => c.id === college.id);
      if (exists) {
        return prev.filter(c => c.id !== college.id);
      } else {
        return [...prev, college];
      }
    });
  };

  const isCollegeSelected = (collegeId) => {
    return selectedColleges.some(c => c.id === collegeId);
  };

  const totalApplicationFee = selectedColleges.length * 500;
  const discount = selectedColleges.length > 3 ? 20 : selectedColleges.length > 1 ? 10 : 0;
  const finalAmount = totalApplicationFee - (totalApplicationFee * discount / 100);

  // College Card Component
  const CollegeCard = ({ college, category }) => {
    const selected = isCollegeSelected(college.id);
    
    return (
      <div
        onClick={() => toggleCollegeSelection(college)}
        className={`flex-shrink-0 w-44 h-52 rounded-2xl cursor-pointer transition-all duration-300 relative group ${
          selected 
            ? 'bg-gradient-to-br from-blue-600 to-indigo-700 shadow-2xl shadow-blue-500/40 scale-105' 
            : 'bg-white hover:shadow-xl border-2 border-gray-100 hover:border-blue-200'
        }`}
      >
        {selected && (
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg z-10">
            <Check size={18} className="text-white" />
          </div>
        )}
        
        <div className="p-5 h-full flex flex-col justify-between">
          <div>
            <div className={`text-sm font-bold mb-3 line-clamp-2 ${selected ? 'text-white' : 'text-gray-900'}`}>
              {college.name}
            </div>
            <div className="flex items-center justify-center h-16 mb-3">
              <GraduationCap size={40} className={selected ? 'text-blue-100' : 'text-blue-600'} />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className={`flex items-center gap-2 text-xs ${selected ? 'text-blue-100' : 'text-gray-600'}`}>
              <MapPin size={14} />
              <span>{college.city}</span>
            </div>
            <div className={`flex items-center gap-2 text-xs ${selected ? 'text-blue-100' : 'text-gray-600'}`}>
              <TrendingUp size={14} />
              <span>{college.avgPackage}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Form Page
  if (currentPage === 'form') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 space-y-3">
            <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Sparkles size={16} />
              <span>India's Smartest Application Platform</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Master Engineering<br />Application Form
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Single form to apply to 120+ curated colleges based on your marks & achievements
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-2xl shadow-blue-900/10 p-8 border border-gray-100">
            <div className="space-y-6">
              {/* Essential Details */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Target size={20} className="text-blue-600" />
                  Essential Details
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Student Name *"
                    value={formData.studentName}
                    onChange={(e) => handleInputChange('studentName', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="Parent Name *"
                    value={formData.parentName}
                    onChange={(e) => handleInputChange('parentName', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Contact with OTP */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number *</label>
                <div className="flex gap-3">
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={formData.contact}
                    onChange={(e) => handleInputChange('contact', e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                  <button
                    onClick={sendOTP}
                    disabled={otpVerified || formData.contact.length !== 10}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      otpVerified 
                        ? 'bg-green-500 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50'
                    }`}
                  >
                    {otpVerified ? <Check size={20} /> : otpSent ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </div>
              </div>

              {/* Exam Scores */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen size={20} className="text-blue-600" />
                  Exam Scores
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="JEE Mains Marks *"
                    value={formData.jeeMains}
                    onChange={(e) => handleInputChange('jeeMains', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                  <input
                    type="number"
                    placeholder="BITSAT Score"
                    value={formData.bitsat}
                    onChange={(e) => handleInputChange('bitsat', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                  <input
                    type="number"
                    placeholder="COMEDK Score"
                    value={formData.comedk}
                    onChange={(e) => handleInputChange('comedk', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                  <input
                    type="number"
                    placeholder="KCET Score"
                    value={formData.kcet}
                    onChange={(e) => handleInputChange('kcet', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                  <input
                    type="number"
                    placeholder="MHTCET Score"
                    value={formData.mhtcet}
                    onChange={(e) => handleInputChange('mhtcet', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                  <input
                    type="number"
                    placeholder="EAPCET Score"
                    value={formData.eapcet}
                    onChange={(e) => handleInputChange('eapcet', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                  <input
                    type="number"
                    placeholder="VITEEE Score"
                    value={formData.viteee}
                    onChange={(e) => handleInputChange('viteee', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                  <input
                    type="number"
                    placeholder="SRMJEE Score"
                    value={formData.srmjee}
                    onChange={(e) => handleInputChange('srmjee', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                  <input
                    type="number"
                    placeholder="WBJEE Score"
                    value={formData.wbjee}
                    onChange={(e) => handleInputChange('wbjee', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Optional Details - Accordion */}
              <details className="group">
                <summary className="cursor-pointer list-none">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <span className="font-semibold text-gray-900">Additional Information (Optional)</span>
                    <ChevronRight size={20} className="text-gray-600 group-open:rotate-90 transition-transform" />
                  </div>
                </summary>
                <div className="mt-4 space-y-4 pl-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <select
                      value={formData.board}
                      onChange={(e) => handleInputChange('board', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                    >
                      <option value="">Select Board</option>
                      <option value="CBSE">CBSE</option>
                      <option value="ICSE">ICSE</option>
                      <option value="State Board">State Board</option>
                      <option value="IB">IB</option>
                    </select>
                    <select
                      value={formData.homeState}
                      onChange={(e) => handleInputChange('homeState', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                    >
                      <option value="">Home State</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Other">Other</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Physics Marks"
                      value={formData.physics}
                      onChange={(e) => handleInputChange('physics', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                    <input
                      type="number"
                      placeholder="Chemistry Marks"
                      value={formData.chemistry}
                      onChange={(e) => handleInputChange('chemistry', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                    <input
                      type="number"
                      placeholder="Math Marks"
                      value={formData.math}
                      onChange={(e) => handleInputChange('math', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                    <input
                      type="number"
                      placeholder="Computer Science Marks"
                      value={formData.cs}
                      onChange={(e) => handleInputChange('cs', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Olympiad Achievements</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        placeholder="Physics Olympiad"
                        value={formData.olympiadPhysics}
                        onChange={(e) => handleInputChange('olympiadPhysics', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                      />
                      <input
                        type="text"
                        placeholder="Math Olympiad"
                        value={formData.olympiadMath}
                        onChange={(e) => handleInputChange('olympiadMath', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                      />
                      <input
                        type="text"
                        placeholder="Other Olympiad"
                        value={formData.olympiadOther}
                        onChange={(e) => handleInputChange('olympiadOther', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </details>

              {/* Submit Button */}
              <button
                onClick={handleFormSubmit}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 flex items-center justify-center gap-2 group"
              >
                <span>Continue to College Selection</span>
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-6 pt-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>100% Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>Data Protected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Discovery Page
  if (currentPage === 'discovery') {
    const recommended = getRecommendedColleges();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-32">
        {/* Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-200 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Select Colleges to Apply</h1>
                <p className="text-sm text-gray-600 mt-1">Curated based on your eligibility profile</p>
              </div>
              {selectedColleges.length > 0 && (
                <div className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold text-sm">
                  {selectedColleges.length} Selected
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          {/* Recommended Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles size={24} className="text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Recommended For You</h2>
              </div>
              <button
                onClick={() => setExpandedSections(prev => ({ ...prev, recommended: !prev.recommended }))}
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
              >
                {expandedSections.recommended ? 'Show Less' : 'Expand All'}
                <ChevronRight size={16} className={expandedSections.recommended ? 'rotate-90' : ''} />
              </button>
            </div>
            <div className={`flex gap-4 ${expandedSections.recommended ? 'flex-wrap' : 'overflow-x-auto pb-4 scrollbar-hide'}`}>
              {recommended.map(college => (
                <CollegeCard key={college.id} college={college} category="recommended" />
              ))}
            </div>
          </section>

          {/* New-Age Skill-First */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">New-Age Skill-First Institutes</h2>
              <button
                onClick={() => setExpandedSections(prev => ({ ...prev, newage: !prev.newage }))}
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
              >
                {expandedSections.newage ? 'Show Less' : 'Expand All'}
                <ChevronRight size={16} className={expandedSections.newage ? 'rotate-90' : ''} />
              </button>
            </div>
            <div className={`flex gap-4 ${expandedSections.newage ? 'flex-wrap' : 'overflow-x-auto pb-4 scrollbar-hide'}`}>
              {COLLEGE_DATA['new-age'].map(college => (
                <CollegeCard key={college.id} college={college} category="new-age" />
              ))}
            </div>
          </section>

          {/* Affordable Universities */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Affordable Universities</h2>
              <button
                onClick={() => setExpandedSections(prev => ({ ...prev, affordable: !prev.affordable }))}
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
              >
                {expandedSections.affordable ? 'Show Less' : 'Expand All'}
                <ChevronRight size={16} className={expandedSections.affordable ? 'rotate-90' : ''} />
              </button>
            </div>
            <div className={`flex gap-4 ${expandedSections.affordable ? 'flex-wrap' : 'overflow-x-auto pb-4 scrollbar-hide'}`}>
              {COLLEGE_DATA.affordable.map(college => (
                <CollegeCard key={college.id} college={college} category="affordable" />
              ))}
            </div>
          </section>

          {/* Elite Universities */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Elite Universities</h2>
              <button
                onClick={() => setExpandedSections(prev => ({ ...prev, elite: !prev.elite }))}
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
              >
                {expandedSections.elite ? 'Show Less' : 'Expand All'}
                <ChevronRight size={16} className={expandedSections.elite ? 'rotate-90' : ''} />
              </button>
            </div>
            <div className={`flex gap-4 ${expandedSections.elite ? 'flex-wrap' : 'overflow-x-auto pb-4 scrollbar-hide'}`}>
              {COLLEGE_DATA.elite.map(college => (
                <CollegeCard key={college.id} college={college} category="elite" />
              ))}
            </div>
          </section>

          {/* Online Bachelor's */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Online Bachelor's Programs</h2>
              <button
                onClick={() => setExpandedSections(prev => ({ ...prev, online: !prev.online }))}
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
              >
                {expandedSections.online ? 'Show Less' : 'Expand All'}
                <ChevronRight size={16} className={expandedSections.online ? 'rotate-90' : ''} />
              </button>
            </div>
            <div className={`flex gap-4 ${expandedSections.online ? 'flex-wrap' : 'overflow-x-auto pb-4 scrollbar-hide'}`}>
              {COLLEGE_DATA.online.map(college => (
                <CollegeCard key={college.id} college={college} category="online" />
              ))}
            </div>
          </section>
        </div>

        {/* Floating Action Bar */}
        {selectedColleges.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-40">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-gray-600">Selected Colleges</div>
                  <div className="text-xl font-bold text-gray-900">{selectedColleges.length} Colleges</div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSummary(true)}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-xl transition-colors"
                  >
                    Learn More
                  </button>
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2"
                  >
                    <ShoppingCart size={20} />
                    <span>Apply Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Checkout Modal */}
        {showCheckout && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between rounded-t-3xl">
                <h2 className="text-2xl font-bold text-gray-900">Complete Your Application</h2>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-8 space-y-6">
                {/* Selected Colleges */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Selected Colleges ({selectedColleges.length})</h3>
                  <div className="space-y-3">
                    {selectedColleges.map(college => (
                      <div key={college.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <GraduationCap size={24} className="text-blue-600" />
                          <div>
                            <div className="font-semibold text-gray-900">{college.name}</div>
                            <div className="text-sm text-gray-600">{college.city}</div>
                          </div>
                        </div>
                        <div className="text-gray-900 font-semibold">₹500</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div className="border-t border-gray-200 pt-6 space-y-3">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Subtotal ({selectedColleges.length} applications)</span>
                    <span>₹{totalApplicationFee}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex items-center justify-between text-green-600">
                      <span>Multi-application discount ({discount}%)</span>
                      <span>- ₹{totalApplicationFee * discount / 100}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-200">
                    <span>Total Amount</span>
                    <span>₹{finalAmount}</span>
                  </div>
                </div>

                {/* Payment Button */}
                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/30">
                  Proceed to Payment
                </button>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-green-500" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-green-500" />
                    <span>Application Tracking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Summary Modal */}
        {showSummary && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-6 flex items-center justify-between rounded-t-3xl">
                <div className="flex items-center gap-3">
                  <Sparkles size={28} />
                  <h2 className="text-2xl font-bold">AI-Powered College Insights</h2>
                </div>
                <button
                  onClick={() => setShowSummary(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-8 space-y-8">
                {selectedColleges.map((college, index) => (
                  <div key={college.id} className="border border-gray-200 rounded-2xl overflow-hidden">
                    {/* College Header */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-md">
                            <GraduationCap size={32} className="text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{college.name}</h3>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar size={14} />
                                <span>Est. {college.year}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin size={14} />
                                <span>{college.city}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold text-sm">
                          ROI: {college.roi}%
                        </div>
                      </div>
                    </div>

                    {/* College Details Grid */}
                    <div className="p-6 grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Users size={20} className="text-blue-600 mt-1" />
                          <div>
                            <div className="font-semibold text-gray-900">Alumni Network</div>
                            <div className="text-gray-600">{college.alumni.toLocaleString()}+ graduates</div>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <Building2 size={20} className="text-blue-600 mt-1" />
                          <div>
                            <div className="font-semibold text-gray-900">Batch Size</div>
                            <div className="text-gray-600">{college.batch} students per year</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Award size={20} className="text-blue-600 mt-1" />
                          <div>
                            <div className="font-semibold text-gray-900">Key Achievement</div>
                            <div className="text-gray-600">Industry-recognized curriculum</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <TrendingUp size={20} className="text-green-600 mt-1" />
                          <div>
                            <div className="font-semibold text-gray-900">Placement Records</div>
                            <div className="text-gray-600">Avg: {college.avgPackage}</div>
                            <div className="text-gray-600">Highest: {college.highestPackage}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <DollarSign size={20} className="text-blue-600 mt-1" />
                          <div>
                            <div className="font-semibold text-gray-900">Total Fees</div>
                            <div className="text-gray-600">₹{college.fees} (4 years)</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Visit Website Button */}
                    <div className="px-6 pb-6">
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                        <ExternalLink size={18} />
                        <span>Visit Official Website</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default MasterEngineeringApp;
