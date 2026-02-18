import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
            <p className="mt-2 text-slate-600">Welcome to Naviksha Admin Panel.</p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Colleges</h3>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">Manage</p>
                    <div className="mt-4">
                        <Link to="/admin/colleges" className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All &rarr;</Link>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Bulk Import</h3>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">Upload</p>
                    <div className="mt-4">
                        <Link to="/admin/colleges" className="text-blue-600 hover:text-blue-800 text-sm font-medium">Go to Upload &rarr;</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Dashboard;
