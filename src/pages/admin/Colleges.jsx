import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import CollegeEditModal from '../../components/Admin/CollegeEditModal';

const Colleges = () => {
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [editingCollege, setEditingCollege] = useState(null);

    const fetchColleges = async () => {
        try {
            const res = await api.get('/colleges?limit=100');
            setColleges(res.data);
        } catch (err) {
            console.error("Failed to fetch colleges", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchColleges();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this college?")) return;
        try {
            await api.delete(`/colleges/${id}`);
            setColleges(colleges.filter(c => c.id !== id));
        } catch {
            alert("Failed to delete");
        }
    };

    const handleEditClick = (college) => {
        setEditingCollege(college);
    };

    const handleSave = (updatedCollege) => {
        setColleges(colleges.map(c => c.id === updatedCollege.id ? updatedCollege : c));
        setEditingCollege(null);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        setMessage('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('/colleges/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage(`Upload success: ${res.data.inserted} inserted, ${res.data.updated} updated.`);
            fetchColleges();
            setFile(null);
        } catch (err) {
            setMessage('Upload failed.');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const handleExport = async () => {
        try {
            const response = await api.get('/colleges/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'colleges.csv');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            console.error("Export failed", err);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800">College Management</h1>
                <div className="space-x-4">
                    <button onClick={handleExport} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded text-slate-800 font-medium">
                        Export CSV
                    </button>
                    {/* Add College Button could go here */}
                </div>
            </div>

            {/* Upload Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8">
                <h2 className="text-lg font-semibold mb-4">Bulk Import</h2>
                <form onSubmit={handleUpload} className="flex items-end gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Select CSV/Excel File</label>
                        <input type="file" onChange={handleFileChange} accept=".csv, .xlsx, .xls" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    </div>
                    <button type="submit" disabled={!file || uploading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium disabled:opacity-50">
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </form>
                {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
            </div>

            {/* List Section */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[200px]">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[150px]">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[150px]">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[100px]">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[100px]">Year</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[120px]">Fees</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[120px]">Avg Package</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[120px]">High Package</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[100px]">Rank</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[100px]">Rating</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[120px]">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[120px]">Cutoff</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[100px]">Alumni</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[120px]">Autonomy</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[150px]">Website</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[120px]">Campus Area</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[100px]">Hostel</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[120px]">Scholarships</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[120px]">S/F Ratio</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[120px]">Gender Ratio</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider min-w-[150px] sticky right-0 bg-slate-50 shadow-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {loading ? (
                            <tr><td colSpan="4" className="text-center py-4">Loading...</td></tr>
                        ) : colleges.length === 0 ? (
                            <tr><td colSpan="4" className="text-center py-4">No colleges found.</td></tr>
                        ) : (
                            colleges.map((college) => (
                                <tr key={college.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {college.logo && <img className="h-8 w-8 rounded-full mr-3" src={college.logo} alt="" onError={(e) => e.target.style.display = 'none'} />}
                                            <div className="text-sm font-medium text-slate-900">{college.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {college.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {college.city}, {college.state}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {college.collegeType}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {college.year || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {college.fees || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {college.avgPackage || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {college.highestPackage || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {college.nirfRank || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {college.rating || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {college.category || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {college.cutoff || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {college.alumniCount || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {college.autonomy || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {college.website ? <a href={college.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Link</a> : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {college.campusArea || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {college.hostelAvailable ? 'Yes' : 'No'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {college.scholarships || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {college.studentFacultyRatio || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {college.genderRatio || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2 sticky right-0 bg-white shadow-sm">
                                        <button onClick={() => handleEditClick(college)} className="text-blue-600 hover:text-blue-900">Edit</button>
                                        <button onClick={() => handleDelete(college.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {
                editingCollege && (
                    <CollegeEditModal
                        college={editingCollege}
                        onClose={() => setEditingCollege(null)}
                        onSave={handleSave}
                    />
                )
            }
        </div >
    );
};

export default Colleges;
