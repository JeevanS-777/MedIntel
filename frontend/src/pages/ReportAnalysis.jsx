import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReportAnalysis = () => {
    const { reportId } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAnalysisOverview();
    }, [reportId]);

    const fetchAnalysisOverview = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/reports/${reportId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReport(res.data);
        } catch (err) {
            setError('Failed to securely fetch target analysis breakdown fields.');
        } finally {
            setLoading(false);
        }
    };

    const initiateChatFromOverview = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/chats', { reportId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate(`/chat/${res.data.chat_id}`);
        } catch (err) {
            alert('Failed to launch structural communication tunnel endpoints.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
                Parsing clinical parameter data metrics...
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                <div className="text-red-400 text-sm font-medium mb-2">{error || 'Target record not found.'}</div>
                <button onClick={() => navigate('/dashboard')} className="text-xs text-indigo-400 hover:underline">
                    Return to Operational Hub
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 p-6 md:p-10">
            <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Upper Breadcrumb Navigation Area */}
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="text-xs text-slate-400 hover:text-slate-200 font-semibold tracking-wider uppercase transition-colors"
                >
                    ← Back to Registry Hub
                </button>

                {/* Main Insight Meta Structural Wrapper Block */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 md:p-8 space-y-6 shadow-md">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                        <div>
                            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Document File Metadata</span>
                            <h1 className="text-xl font-bold text-slate-200 tracking-tight mt-0.5 truncate max-w-xl">{report.file_name}</h1>
                            <p className="text-xs text-slate-500 mt-1">
                                Ingested System Node Entry: {new Date(report.uploaded_at).toLocaleString()}
                            </p>
                        </div>
                        <button
                            onClick={initiateChatFromOverview}
                            className="w-full md:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded shadow-sm transition-colors duration-150"
                        >
                            Open Interactive AI Studio
                        </button>
                    </div>

                    {/* Extracted Core Analysis Breakdown Layout Container */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Automated Index Overview Summary</h3>
                        <div className="bg-slate-950 border border-slate-800/80 rounded p-4 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {report.extracted_text ? (
                                // Clean contextual truncation for general layout tracking
                                report.extracted_text.substring(0, 1000) + (report.extracted_text.length > 1000 ? '... [Truncated for general document overview block]' : '')
                            ) : (
                                <span className="text-slate-500 italic">No static pre-parsed summary payload exists. Launch interactive AI mode for automated custom deep prompts.</span>
                            )}
                        </div>
                    </div>

                    {/* Operational Telemetry Metrics Table Map */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-slate-800 pt-6 text-xs">
                        <div className="bg-slate-950/60 p-3 rounded border border-slate-800/50">
                            <span className="block text-slate-500 font-medium mb-1">Vector Index Space</span>
                            <span className="text-slate-300 font-mono font-bold uppercase">ChromaDB Node</span>
                        </div>
                        <div className="bg-slate-950/60 p-3 rounded border border-slate-800/50">
                            <span className="block text-slate-500 font-medium mb-1">Extraction Pipeline</span>
                            <span className="text-slate-300 font-mono font-bold uppercase">LLM / Vision API</span>
                        </div>
                        <div className="col-span-2 md:col-span-1 bg-slate-950/60 p-3 rounded border border-slate-800/50">
                            <span className="block text-slate-500 font-medium mb-1">Record ID Reference</span>
                            <span className="text-slate-400 font-mono font-bold truncate block">#{reportId.substring(0, 8)}...</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ReportAnalysis;