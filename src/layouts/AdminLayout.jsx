import React from 'react';
import { Outlet, Navigate, useLocation, Link } from 'react-router-dom';

const AdminLayout = () => {
    const token = localStorage.getItem('token');
    const location = useLocation();

    // If on login page, render child (Login)
    if (location.pathname === '/admin/login') {
        // If already logged in, redirect to dashboard?
        if (token) return <Navigate to="/admin/dashboard" replace />;
        return <Outlet />;
    }

    // Require Auth for other admin pages
    if (!token) {
        return <Navigate to="/admin/login" replace state={{ from: location }} />;
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/admin/login';
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <aside className="w-64 bg-slate-900 text-white hidden md:block flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
                <div className="p-6">
                    <h1 className="text-xl font-bold tracking-tight text-white">Naviksha Admin</h1>
                </div>
                <nav className="mt-6 px-4 space-y-2">
                    <Link to="/admin/dashboard" className={`block py-2.5 px-4 rounded transition-colors ${location.pathname === '/admin/dashboard' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                        Dashboard
                    </Link>
                    <Link to="/admin/colleges" className={`block py-2.5 px-4 rounded transition-colors ${location.pathname.includes('/admin/colleges') ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                        Colleges
                    </Link>
                </nav>
                <div className="absolute bottom-0 w-64 p-4 border-t border-slate-800">
                    <button onClick={handleLogout} className="w-full text-left py-2 px-4 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors">
                        Logout
                    </button>
                </div>
            </aside>
            <div className="flex-1 min-w-0 flex flex-col">
                <header className="bg-white shadow px-8 py-4 flex justify-between items-center md:hidden">
                    <span className="font-bold text-lg">Naviksha Admin</span>
                    <button onClick={handleLogout} className="text-sm text-slate-600">Logout</button>
                </header>
                <main className="flex-1 p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
export default AdminLayout;
