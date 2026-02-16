import React, { useState } from 'react';
import { Check, MapPin, TrendingUp, GraduationCap } from 'lucide-react';
import { clsx } from 'clsx';

const GRADIENTS = [
    ['#2563EB', '#4F46E5'], // Blue → Indigo
    ['#7C3AED', '#6D28D9'], // Violet
    ['#0891B2', '#0E7490'], // Cyan → Teal
    ['#059669', '#047857'], // Emerald
    ['#D97706', '#B45309'], // Amber
    ['#DC2626', '#B91C1C'], // Red
    ['#EC4899', '#DB2777'], // Pink
    ['#8B5CF6', '#7C3AED'], // Purple
    ['#0284C7', '#0369A1'], // Sky
    ['#16A34A', '#15803D'], // Green
];

const getInitials = (name) => {
    // Remove common words and get meaningful initials
    const cleanName = name.replace(/\(.*?\)/g, '').replace(/University|School|Institute|of|the|and/gi, '').trim();
    const words = cleanName.split(/\s+/).filter(Boolean);
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return words[0]?.substring(0, 2).toUpperCase() || '??';
};

const getGradient = (name) => {
    // Simple hash to get a consistent gradient per college
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
};

const CollegeCard = ({ college, isSelected, onToggle }) => {
    const [imgError, setImgError] = useState(false);
    const showLogo = college.logo && !imgError;

    return (
        <div
            onClick={() => onToggle(college)}
            className={clsx(
                "flex-shrink-0 w-56 h-72 rounded-2xl cursor-pointer transition-all duration-300 relative group border-2 flex flex-col overflow-hidden select-none",
                isSelected
                    ? "border-blue-500 bg-blue-50 shadow-xl shadow-blue-500/10 scale-105"
                    : "border-transparent bg-white shadow-md hover:shadow-xl hover:-translate-y-1"
            )}
        >
            {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg z-10 animate-in zoom-in duration-200">
                    <Check size={14} className="text-white" strokeWidth={3} />
                </div>
            )}

            {/* Image/Logo Area */}
            <div className="h-32 flex items-center justify-center relative overflow-hidden bg-white"
                style={{
                    background: showLogo ? '#ffffff' : `linear-gradient(135deg, ${getGradient(college.name)[0]}, ${getGradient(college.name)[1]})`
                }}>

                {showLogo ? (
                    <img
                        src={college.logo}
                        alt={college.name}
                        className="max-w-[80%] max-h-[80%] object-contain hover:scale-105 transition-transform duration-300"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <>
                        <span className="text-4xl font-black text-white/90 tracking-tight select-none">
                            {getInitials(college.name)}
                        </span>
                        {/* Gradient overlay only for initial-based background to add depth */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    </>
                )}

                {/* Location Overlay - Dark gradient at bottom to ensure white text pops on any background */}
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-2 left-3 right-3 text-white pointer-events-none z-10">
                    <p className="text-xs font-medium opacity-95 drop-shadow-md">{college.city}, {college.state}</p>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className={clsx("font-bold text-sm leading-tight mb-1 line-clamp-2", isSelected ? "text-blue-700" : "text-slate-800")}>
                        {college.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-medium">Est. {college.year}</span>
                    </div>
                </div>

                <div className="space-y-1.5 mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Avg Package</span>
                        <span className="font-bold text-slate-700">{college.avgPackage}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Fees</span>
                        <span className="font-bold text-slate-700">{college.fees.split(' ')[0]}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollegeCard;
