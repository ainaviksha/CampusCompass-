import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const CollegeEditModal = ({ college, onClose, onSave }) => {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (college) {
            // Clone and ensure arrays/objects are handled
            setFormData({ ...college });
        }
    }, [college]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleArrayChange = (e, field) => {
        const val = e.target.value.split(',').map(item => item.strip());
        setFormData(prev => ({ ...prev, [field]: val }));
    };

    // Helper for comma separated string input for arrays
    const handleStringArrayChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value.split(',').map(s => s.trim()) // Store as array
        }));
    };

    const getArrayString = (arr) => {
        return Array.isArray(arr) ? arr.join(', ') : '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Remove _id and mongo_id before sending
            const { _id, mongo_id, ...dataToSend } = formData;

            // Handle coordinates if nested? (User likely edits lat/lng via text inputs if implemented, or we flatten)

            const res = await api.put(`/colleges/${college.id}`, dataToSend);
            onSave(res.data);
            onClose();
        } catch (err) {
            console.error("Update failed", err);
            alert("Failed to update college");
        } finally {
            setLoading(false);
        }
    };

    if (!college) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center pt-10 pb-10 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b">
                    <h3 className="text-xl font-semibold text-gray-900">Edit College: {college.name}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500 text-2xl">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="md:col-span-2 space-y-4">
                        <h4 className="font-medium text-blue-600 border-b pb-2">Basic Info</h4>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input name="name" value={formData.name || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">ID (Slug)</label>
                        <input name="id" value={formData.id || ''} disabled className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm border p-2 cursor-not-allowed" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">City</label>
                        <input name="city" value={formData.city || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">State</label>
                        <input name="state" value={formData.state || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Type (Govt/Private)</label>
                        <input name="collegeType" value={formData.collegeType || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Estd Year</label>
                        <input name="year" type="number" value={formData.year || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                    </div>

                    {/* Stats */}
                    <div className="md:col-span-2 space-y-4 mt-4">
                        <h4 className="font-medium text-blue-600 border-b pb-2">Statistics & Fees</h4>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">NIRF Rank</label>
                        <input name="nirfRank" type="number" value={formData.nirfRank || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Avg Package</label>
                        <input name="avgPackage" value={formData.avgPackage || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Highest Package</label>
                        <input name="highestPackage" value={formData.highestPackage || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Fees (Total)</label>
                        <input name="fees" value={formData.fees || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                    </div>

                    {/* Arrays */}
                    <div className="md:col-span-2 space-y-4 mt-4">
                        <h4 className="font-medium text-blue-600 border-b pb-2">Lists (Comma Separated)</h4>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Courses</label>
                        <textarea name="courses" value={getArrayString(formData.courses)} onChange={handleStringArrayChange} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Top Recruiters</label>
                        <textarea name="topRecruiters" value={getArrayString(formData.topRecruiters)} onChange={handleStringArrayChange} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Entrance Exams</label>
                        <input name="entranceExams" value={getArrayString(formData.entranceExams)} onChange={handleStringArrayChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                    </div>

                    {/* Media */}
                    <div className="md:col-span-2 space-y-4 mt-4">
                        <h4 className="font-medium text-blue-600 border-b pb-2">Media & Links</h4>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Logo URL</label>
                        <input name="logo" value={formData.logo || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                        {formData.logo && <img src={formData.logo} alt="Preview" className="h-10 w-10 mt-2 object-contain" />}
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Website</label>
                        <input name="website" value={formData.website || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                    </div>

                </form>

                <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
                    <button onClick={onClose} className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100">Cancel</button>
                    <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CollegeEditModal;
