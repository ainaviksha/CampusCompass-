import React from 'react';
import { Check, Sparkles } from 'lucide-react';

const STEPS = [
    { label: 'Fill Details' },
    { label: 'Select Colleges' },
    { label: 'Apply / Learn More' },
];

const StepIndicator = ({ currentStep = 1 }) => (
    <div className="sticky top-0 z-30 px-4 py-3 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100">
        <div className="flex items-center max-w-2xl mx-auto relative">
            {/* Desktop: Naviksha AI brand — left side */}
            <div className="hidden md:flex items-center gap-1.5 absolute -left-32 top-1/2 -translate-y-1/2">
                <Sparkles size={14} className="text-indigo-500" />
                <span className="text-sm text-indigo-600 font-bold tracking-tight whitespace-nowrap">Naviksha AI</span>
            </div>

            {/* Steps row */}
            <div className="flex items-center justify-between flex-1">
                {STEPS.map((step, idx) => {
                    const stepNum = idx + 1;
                    const isComplete = stepNum < currentStep;
                    const isActive = stepNum === currentStep;

                    return (
                        <React.Fragment key={step.label}>
                            <div className="flex flex-col items-center gap-1">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${isComplete
                                        ? 'bg-green-500 text-white shadow-md shadow-green-200'
                                        : isActive
                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                            : 'bg-slate-200 text-slate-400'
                                        }`}
                                >
                                    {isComplete ? <Check size={16} /> : stepNum}
                                </div>
                                <span
                                    className={`text-[10px] font-medium transition-colors duration-300 whitespace-nowrap ${isComplete
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
                                <div className="flex-1 mx-2 relative -top-2">
                                    <div className={`h-0.5 transition-colors duration-300 ${stepNum < currentStep ? 'bg-green-400' : 'bg-slate-200'
                                        }`} />
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>

        {/* Mobile/Tablet: Powered by Naviksha AI — centered below steps */}
        <div className="flex md:hidden items-center justify-center gap-1 mt-1.5">
            <Sparkles size={9} className="text-indigo-400" />
            <span className="text-[9px] text-slate-400 font-medium">Powered by Naviksha AI</span>
        </div>
    </div>
);

export default StepIndicator;
