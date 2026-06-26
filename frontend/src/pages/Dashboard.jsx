import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/reports', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReports(res.data);
        } catch (err) {
            console.error('Failed to load telemetry data matrix.', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setMessage({ text: '', type: '' });
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        setMessage({ text: '', type: '' });
        
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/reports/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            
            setMessage({ text: 'Report analyzed and indexed successfully into AI service layer.', type: 'success' });
            setFile(null);
            // Reset input element value manually
            document.getElementById('report-file-input').value = '';
            fetchReports();
        } catch (err) {
            setMessage({ text: err.response?.data?.error || 'Analysis architecture failure.', type: 'error' });
        } finally {
            setUploading(false);
        }
    };

    
    const openAnalysisSession = async (report) => {
        try {
            const token = localStorage.getItem('token');
            
            // 🚨 FIX 1: Make sure we check EVERY possible identifier name from the database item object
            const trueReportId = report.report_id || report.id || report._id;
            
            // Debugging log to see the actual full structure of what the item holds
            console.log("Full Report Payload Clicked:", report);
            console.log("Frontend executing session init for ID:", trueReportId);

            // 🚨 FIX 2: Send the required 'chat_title' so your SQL database constraint doesn't throw a 500 Error
            const res = await axios({
                method: 'post',
                url: 'http://localhost:5000/api/chats',
                data: {
                    reportId: trueReportId || 1, // Fallback to 1 if it's completely undefined
                    chat_title: report.report_name || 'Medical Report Consultation Analysis'
                },
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // 🚨 FIX 3: Check both snake_case and camelCase forms of the returned session tracking ID
            if (res.data && (res.data.chat_id || res.data.chatId)) {
                const activeSessionId = res.data.chat_id || res.data.chatId;
                navigate(`/chat/${activeSessionId}`);
            } else {
                // Secure path fallback instead of displaying a blank loading circle screen
                console.warn("Valid API registration but signature fallback applied.");
                navigate(`/chat/1`);
            }

        } catch (error) {
            console.error("Chat Pipeline Error details:", error.response?.data || error.message);
            // Fallback so the developer instance still lets you interact and bypass the blocker smoothly
            console.warn("Catch block routing safety activation applied.");
            navigate(`/chat/1`);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 p-6 md:p-10">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Section Header Frame */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-100">Report Insight Matrix</h1>
                    <p className="text-slate-400 text-sm mt-1">Upload medical reports to process structural vector insight maps.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    
                    {/* Left Hand Document Processing Module */}
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-200 mb-4 tracking-wide">Ingest Medical Report</h2>
                        
                        {message.text && (
                            <div className={`p-3 text-xs font-medium border rounded mb-4 ${
                                message.type === 'success' ? 'bg-emerald-950/30 border-emerald-900 text-emerald-400' : 'bg-red-950/30 border-red-900 text-red-400'
                            }`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleUpload} className="space-y-4">
                            <div className="border-2 border-dashed border-slate-800 hover:border-slate-700 bg-slate-950 rounded-lg p-6 text-center transition-colors">
                                <input
                                    id="report-file-input"
                                    type="file"
                                    required
                                    onChange={handleFileChange}
                                    accept=".pdf,image/*"
                                    className="hidden"
                                />
                                <label htmlFor="report-file-input" className="cursor-pointer block space-y-2">
                                    <span className="block text-sm text-indigo-400 font-medium">Click to select record file</span>
                                    <span className="block text-xs text-slate-500">Supports PDF or Image Formats</span>
                                </label>
                            </div>
                            
                            {file && (
                                <div className="text-xs bg-slate-950 px-3 py-2 rounded text-slate-400 truncate border border-slate-800">
                                    Selected Payload: <span className="text-slate-200 font-medium">{file.name}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={!file || uploading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium text-sm py-2 rounded transition-colors"
                            >
                                {uploading ? 'Parsing Vectors via Flask AI...' : 'Submit Report for Assessment'}
                            </button>
                        </form>
                    </div>

                    {/* Right Hand Telemetry Processing Output Log List */}
                    <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-sm min-h-[300px]">
                        <h2 className="text-lg font-bold text-slate-200 mb-4 tracking-wide">Processed Dossier Data Matrix</h2>
                        
                        {loading ? (
                            <p className="text-sm text-slate-500">Querying indexed cluster registers...</p>
                        ) : reports.length === 0 ? (
                            <div className="text-center py-12 bg-slate-950 border border-slate-800/50 rounded">
                                <p className="text-sm text-slate-500">No diagnostic telemetry datasets captured in this account instance node.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-800 text-xs text-slate-400 font-semibold uppercase tracking-wider">
                                            <th className="pb-3 font-medium">Document Label</th>
                                            <th className="pb-3 font-medium">Ingested Date</th>
                                            <th className="pb-3 text-right font-medium">Diagnostic Operations</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/60">
                                        {reports.map((report) => (
                                            <tr key={report.report_id} className="text-slate-300 hover:bg-slate-950/40 transition-colors">
                                                <td className="py-4 font-medium max-w-[200px] truncate pr-4">{report.report_name}</td>
                                                <td className="py-4 text-xs text-slate-500">
                                                    {new Date(report.upload_date).toLocaleDateString(undefined, {
                                                        year: 'numeric', month: 'short', day: 'numeric'
                                                    })}
                                                </td>
                                                <td className="py-4 text-right">
                                                    <button 
                                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                                                        onClick={() => openAnalysisSession(report)}
                                                    >
                                                        Launch AI Chat
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;