import React, { useState } from 'react';
import { GraduationCap, CreditCard, ShieldCheck, Check, ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import studentApi from '../../utils/studentApi';
import { getStudentToken } from '../../utils/studentAuth';

const CheckoutPage = ({ colleges, onBack, onPaymentComplete }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState(null);

    const APP_FEE = 500;
    const totalFee = colleges.length * APP_FEE;
    const discount = colleges.length > 3 ? 10 : colleges.length > 1 ? 5 : 0;
    const discountAmount = Math.round(totalFee * discount / 100);
    const finalAmount = totalFee - discountAmount;

    const handlePayment = async () => {
        setIsProcessing(true);
        setPaymentError(null);

        try {
            // Build the application payload
            const payload = {
                colleges: colleges.map(c => ({
                    collegeId: c.id,
                    name: c.name,
                    city: c.city || null,
                    status: 'submitted',
                })),
                pricing: {
                    subtotal: totalFee,
                    discountPercent: discount,
                    discountAmount: discountAmount,
                    finalAmount: finalAmount,
                },
            };

            // Create application record in DB
            const res = await studentApi.post('/students/applications', payload);

            if (res.data?.success) {
                // TODO: Integrate real payment gateway (Razorpay) here.
                // For now, mark payment as "paid" immediately after creating the application.
                if (onPaymentComplete) onPaymentComplete();
            } else {
                setPaymentError('Failed to create application. Please try again.');
            }
        } catch (err) {
            console.error('Payment error:', err);
            const detail = err.response?.data?.detail;
            if (err.response?.status === 401) {
                setPaymentError('Session expired. Please go back and re-submit the form.');
            } else {
                setPaymentError(detail || 'Something went wrong. Please try again.');
            }
        } finally {
            setIsProcessing(false);
        }
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

                {paymentError && (
                    <div className="mb-4 sm:mb-5 p-3 sm:p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2.5">
                        <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs sm:text-sm text-red-600 font-medium">{paymentError}</p>
                    </div>
                )}

                {/* Payment Button */}
                <button
                    onClick={handlePayment}
                    disabled={isProcessing || colleges.length === 0}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-400 text-white text-sm font-semibold py-3 rounded-lg shadow-md shadow-blue-200 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                >
                    {isProcessing ? (
                        <div className="flex flex-col items-center">
                            <Loader2 size={18} className="animate-spin mb-1" />
                            <span className="text-xs">Processing application...</span>
                        </div>
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
