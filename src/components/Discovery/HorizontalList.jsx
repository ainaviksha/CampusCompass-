import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import CollegeCard from './CollegeCard';
import { clsx } from 'clsx';

const HorizontalList = ({ title, colleges, selectedColleges, onToggle, appliedCollegeIds = [] }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="py-2">
            <div className="flex items-center justify-between mb-2 px-4 md:px-0">
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    {title}
                    <span className="text-[10px] font-normal text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">{colleges.length}</span>
                </h2>
                {colleges.length > 4 && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-blue-600 hover:text-blue-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                        {isExpanded ? 'Show Less' : 'View All'}
                        <ChevronRight size={14} className={clsx("transition-transform duration-300", isExpanded ? "rotate-90" : "")} />
                    </button>
                )}
            </div>

            <div
                className={clsx(
                    "flex gap-3 transition-all duration-500",
                    isExpanded
                        ? "flex-wrap justify-center md:justify-start p-2 md:p-0"
                        : "overflow-x-auto py-3 pb-4 -mx-4 md:mx-0 px-4 md:px-0 scrollbar-hide snap-x"
                )}
            >
                {colleges.map((college) => (
                    <div key={college.id} className="snap-center">
                        <CollegeCard
                            college={college}
                            isSelected={selectedColleges.some(c => c.id === college.id)}
                            isApplied={appliedCollegeIds.includes(college.id)}
                            onToggle={onToggle}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HorizontalList;
