import React, { useState } from 'react';
import { Sparkles, ShoppingCart, Info, Search } from 'lucide-react';
import HorizontalList from './HorizontalList';
import { COLLEGE_DATA } from '../../data/colleges';

const DiscoveryPage = ({ selectedColleges, onToggleCollege, onOpenSummary, onOpenCheckout }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = COLLEGE_DATA.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const categories = {
        'Recommended For You': filteredData.slice(0, 5), // Mock recommendation logic
        'New-Age Skill-First Institutes': filteredData.filter(c => c.category === 'New-Age'),
        'Elite Universities': filteredData.filter(c => c.category === 'Elite'),
        'Affordable Universities': filteredData.filter(c => c.category === 'Affordable'),
        'Online Bachelor\'s': filteredData.filter(c => c.category === 'Online'),
    };

    return (
        <div className="pb-32 bg-slate-50 min-h-screen">
            {/* Sticky Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Select Colleges</h1>
                        <p className="text-xs text-slate-500 hidden md:block">Based on your eligibility profile</p>
                    </div>

                    <div className="flex bg-slate-100 rounded-full px-4 py-2 w-full max-w-xs mx-4">
                        <Search size={18} className="text-slate-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search colleges..."
                            className="bg-transparent text-sm outline-none w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                            {selectedColleges.length} Selected
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
                {Object.entries(categories).map(([title, colleges]) => (
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
                ))}
            </main>

            {/* Floating Action Bar */}
            {selectedColleges.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-2xl z-50 animate-in slide-in-from-bottom duration-300">
                    <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
                        <div className="hidden md:block">
                            <p className="text-sm font-medium text-slate-500">Selected Colleges</p>
                            <p className="text-2xl font-bold text-slate-900">{selectedColleges.length}</p>
                        </div>

                        <div className="flex gap-3 w-full md:w-auto">
                            <button
                                onClick={onOpenSummary}
                                className="flex-1 md:flex-none px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
                            >
                                <Info size={20} />
                                Learn More
                            </button>
                            <button
                                onClick={onOpenCheckout}
                                className="flex-1 md:flex-none px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all"
                            >
                                <ShoppingCart size={20} />
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
