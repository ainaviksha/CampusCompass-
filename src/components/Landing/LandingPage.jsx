import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle, Sparkles, GraduationCap, TrendingUp, Shield, Zap, Users, ChevronDown, BarChart3, Globe, Star, Award, BookOpen } from 'lucide-react';

/* ────────────────────── DATA ────────────────────── */

const STATS = [
    { label: 'Colleges', value: '120+', icon: GraduationCap },
    { label: 'Departments', value: '12+', icon: BarChart3 },
    { label: 'Application', value: '1', icon: Zap },
    { label: 'Students', value: '20,000+', icon: Users },
];

const TRUST_LOGOS = [
    'Scaler', 'Newton', 'Plaksha', 'Ashoka', 'BITS Pilani',
    'IIT Madras', 'RV University', 'UPES', 'Bennett', 'Amrita',
    'IIT Jodhpur', 'FLAME', 'BML Munjal',
];

const FEATURES = [
    {
        icon: Zap,
        title: 'One Form, 120+ Colleges',
        desc: 'Stop filling repetitive applications. Submit once, apply everywhere with a single secure form.',
        color: 'from-blue-500 to-cyan-400',
        bg: 'bg-blue-50',
        img: '/assets/feature-compare.png',
        imgFit: 'contain',
    },
    {
        icon: Sparkles,
        title: 'AI-Powered Matching',
        desc: 'Get college recommendations tailored to your JEE percentile, preferences, and career goals.',
        color: 'from-violet-500 to-purple-400',
        bg: 'bg-violet-50',
        img: '/assets/feature-ai.png',
        imgFit: 'contain',
    },
    {
        icon: BarChart3,
        title: 'Deep ROI Insights',
        desc: 'Compare fees vs placements with 30+ data points per college. Make data-driven decisions.',
        color: 'from-emerald-500 to-teal-400',
        bg: 'bg-emerald-50',
    },
    {
        icon: Shield,
        title: 'Verified & Secure',
        desc: 'OTP-verified submissions, encrypted data, and trusted by thousands of students across India.',
        color: 'from-amber-500 to-orange-400',
        bg: 'bg-amber-50',
    },
];

const TESTIMONIALS = [
    { name: 'Arjun S.', college: 'IIT Madras', text: 'Applied to 8 colleges in under 5 minutes. Naviksha AI saved me weeks of form-filling.', rating: 5 },
    { name: 'Priya M.', college: 'BITS Pilani', text: 'The ROI comparison helped me pick BITS over a private college. Best decision of my life.', rating: 5 },
    { name: 'Rohit K.', college: 'Scaler SST', text: 'AI recommendations suggested Scaler — wasn\'t even on my radar. Now placed at Google!', rating: 5 },
];

const HOW_IT_WORKS = [
    { step: '01', title: 'Fill Your Profile', desc: 'Enter JEE percentile, exam scores, and preferences. Takes under 2 minutes.', icon: BookOpen },
    { step: '02', title: 'Explore & Compare', desc: 'Browse curated colleges in a Netflix-style interface. Compare ROI, placements, campus life.', icon: Globe },
    { step: '03', title: 'Apply in One Click', desc: 'Submit applications to all selected colleges with a single secure payment.', icon: Award },
];

/* ────────────────────── COMPASS LOGO SVG ────────────────────── */

const CompassLogo = ({ size = 36 }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="logoBg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>
        </defs>
        <rect width="64" height="64" rx="14" fill="url(#logoBg)" />
        <g opacity="0.35" stroke="#fff" strokeWidth="1.5" fill="none" transform="translate(32,34)">
            <polygon points="0,-18 5,-5 0,-8 -5,-5" />
            <polygon points="0,18 5,5 0,8 -5,5" />
            <polygon points="-18,0 -5,-5 -8,0 -5,5" />
            <polygon points="18,0 5,-5 8,0 5,5" />
        </g>
        <g transform="translate(32,34) rotate(-45)">
            <polygon points="0,-16 3,0 0,2 -3,0" fill="#fff" />
            <polygon points="0,16 3,0 0,-2 -3,0" fill="rgba(255,255,255,0.5)" />
            <circle cx="0" cy="0" r="2.5" fill="#fff" />
            <circle cx="0" cy="0" r="1" fill="#4F46E5" />
        </g>
        <g transform="translate(32,12)">
            <polygon points="0,-4 12,2 0,8 -12,2" fill="#fff" />
            <rect x="-1" y="2" width="2" height="6" fill="#fff" rx="0.5" />
            <line x1="10" y1="3" x2="10" y2="10" stroke="#fff" strokeWidth="1.5" />
            <circle cx="10" cy="11" r="1.5" fill="#fff" />
        </g>
    </svg>
);

