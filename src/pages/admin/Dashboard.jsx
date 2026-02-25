import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, Loader2 } from 'lucide-react';
import api from '../../utils/api';

const Dashboard = () => {
    const [isOtpEnabled, setIsOtpEnabled] = useState(true);
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/settings/otp');
                setIsOtpEnabled(res.data.is_otp_enabled);
            } catch (err) {
                console.error("Failed to fetch OTP settings", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const toggleOtp = async () => {
        setToggling(true);
        try {
            await api.put('/settings/otp', { is_otp_enabled: !isOtpEnabled });
            setIsOtpEnabled(!isOtpEnabled);
        } catch (err) {
            console.error("Failed to update OTP settings", err);
            alert("Failed to update OTP settings. Check console.");
        } finally {
            setToggling(false);
        }
    };

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

                <div className="bg-slate-50 p-6 rounded-lg shadow-sm border border-slate-200 flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4 flex items-center justify-between">
                            System Settings
                        </h3>

                        {loading ? (
                            <div className="flex items-center gap-2 text-slate-400">
                                <Loader2 size={16} className="animate-spin" />
                            </div>
                        ) : (
                            <div className="flex items-center justify-between bg-white p-4 rounded-md border border-slate-200">
                                <div className="flex items-center gap-3">
                                    {isOtpEnabled ? (
                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                            <ShieldCheck size={20} />
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                            <ShieldAlert size={20} />
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-semibold text-slate-800 text-sm">Require OTP</p>
                                        <p className="text-xs text-slate-500">Security / Bypass</p>
                                    </div>
                                </div>
                                <button
                                    onClick={toggleOtp}
                                    disabled={toggling}
                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${isOtpEnabled ? 'bg-green-500' : 'bg-slate-300'} disabled:opacity-50`}
                                    role="switch"
                                    aria-checked={isOtpEnabled}
                                >
                                    <span
                                        aria-hidden="true"
                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isOtpEnabled ? 'translate-x-5' : 'translate-x-0'}`}
                                    />
                                </button>
                            </div>
                        )}
                    </div>
                    <p className="mt-4 text-xs text-slate-400 italic">
                        {isOtpEnabled ? "SMS cost is currently active." : "Bypassing protects against SMS Gateway downtime."}
                    </p>
                </div>
            </div>
        </div>
    );
};
export default Dashboard;
