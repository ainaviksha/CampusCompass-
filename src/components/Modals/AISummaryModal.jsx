import React from 'react';
import { X, ExternalLink, GraduationCap, DollarSign, TrendingUp, Users } from 'lucide-react';
import { clsx } from 'clsx';

const AISummaryModal = ({ isOpen, onClose, colleges }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl relative max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <Sparkles className="text-blue-600 fill-blue-100" />
                            AI Insights Summary
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">Comparing {colleges.length} selected institutes based on ROI & Placement Hygiene</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="overflow-y-auto p-6 space-y-8 bg-slate-50/30">
                    {colleges.map((college) => (
                        <div key={college.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:border-blue-200 transition-colors">
                            {/* College Header Card */}
                            <div className="p-6 bg-gradient-to-br from-white to-slate-50 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-xl shadow-md border border-slate-200 flex items-center justify-center overflow-hidden bg-slate-50">
                                        {college.logo ? (
                                            <img
                                                src={college.logo}
                                                alt=""
                                                className="object-contain w-12 h-12"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.style.background = 'linear-gradient(135deg, #2563EB, #4F46E5)';
                                                    e.target.parentElement.innerHTML = `<span style="color:white;font-weight:800;font-size:1.25rem">${college.name.split(' ').filter(w => !['of', 'the', 'and'].includes(w.toLowerCase())).slice(0, 2).map(w => w[0]).join('').toUpperCase()}</span>`;
                                                }}
                                            />
                                        ) : (
                                            <span className="text-white font-extrabold text-xl">
                                                {college.name.split(' ').filter(w => !['of', 'the', 'and'].includes(w.toLowerCase())).slice(0, 2).map(w => w[0]).join('').toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{college.name}</h3>
                                        <p className="text-sm text-slate-500 flex items-center gap-2">
                                            <span className="flex items-center gap-1"><MapPin size={14} /> {college.city}, {college.state}</span>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                            <span>Est. {college.year}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg flex flex-col items-center border border-green-100">
                                        <span className="text-xs font-semibold uppercase tracking-wider">ROI Score</span>
                                        <span className="text-lg font-bold">{college.roi}%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100 border-b border-slate-100">
                                <div className="p-4 flex flex-col items-center text-center">
                                    <span className="text-xs text-slate-500 uppercase font-semibold mb-1">Avg Package</span>
                                    <span className="text-lg font-bold text-slate-800">{college.avgPackage}</span>
                                </div>
                                <div className="p-4 flex flex-col items-center text-center">
                                    <span className="text-xs text-slate-500 uppercase font-semibold mb-1">Highest</span>
                                    <span className="text-lg font-bold text-slate-800">{college.highestPackage}</span>
                                </div>
                                <div className="p-4 flex flex-col items-center text-center">
                                    <span className="text-xs text-slate-500 uppercase font-semibold mb-1">Total Fees</span>
                                    <span className="text-lg font-bold text-slate-800">{college.fees.split(' ')[0]}</span>
                                </div>
                                <div className="p-4 flex flex-col items-center text-center">
                                    <span className="text-xs text-slate-500 uppercase font-semibold mb-1">Alumni</span>
                                    <span className="text-lg font-bold text-slate-800">{college.alumni}</span>
                                </div>
                            </div>

                            {/* Highlights & Action */}
                            <div className="p-6 bg-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-start gap-3 flex-1">
                                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mt-1">
                                        <Sparkles size={16} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900 text-sm">Key Highlights</h4>
                                        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">{college.achievements || "Standard engineering curriculum with decent placement tracking."}</p>
                                    </div>
                                </div>

                                <a
                                    href={college.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="whitespace-nowrap px-6 py-2.5 bg-white border-2 border-slate-200 hover:border-blue-500 text-slate-700 hover:text-blue-600 font-semibold rounded-xl flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
                                >
                                    <ExternalLink size={16} />
                                    Visit Website
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 bg-slate-50 text-center">
                    <p className="text-xs text-slate-400">AI insights are generated based on available data points. Verification recommended.</p>
                </div>
            </div>
        </div>
    );
};

const Sparkles = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M9 3v4" /><path d="M3 9h4" /></svg>
);

const MapPin = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
);


export default AISummaryModal;
