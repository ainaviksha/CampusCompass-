import React, { useState, useMemo } from 'react';
import { Sparkles, ShoppingCart, Info, Search, SlidersHorizontal, X, Building2, GraduationCap, Award, Home, ArrowLeft } from 'lucide-react';
import HorizontalList from './HorizontalList';
import { COLLEGE_DATA } from '../../data/colleges';
import { clsx } from 'clsx';

// Extract unique values for filters
const ALL_COLLEGE_TYPES = [...new Set(COLLEGE_DATA.map(c => c.collegeType).filter(Boolean))];
const ALL_COURSES = [...new Set(COLLEGE_DATA.flatMap(c => c.courses || []))].sort();
const ALL_ENTRANCE_EXAMS = [...new Set(COLLEGE_DATA.flatMap(c => (c.entranceExams || []).map(e => e.split(' (')[0])))].sort();

const DiscoveryPage = ({ selectedColleges, onToggleCollege, onOpenSummary, onOpenCheckout, onBackToForm }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Filter state
    const [filters, setFilters] = useState({
        collegeType: [],
        minPlacement: 0,
        hasHostel: false,
        courses: [],
        nirfOnly: false,
    });

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.collegeType.length) count++;
        if (filters.minPlacement > 0) count++;
        if (filters.hasHostel) count++;
        if (filters.courses.length) count++;
        if (filters.nirfOnly) count++;
        return count;
    }, [filters]);

    const toggleArrayFilter = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: prev[key].includes(value)
                ? prev[key].filter(v => v !== value)
                : [...prev[key], value]
        }));
    };

    const clearFilters = () => {
        setFilters({ collegeType: [], minPlacement: 0, hasHostel: false, courses: [], nirfOnly: false });
    };

    const filteredData = useMemo(() => {
        return COLLEGE_DATA.filter(c => {
            // Search
            const matchesSearch = !searchTerm ||
                c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (c.courses || []).some(course => course.toLowerCase().includes(searchTerm.toLowerCase()));

            // College Type
            const matchesType = filters.collegeType.length === 0 || filters.collegeType.includes(c.collegeType);

            // Placement %
            const matchesPlacement = filters.minPlacement === 0 || (c.placementPercent && c.placementPercent >= filters.minPlacement);

            // Hostel
            const matchesHostel = !filters.hasHostel || c.hostelAvailable === true;

            // Courses
            const matchesCourses = filters.courses.length === 0 ||
                filters.courses.some(fc => (c.courses || []).includes(fc));

            // NIRF
            const matchesNirf = !filters.nirfOnly || c.nirfRank !== null;

            return matchesSearch && matchesType && matchesPlacement && matchesHostel && matchesCourses && matchesNirf;
        });
    }, [searchTerm, filters]);

    const categories = {
        'Recommended For You': filteredData.slice(0, 5),
        'New-Age Skill-First Institutes': filteredData.filter(c => c.category === 'New-Age'),
        'Elite Universities': filteredData.filter(c => c.category === 'Elite'),
        'Affordable Universities': filteredData.filter(c => c.category === 'Affordable'),
        'Online Bachelor\'s': filteredData.filter(c => c.category === 'Online'),
    };

    return (
        <div className="pb-28 bg-slate-50 min-h-screen">
            {/* Sticky Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
                    {/* Top row: back + title + filter + selected */}
                    <div className="flex items-center justify-between gap-2 mb-2 sm:mb-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                            {onBackToForm && (
                                <button
                                    onClick={onBackToForm}
                                    className="p-1 sm:p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors flex-shrink-0"
                                    title="Back to Form"
                                >
                                    <ArrowLeft size={16} />
                                </button>
                            )}
                            <div className="hidden md:block">
                                <h1 className="text-lg font-bold text-slate-900 leading-tight">Select Colleges</h1>
                                <p className="text-[11px] text-slate-500">Based on your eligibility profile</p>
                            </div>
                            <h1 className="md:hidden text-sm font-bold text-slate-900 truncate">Select Colleges</h1>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={clsx(
                                    "px-2 sm:px-2.5 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-semibold flex items-center gap-1 transition-all border",
                                    showFilters || activeFilterCount > 0
                                        ? "bg-blue-50 text-blue-700 border-blue-200"
                                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                )}
                            >
                                <SlidersHorizontal size={12} />
                                <span className="hidden sm:inline">Filters</span>
                                {activeFilterCount > 0 && (
                                    <span className="w-4 h-4 bg-blue-600 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>
                            <div className="bg-blue-100 text-blue-700 px-2 sm:px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold whitespace-nowrap">
                                {selectedColleges.length} Selected
                            </div>
                        </div>
                    </div>

                    {/* Search row — full width on mobile */}
                    <div className="flex bg-slate-100 rounded-full px-3 py-1.5 w-full sm:max-w-sm">
                        <Search size={15} className="text-slate-400 mr-2 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Search colleges, courses, cities..."
                            className="bg-transparent text-xs outline-none w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="border-t border-slate-100 bg-white px-3 sm:px-4 py-3 sm:py-4 animate-in slide-in-from-top duration-200">
                        <div className="max-w-7xl mx-auto space-y-3 sm:space-y-4">
                            {/* Row 1: College Type */}
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                <div className="flex items-center gap-1.5 mr-1">
                                    <Building2 size={13} className="text-slate-500" />
                                    <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase">Type:</span>
                                </div>
                                {ALL_COLLEGE_TYPES.map(type => (
                                    <button
                                        key={type}
                                        onClick={() => toggleArrayFilter('collegeType', type)}
                                        className={clsx(
                                            "px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-medium transition-all border",
                                            filters.collegeType.includes(type)
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                        )}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>

                            {/* Row 1b: Toggle filters */}
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                <button
                                    onClick={() => setFilters(f => ({ ...f, nirfOnly: !f.nirfOnly }))}
                                    className={clsx(
                                        "px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-medium transition-all border flex items-center gap-1",
                                        filters.nirfOnly
                                            ? "bg-amber-500 text-white border-amber-500"
                                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                    )}
                                >
                                    <Award size={11} /> NIRF Ranked
                                </button>

                                <button
                                    onClick={() => setFilters(f => ({ ...f, hasHostel: !f.hasHostel }))}
                                    className={clsx(
                                        "px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-medium transition-all border flex items-center gap-1",
                                        filters.hasHostel
                                            ? "bg-emerald-500 text-white border-emerald-500"
                                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                    )}
                                >
                                    <Home size={11} /> Has Hostel
                                </button>
                            </div>

                            {/* Row 2: Placement % slider */}
                            <div className="flex items-center gap-2 sm:gap-3">
                                <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Min Placement %:</span>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="5"
                                    value={filters.minPlacement}
                                    onChange={(e) => setFilters(f => ({ ...f, minPlacement: Number(e.target.value) }))}
                                    className="flex-1 max-w-[140px] accent-blue-600"
                                />
                                <span className="text-[10px] sm:text-xs font-bold text-slate-700 min-w-[36px]">
                                    {filters.minPlacement > 0 ? `${filters.minPlacement}%+` : 'Any'}
                                </span>
                            </div>

                            {/* Row 3: Courses */}
                            <div className="flex items-start gap-1.5 sm:gap-2 flex-wrap">
                                <div className="flex items-center gap-1.5 mr-0.5">
                                    <GraduationCap size={13} className="text-slate-500" />
                                    <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase">Courses:</span>
                                </div>
                                {ALL_COURSES.slice(0, 8).map(course => (
                                    <button
                                        key={course}
                                        onClick={() => toggleArrayFilter('courses', course)}
                                        className={clsx(
                                            "px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-medium transition-all border",
                                            filters.courses.includes(course)
                                                ? "bg-indigo-600 text-white border-indigo-600"
                                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                        )}
                                    >
                                        {course}
                                    </button>
                                ))}
                            </div>

                            {/* Clear */}
                            {activeFilterCount > 0 && (
                                <button
                                    onClick={clearFilters}
                                    className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
                                >
                                    <X size={12} /> Clear all filters
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </header>

            <main className="max-w-7xl mx-auto px-4 py-4 space-y-6">
                {filteredData.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-slate-500 text-sm">No colleges match your filters.</p>
                        <button onClick={clearFilters} className="mt-3 text-blue-600 font-medium text-sm hover:underline">
                            Clear filters
                        </button>
                    </div>
                ) : (
                    Object.entries(categories).map(([title, colleges]) => (
                        colleges.length > 0 && (
                            <section key={title}>
                                <HorizontalList
                                    title={title}
                                    colleges={colleges}
                                    selectedColleges={selectedColleges}
                                    onToggle={onToggleCollege}
                                />
                            </section>
                        )
                    ))
                )}
            </main>

            {/* Floating Action Bar */}
            {selectedColleges.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-3 sm:px-4 py-3 sm:py-3 pb-[env(safe-area-inset-bottom,12px)] shadow-2xl z-50 animate-in slide-in-from-bottom duration-300">
                    <div className="max-w-3xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
                        <div className="hidden md:block">
                            <p className="text-xs font-medium text-slate-500">Selected Colleges</p>
                            <p className="text-xl font-bold text-slate-900">{selectedColleges.length}</p>
                        </div>

                        {/* Mobile: show count inline */}
                        <div className="md:hidden flex-shrink-0">
                            <span className="text-sm font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">{selectedColleges.length}</span>
                        </div>

                        <div className="flex gap-2 sm:gap-2 flex-1 md:flex-none md:w-auto mb-3">
                            <button
                                onClick={onOpenSummary}
                                className="flex-1 md:flex-none px-4 sm:px-4 py-3 sm:py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl sm:rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                            >
                                <Info size={16} />
                                <span className="hidden sm:inline">Learn More</span>
                                <span className="sm:hidden">More</span>
                            </button>
                            <button
                                onClick={onOpenCheckout}
                                className="flex-1 md:flex-none px-4 sm:px-4 py-3 sm:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl sm:rounded-lg flex items-center justify-center gap-1.5 shadow-md shadow-blue-200 transition-all"
                            >
                                <ShoppingCart size={16} />
                                Apply Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiscoveryPage;
