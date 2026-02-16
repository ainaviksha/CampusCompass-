import React, { useState } from 'react';
import { GraduationCap, CreditCard, ShieldCheck, Check, ArrowLeft, Sparkles } from 'lucide-react';

const CheckoutPage = ({ colleges, onBack, onPaymentComplete }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const APP_FEE = 500;
    const totalFee = colleges.length * APP_FEE;
    const discount = colleges.length > 3 ? 10 : colleges.length > 1 ? 5 : 0;
    const discountAmount = Math.round(totalFee * discount / 100);
    const finalAmount = totalFee - discountAmount;

    const handlePayment = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            alert('🎉 Payment Successful! Your applications have been submitted.');
            if (onPaymentComplete) onPaymentComplete();
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-2xl mx-auto py-6 sm:py-8 px-3 sm:px-4">

                {/* Page Header */}
                <div className="mb-4 sm:mb-6">
                    <button
                        onClick={onBack}
                        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors mb-3"
                    >
                        <ArrowLeft size={14} />
                        Back to College Selection
                    </button>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Complete Your Application</h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Review your selected colleges and proceed to payment</p>
                </div>

                {/* Selected Colleges Card */}
                <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden mb-4 sm:mb-5">
                    <div className="px-3.5 sm:px-5 py-2.5 sm:py-3 bg-slate-50 border-b border-slate-100">
                        <h2 className="text-sm font-bold text-slate-800">Selected Colleges ({colleges.length})</h2>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-[350px] overflow-y-auto">
                        {colleges.map((college, idx) => (
                            <div key={college.id} className="flex items-center justify-between px-3.5 sm:px-5 py-2.5 sm:py-3 hover:bg-slate-50/50 transition-colors gap-2">
                                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-100 flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-blue-600 flex-shrink-0">{idx + 1}</span>
                                    <div className="min-w-0">
                                        <div className="text-xs sm:text-sm font-semibold text-slate-900 truncate">{college.name}</div>
                                        <div className="text-[10px] sm:text-xs text-slate-500 truncate">{college.city || college.location}</div>
                                    </div>
                                </div>
                                <span className="text-xs sm:text-sm font-semibold text-slate-700 flex-shrink-0">₹{APP_FEE}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pricing Card */}
                <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden mb-4 sm:mb-5">
                    <div className="p-3.5 sm:p-5 space-y-2">
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>Subtotal ({colleges.length} {colleges.length === 1 ? 'application' : 'applications'})</span>
                            <span>₹{totalFee.toLocaleString()}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-xs text-green-600 font-medium">
                                <span>Multi-application discount ({discount}%)</span>
                                <span>- ₹{discountAmount.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-base sm:text-lg font-bold text-slate-900 pt-3 border-t border-slate-200">
                            <span>Total Amount</span>
                            <span>₹{finalAmount.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Button */}
                <button
                    onClick={handlePayment}
                    disabled={isProcessing || colleges.length === 0}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-400 text-white text-sm font-semibold py-3 rounded-lg shadow-md shadow-blue-200 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                >
                    {isProcessing ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <CreditCard size={18} />
                            <span>Proceed to Payment — ₹{finalAmount.toLocaleString()}</span>
                        </>
                    )}
                </button>

                {/* Trust Badges */}
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mt-4 text-[10px] sm:text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                        <Check size={14} className="text-green-500" />
                        <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <ShieldCheck size={14} className="text-green-500" />
                        <span>256-bit SSL</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Check size={14} className="text-green-500" />
                        <span>Application Tracking</span>
                    </div>
                </div>

                {/* Powered by */}
                <p className="text-center text-[10px] text-slate-300 mt-3 flex items-center justify-center gap-1">
                    <Sparkles size={9} className="text-indigo-400" /> Powered by Naviksha AI
                </p>
            </div>
        </div>
    );
};

export default CheckoutPage;
