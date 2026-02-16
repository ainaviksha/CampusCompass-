import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, Zap } from 'lucide-react';

const CheckoutModal = ({ isOpen, onClose, colleges }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen) return null;

    const APP_FEE = 500;
    const TOTAL = colleges.length * APP_FEE;
    const DISCOUNT = colleges.length > 3 ? 200 : 0; // Discount logic
    const FINAL_TOTAL = TOTAL - DISCOUNT;

    const handlePayment = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            alert('Payment Successful! Applications Submitted.');
            onClose();
            // Here you would clear state or redirect
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in scale-95 duration-200">

                {/* Header */}
                <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Review Application</h2>
                        <p className="text-sm text-slate-500">You are about to apply to {colleges.length} colleges</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
                </div>

                {/* List */}
                <div className="p-6 max-h-[300px] overflow-y-auto space-y-3">
                    {colleges.map((college, idx) => (
                        <div key={college.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                            <div className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">{idx + 1}</span>
                                <span className="font-semibold text-slate-700">{college.name}</span>
                            </div>
                            <span className="font-medium text-slate-900">₹{APP_FEE}</span>
                        </div>
                    ))}
                </div>

                {/* Pricing Summary */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-3">
                    <div className="flex justify-between text-sm text-slate-500">
                        <span>Subtotal</span>
                        <span>₹{TOTAL}</span>
                    </div>
                    {DISCOUNT > 0 && (
                        <div className="flex justify-between text-sm text-green-600 font-medium">
                            <span>Bundle Discount</span>
                            <span>-₹{DISCOUNT}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-lg font-bold text-slate-900 pt-3 border-t border-slate-200">
                        <span>Total Payable</span>
                        <span>₹{FINAL_TOTAL}</span>
                    </div>
                </div>

                {/* Action */}
                <div className="p-6 pt-0 bg-slate-50">
                    <button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-slate-300 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                    >
                        {isProcessing ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <CreditCard size={20} />
                                <span>Pay ₹{FINAL_TOTAL} Securely</span>
                            </>
                        )}
                    </button>
                    <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-400">
                        <ShieldCheck size={14} /> 256-bit SSL Encrypted Payment
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CheckoutModal;
