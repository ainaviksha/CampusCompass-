import React from 'react';
import { Check, Sparkles } from 'lucide-react';

const STEPS = [
    { label: 'Fill Details' },
    { label: 'Select Colleges' },
    { label: 'Apply / Learn More' },
];

const StepIndicator = ({ currentStep = 1 }) => (
    <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-2 sm:py-3">
            {/* Row 1: Naviksha AI brand — top-left */}
            <div className="flex items-center gap-1.5 mb-2 sm:mb-3">
                <img src="/logo.png" alt="Naviksha AI" className="w-5 h-5 sm:w-6 sm:h-6 rounded-md" />
                <span className="text-sm sm:text-base text-blue-600 font-bold tracking-tight">Naviksha AI</span>
            </div>

            {/* Row 2: Steps — centered */}
            <div className="flex items-center justify-between max-w-md mx-auto">
                {STEPS.map((step, idx) => {
                    const stepNum = idx + 1;
                    const isComplete = stepNum < currentStep;
                    const isActive = stepNum === currentStep;

                    return (
                        <React.Fragment key={step.label}>
                            <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                                <div
                                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${isComplete
                                        ? 'bg-green-500 text-white shadow-md shadow-green-200'
                                        : isActive
                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                            : 'bg-slate-200 text-slate-400'
                                        }`}
                                >
                                    {isComplete ? <Check size={16} /> : stepNum}
                                </div>
                                <span
                                    className={`text-[9px] sm:text-[11px] font-medium transition-colors duration-300 whitespace-nowrap ${isComplete
                                        ? 'text-green-600 font-semibold'
                                        : isActive
                                            ? 'text-blue-700 font-semibold'
                                            : 'text-slate-400'
                                        }`}
                                >
                                    {step.label}
                                </span>
                            </div>

                            {idx < STEPS.length - 1 && (
                                <div className="flex-1 mx-1.5 sm:mx-3 relative -top-2">
                                    <div className={`h-0.5 transition-colors duration-300 ${stepNum < currentStep ? 'bg-green-400' : 'bg-slate-200'
                                        }`} />
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    </div>
);

export default StepIndicator;
