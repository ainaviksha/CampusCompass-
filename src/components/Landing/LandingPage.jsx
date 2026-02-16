import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, Sparkles, GraduationCap, TrendingUp, Shield, Zap, Users, ChevronDown } from 'lucide-react';

const STATS = [
    { label: 'Partner Colleges', value: '120+', icon: GraduationCap },
    { label: 'Students Placed', value: '50K+', icon: Users },
    { label: 'Avg ROI', value: '220%', icon: TrendingUp },
];

const TRUST_LOGOS = [
    'Scaler', 'Newton', 'Plaksha', 'Ashoka', 'BITS',
    'IIT Madras', 'RV University', 'UPES', 'Bennett', 'Amrita',
];

const FEATURES = [
    { icon: Zap, title: 'One Form, 120+ Colleges', desc: 'Stop filling repetitive applications. Submit once, apply everywhere.' },
    { icon: Sparkles, title: 'AI-Powered Matches', desc: 'Get college recommendations tailored to your JEE percentile and profile.' },
    { icon: TrendingUp, title: 'ROI Insights', desc: 'Compare fees vs placements. Make data-driven decisions, not emotional ones.' },
    { icon: Shield, title: 'Verified & Secure', desc: 'OTP-verified submissions. Your data stays encrypted and private.' },
];

const LandingPage = ({ onGetStarted }) => {
    const [scrollY, setScrollY] = useState(0);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Animated counter for hero stat
    useEffect(() => {
        const target = 120;
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, 16);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">

            {/* ──── NAVBAR ──── */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-white/90 backdrop-blur-lg shadow-sm border-b border-slate-100' : 'bg-transparent'}`}>
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                            <GraduationCap size={18} className="text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">CampusCompass</span>
                    </div>
                    <button
                        onClick={onGetStarted}
                        className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-full transition-all shadow-sm hover:shadow-md"
                    >
                        Get Started <ArrowRight size={14} />
                    </button>
                </div>
            </nav>

            {/* ──── HERO SECTION ──── */}
            <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 px-6">
                {/* Background gradient orbs */}
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40 -z-10" style={{ transform: `translateY(${scrollY * 0.1}px)` }}></div>
                <div className="absolute top-40 right-1/4 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-30 -z-10" style={{ transform: `translateY(${scrollY * 0.15}px)` }}></div>

                <div className="max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 animate-[fadeInDown_0.6s_ease]">
                        <Sparkles size={14} className="text-blue-500" />
                        Admissions 2025-26 Open
                    </div>

                    {/* Main headline */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-6 animate-[fadeInUp_0.8s_ease]">
                        One Application.
                        <br />
                        <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                            {count}+ Colleges.
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-[fadeInUp_1s_ease]">
                        Stop filling endless forms. <strong className="text-slate-700">CampusCompass</strong> matches your JEE percentile to the best engineering colleges — and lets you apply to all of them in one click.
                    </p>

                    {/* CTA Group */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-[fadeInUp_1.2s_ease]">
                        <button
                            onClick={onGetStarted}
                            className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-lg"
                        >
                            Start Your Application
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <span className="text-sm text-slate-400 flex items-center gap-1.5">
                            <CheckCircle size={14} className="text-green-500" />
                            Free • 2 minutes • No login required
                        </span>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center justify-center gap-8 md:gap-16 animate-[fadeInUp_1.4s_ease]">
                        {STATS.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <p className="text-2xl md:text-3xl font-black text-slate-900">{stat.value}</p>
                                <p className="text-xs md:text-sm text-slate-400 font-medium mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-slate-300">
                    <ChevronDown size={24} />
                </div>
            </section>

            {/* ──── TRUST BAR ──── */}
            <section className="border-y border-slate-100 bg-slate-50/50 py-8 overflow-hidden">
                <p className="text-center text-xs text-slate-400 uppercase tracking-widest font-semibold mb-6">Trusted by students applying to</p>
                <div className="relative">
                    <div className="flex gap-8 animate-[scroll_30s_linear_infinite]">
                        {[...TRUST_LOGOS, ...TRUST_LOGOS].map((name, i) => (
                            <div key={i} className="flex-shrink-0 px-6 py-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                                <span className="text-sm font-semibold text-slate-500 whitespace-nowrap">{name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ──── FEATURES GRID ──── */}
            <section className="py-20 md:py-28 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">Why CampusCompass?</h2>
                        <p className="text-slate-500 max-w-xl mx-auto">We remove the friction from college applications so you can focus on what matters — choosing the right future.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {FEATURES.map((feature, i) => (
                            <div
                                key={i}
                                className="group p-6 rounded-2xl border border-slate-100 bg-white hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center mb-4 group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors">
                                    <feature.icon size={22} className="text-blue-600" />
                                </div>
                                <h3 className="font-bold text-lg mb-2 text-slate-800">{feature.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ──── HOW IT WORKS ──── */}
            <section className="py-20 bg-slate-50 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">3 Steps to Your Dream College</h2>
                    <p className="text-slate-500 mb-16 max-w-lg mx-auto">No accounts, no hassle. Just fill, select, and apply.</p>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: '01', title: 'Fill Your Profile', desc: 'Enter your JEE percentile, exam scores, and basic details. Takes under 2 minutes.' },
                            { step: '02', title: 'Explore & Select', desc: 'Browse curated colleges in a Netflix-style interface. Compare ROI, fees, and placements.' },
                            { step: '03', title: 'Apply in One Click', desc: 'Submit applications to all selected colleges with a single secure payment.' },
                        ].map((item) => (
                            <div key={item.step} className="relative">
                                <div className="text-6xl font-black text-slate-100 mb-4">{item.step}</div>
                                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ──── FINAL CTA ──── */}
            <section className="py-24 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">Ready to find your campus?</h2>
                    <p className="text-slate-500 mb-8">Join thousands of students who simplified their admission journey.</p>
                    <button
                        onClick={onGetStarted}
                        className="group px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 mx-auto text-lg"
                    >
                        Start Now — It's Free
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </section>

            {/* ──── FOOTER ──── */}
            <footer className="border-t border-slate-100 py-8 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                            <GraduationCap size={12} className="text-white" />
                        </div>
                        <span className="font-bold text-sm">CampusCompass</span>
                    </div>
                    <p className="text-xs text-slate-400">© 2026 CampusCompass by Naviksha. All rights reserved.</p>
                </div>
            </footer>

        </div>
    );
};

export default LandingPage;