/* ────────────────────── SCROLL ANIMATION HOOK ────────────────────── */

const useInView = (threshold = 0.15) => {
    const ref = useRef(null);
    const [isInView, setIsInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setIsInView(true); observer.unobserve(el); }
        }, { threshold });
        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);
    return [ref, isInView];
};

/* ────────────────────── COMPONENT ────────────────────── */

const LandingPage = ({ onGetStarted }) => {
    const [scrollY, setScrollY] = useState(0);
    const [count, setCount] = useState(0);
    const [featRef, featInView] = useInView(0.1);
    const [howRef, howInView] = useInView(0.1);
    const [testRef, testInView] = useInView(0.1);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Animated counter
    useEffect(() => {
        const target = 120;
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(current));
        }, 16);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">

            {/* ──── NAVBAR ──── */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrollY > 50 ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-slate-100/50 border-b border-slate-100' : 'bg-transparent'}`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="Naviksha AI" className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg" />
                        <span className="font-extrabold text-base sm:text-lg tracking-tight">Naviksha AI</span>
                    </div>
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
                        <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
                        <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a>
                        <a href="#testimonials" className="hover:text-slate-900 transition-colors">Testimonials</a>
                    </div>
                    <button
                        onClick={onGetStarted}
                        className="px-3.5 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold rounded-full transition-all shadow-md shadow-blue-200/50 hover:shadow-lg hover:shadow-blue-300/50 active:scale-[0.97] flex items-center gap-1.5"
                    >
                        Get Started <ArrowRight size={14} />
                    </button>
                </div>
            </nav>

            {/* ──── HERO SECTION ──── */}
            <section className="relative pt-24 pb-12 md:pt-40 md:pb-24 px-4 sm:px-6">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden -z-10">
                    <div className="absolute top-16 left-[10%] w-[500px] h-[500px] bg-gradient-to-br from-blue-100/80 to-indigo-100/60 rounded-full blur-3xl" style={{ transform: `translateY(${scrollY * 0.08}px)` }}></div>
                    <div className="absolute top-32 right-[10%] w-[400px] h-[400px] bg-gradient-to-br from-violet-100/60 to-purple-100/40 rounded-full blur-3xl" style={{ transform: `translateY(${scrollY * 0.12}px)` }}></div>
                    <div className="absolute bottom-0 left-[40%] w-[300px] h-[300px] bg-gradient-to-br from-cyan-50/50 to-blue-50/30 rounded-full blur-3xl"></div>
                    {/* Grid pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.02)_1px,transparent_1px)] bg-[size:48px_48px]"></div>
                </div>

                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Left: Copy */}
                        <div className="text-center md:text-left">
                            {/* Badge */}
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 mb-6 sm:mb-8 animate-[fadeInDown_0.6s_ease]">
                                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 text-blue-700 px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    Admissions 2025-26 Open
                                </div>
                                <div className="inline-flex items-center gap-1.5 bg-slate-900/5 border border-slate-200/60 text-slate-500 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-medium">
                                    <Sparkles size={11} className="text-indigo-500" />
                                    Powered by Naviksha AI
                                </div>
                            </div>

                            {/* Main headline */}
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight mb-4 sm:mb-6 animate-[fadeInUp_0.8s_ease]">
                                One Form,
                                <br />
                                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                                    {count}+ Colleges
                                </span>
                            </h1>

                            {/* Subheadline */}
                            <p className="text-sm sm:text-base md:text-lg text-slate-500 max-w-lg mx-auto md:mx-0 mb-6 sm:mb-8 leading-relaxed animate-[fadeInUp_1s_ease]">
                                Stop filling repetitive applications. Submit once, apply everywhere — colleges curated to match <strong className="text-slate-700">your marks, preferences & achievements</strong>.
                            </p>

                            {/* CTA Group */}
                            <div className="flex flex-col sm:flex-row items-center md:items-start gap-3 sm:gap-4 mb-8 sm:mb-10 animate-[fadeInUp_1.2s_ease]">
                                <button
                                    onClick={onGetStarted}
                                    className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-200/60 transition-all active:scale-[0.97] flex items-center justify-center gap-2 text-base sm:text-lg hover:shadow-2xl hover:shadow-blue-300/50"
                                >
                                    Start Your Application
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <span className="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5">
                                    <CheckCircle size={14} className="text-green-500" />
                                    2 min • No login required
                                </span>
                            </div>

                            {/* Stats Row */}
                            <div className="grid grid-cols-4 gap-3 sm:gap-6 md:gap-8 animate-[fadeInUp_1.4s_ease]">
                                {STATS.map((stat) => (
                                    <div key={stat.label} className="text-center md:text-left">
                                        <p className="text-lg sm:text-2xl md:text-3xl font-black text-slate-900">{stat.value}</p>
                                        <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Animated Hero Visual */}
                        <div className="hidden md:block animate-[fadeInUp_1s_ease]">
                            <div className="relative w-full max-w-md lg:max-w-lg mx-auto aspect-square">
                                {/* Glowing background */}
                                <div className="absolute inset-8 bg-gradient-to-br from-blue-200/40 to-indigo-200/30 rounded-full blur-3xl"></div>

                                {/* Central compass icon */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10" style={{ animation: 'float 5s ease-in-out infinite' }}>
                                    <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-2xl shadow-blue-300/50 flex items-center justify-center">
                                        <GraduationCap size={48} className="text-white lg:hidden" />
                                        <GraduationCap size={56} className="text-white hidden lg:block" />
                                    </div>
                                </div>

                                {/* Floating card: College Stats */}
                                <div className="absolute top-4 right-4 lg:top-6 lg:right-6 bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-3 lg:p-4 w-36 lg:w-44 z-20" style={{ animation: 'floatCard1 6s ease-in-out infinite' }}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                                            <TrendingUp size={14} className="text-emerald-600" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-700">Placements</span>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-[10px] text-slate-400"><span>Google</span><span className="font-bold text-emerald-600">₹45L</span></div>
                                        <div className="h-1.5 bg-emerald-100 rounded-full overflow-hidden"><div className="h-full w-[85%] bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"></div></div>
                                        <div className="flex justify-between text-[10px] text-slate-400"><span>Microsoft</span><span className="font-bold text-blue-600">₹40L</span></div>
                                        <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden"><div className="h-full w-[75%] bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"></div></div>
                                    </div>
                                </div>

                                {/* Floating card: ROI Score */}
                                <div className="absolute bottom-6 right-6 lg:bottom-10 lg:right-10 bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-3 z-20" style={{ animation: 'floatCard2 7s ease-in-out infinite' }}>
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                                            <Award size={18} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-medium">NIRF Rank</p>
                                            <p className="text-lg font-black text-amber-600">#3</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating card: Avg Package */}
                                <div className="absolute top-6 left-0 lg:top-8 lg:left-0 bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-3 z-20" style={{ animation: 'floatCard3 5.5s ease-in-out infinite' }}>
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                                            <BarChart3 size={18} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-medium">Avg Package</p>
                                            <p className="text-lg font-black text-blue-600">₹21L</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating card: College Compare */}
                                <div className="absolute bottom-4 left-2 lg:bottom-6 lg:left-4 bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-3 w-40 lg:w-48 z-20" style={{ animation: 'floatCard4 6.5s ease-in-out infinite' }}>
                                    <p className="text-[10px] font-bold text-slate-500 mb-2 flex items-center gap-1"><Sparkles size={10} className="text-violet-500" /> AI Comparison</p>
                                    <div className="flex gap-1.5">
                                        <div className="flex-1 bg-blue-50 rounded-lg p-1.5 text-center">
                                            <p className="text-[9px] text-slate-400">IIT-M</p>
                                            <p className="text-xs font-black text-blue-600">9.2</p>
                                        </div>
                                        <div className="flex-1 bg-indigo-50 rounded-lg p-1.5 text-center">
                                            <p className="text-[9px] text-slate-400">BITS</p>
                                            <p className="text-xs font-black text-indigo-600">8.8</p>
                                        </div>
                                        <div className="flex-1 bg-violet-50 rounded-lg p-1.5 text-center">
                                            <p className="text-[9px] text-slate-400">NIT-T</p>
                                            <p className="text-xs font-black text-violet-600">8.5</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Orbiting dots */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 lg:w-64 lg:h-64 rounded-full border border-dashed border-blue-200/50" style={{ animation: 'spin 30s linear infinite' }}>
                                    <div className="absolute -top-1.5 left-1/2 w-3 h-3 bg-blue-400 rounded-full shadow-lg shadow-blue-300"></div>
                                    <div className="absolute -bottom-1.5 left-1/2 w-3 h-3 bg-indigo-400 rounded-full shadow-lg shadow-indigo-300"></div>
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 lg:w-96 lg:h-96 rounded-full border border-dashed border-indigo-100/40" style={{ animation: 'spin 45s linear infinite reverse' }}>
                                    <div className="absolute top-0 left-1/2 w-2 h-2 bg-violet-400 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce text-slate-300">
                    <ChevronDown size={24} />
                </div>
            </section>

            {/* ──── TRUST BAR ──── */}
            <section className="border-y border-slate-100 bg-gradient-to-b from-slate-50/80 to-white py-5 sm:py-8 overflow-hidden">
                <p className="text-center text-[10px] text-slate-400 uppercase tracking-[0.2em] font-semibold mb-4 sm:mb-6">Trusted by students applying to</p>
                <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10"></div>
                    <div className="flex gap-6 animate-[scroll_40s_linear_infinite]">
                        {[...TRUST_LOGOS, ...TRUST_LOGOS].map((name, i) => (
                            <div key={i} className="flex-shrink-0 px-5 py-2 bg-white rounded-lg border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
                                <span className="text-sm font-bold text-slate-400 whitespace-nowrap hover:text-slate-600 transition-colors">{name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ──── FEATURES GRID ──── */}
            <section id="features" className="py-12 sm:py-20 md:py-28 px-4 sm:px-6" ref={featRef}>
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-6 sm:mb-10 md:mb-16">
                        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold mb-4">
                            <Sparkles size={12} /> Features
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight mb-3 sm:mb-4">Master Engineering Application Form</h2>
                        <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-lg">We remove the friction from college applications so you can focus on choosing the right future.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                        {FEATURES.map((feature, i) => (
                            <div
                                key={i}
                                className="group relative p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 bg-white hover:border-slate-200 transition-all duration-500 overflow-hidden"
                                style={{
                                    opacity: featInView ? 1 : 0,
                                    transform: featInView ? 'translateY(0)' : 'translateY(40px)',
                                    transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s`
                                }}
                            >
                                {/* Gradient glow on hover */}
                                <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-full blur-3xl transition-opacity duration-500 -translate-y-10 translate-x-10`}></div>

                                <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 sm:mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon size={18} className="text-white sm:hidden" />
                                    <feature.icon size={24} className="text-white hidden sm:block" />
                                </div>
                                <h3 className="font-bold text-base sm:text-xl mb-2 sm:mb-3 text-slate-800 group-hover:text-slate-900 transition-colors">{feature.title}</h3>
                                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{feature.desc}</p>

                                {/* Feature image for cards that have one */}
                                {feature.img && (
                                    <div className="mt-3 sm:mt-5 -mx-1 sm:-mx-2">
                                        <img src={feature.img} alt={feature.title} className={`w-full h-28 sm:h-40 ${feature.imgFit === 'contain' ? 'object-contain' : 'object-cover'} object-center rounded-lg sm:rounded-xl opacity-80 group-hover:opacity-100 transition-opacity`} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ──── HOW IT WORKS ──── */}
            <section id="how-it-works" className="py-12 sm:py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white px-4 sm:px-6" ref={howRef}>
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-6 sm:mb-10 md:mb-16">
                        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-semibold mb-4">
                            <Zap size={12} /> Simple Process
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight mb-3 sm:mb-4">3 Steps to Your Dream College</h2>
                        <p className="text-slate-500 max-w-lg mx-auto text-sm sm:text-lg">No accounts, no hassle. Just fill, select, and apply.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 relative">
                        {/* Connecting line */}
                        <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-violet-200"></div>

                        {HOW_IT_WORKS.map((item, i) => (
                            <div
                                key={item.step}
                                className="relative text-center"
                                style={{
                                    opacity: howInView ? 1 : 0,
                                    transform: howInView ? 'translateY(0)' : 'translateY(30px)',
                                    transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.15}s`
                                }}
                            >
                                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-3 sm:mb-5 shadow-lg shadow-blue-200/50 relative z-10">
                                    <item.icon size={20} className="text-white sm:hidden" />
                                    <item.icon size={24} className="text-white hidden sm:block" />
                                </div>
                                <div className="text-3xl sm:text-5xl font-black bg-gradient-to-b from-slate-200 to-slate-100 bg-clip-text text-transparent mb-2 sm:mb-3">{item.step}</div>
                                <h3 className="font-bold text-base sm:text-lg mb-1.5 sm:mb-2 text-slate-800">{item.title}</h3>
                                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ──── TESTIMONIALS ──── */}
            <section id="testimonials" className="py-12 sm:py-20 md:py-28 px-4 sm:px-6" ref={testRef}>
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-6 sm:mb-10 md:mb-16">
                        <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-semibold mb-4">
                            <Star size={12} /> Testimonials
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight mb-3 sm:mb-4">Students Love Naviksha AI</h2>
                        <p className="text-slate-500 max-w-lg mx-auto text-sm sm:text-lg">Here's what students who used the platform have to say.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
                        {TESTIMONIALS.map((t, i) => (
                            <div
                                key={i}
                                className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white to-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-100/50 transition-all duration-300"
                                style={{
                                    opacity: testInView ? 1 : 0,
                                    transform: testInView ? 'translateY(0)' : 'translateY(30px)',
                                    transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s`
                                }}
                            >
                                <div className="flex gap-0.5 mb-3 sm:mb-4">
                                    {Array.from({ length: t.rating }).map((_, j) => (
                                        <Star key={j} size={13} className="text-amber-400 fill-amber-400" />
                                    ))}
                                </div>
                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 sm:mb-5 italic">"{t.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                                        {t.name.split(' ').map(w => w[0]).join('')}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-slate-800">{t.name}</p>
                                        <p className="text-xs text-slate-400">{t.college}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ──── DATA HIGHLIGHT ──── */}
            <section className="py-10 sm:py-16 px-4 sm:px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                <div className="max-w-5xl mx-auto relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center text-white">
                        {[
                            { val: '25+', label: 'NIRF Ranked Colleges' },
                            { val: '30+', label: 'Data Points Per College' },
                            { val: '98%', label: 'Avg Placement Rate' },
                            { val: '₹21L', label: 'Avg Package' },
                        ].map((d, i) => (
                            <div key={i}>
                                <p className="text-2xl sm:text-3xl md:text-4xl font-black mb-1">{d.val}</p>
                                <p className="text-xs sm:text-sm text-white/70 font-medium">{d.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ──── FINAL CTA ──── */}
            <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 relative">
                <div className="absolute inset-0 overflow-hidden -z-10">
                    <div className="absolute bottom-0 left-[30%] w-[400px] h-[400px] bg-gradient-to-br from-blue-50/60 to-indigo-50/40 rounded-full blur-3xl"></div>
                </div>
                <div className="max-w-3xl mx-auto text-center">
                    <img src="/logo.png" alt="Naviksha AI" className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl mx-auto" />
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight mt-4 sm:mt-6 mb-3 sm:mb-4">Ready to find your campus?</h2>
                    <p className="text-sm sm:text-lg text-slate-500 mb-6 sm:mb-8 max-w-md mx-auto">Join thousands of students who simplified their admission journey with data-driven decisions.</p>
                    <button
                        onClick={onGetStarted}
                        className="group px-6 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-200/50 transition-all active:scale-[0.97] flex items-center justify-center gap-2 mx-auto text-base sm:text-lg hover:shadow-2xl"
                    >
                        Start Now
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="mt-3 sm:mt-4 text-[11px] sm:text-xs text-slate-400 flex items-center justify-center gap-1.5">
                        <CheckCircle size={12} className="text-green-500" />
                        No login required • Takes 2 minutes
                    </p>
                </div>
            </section>

            {/* ──── FOOTER ──── */}
            <footer className="border-t border-slate-100 bg-slate-50 py-6 sm:py-10 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2.5">
                            <img src="/logo.png" alt="Naviksha AI" className="w-7 h-7 rounded-lg" />
                            <span className="font-extrabold text-sm tracking-tight">Naviksha AI</span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-slate-400">
                            <a href="#features" className="hover:text-slate-600 transition-colors">Features</a>
                            <a href="#how-it-works" className="hover:text-slate-600 transition-colors">How It Works</a>
                            <a href="#testimonials" className="hover:text-slate-600 transition-colors">Testimonials</a>
                        </div>
                        <p className="text-xs text-slate-400">© 2026 Naviksha AI · All rights reserved</p>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default LandingPage;
