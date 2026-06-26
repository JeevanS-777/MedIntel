import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChatSession = () => {
    const { chatId } = useParams();
    
    console.log("Current active chat session ID checked:", chatId);

    const navigate = useNavigate();
    const chatEndRef = useRef(null);
    
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [reportMetadata, setReportMetadata] = useState({
        file_name: 'Blood Report.pdf', // Updated fallback default value to match your actual file
        uploaded_at: new Date().toISOString()
    });
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(true);

    // Single source of truth for initialization
    // Single source of truth for initialization
    useEffect(() => {
        let isMounted = true;

        const fetchChatContext = async () => {
            if (!chatId || chatId === 'undefined') {
                console.error("Critical: chatId parameter is undefined.");
                setLoading(false);
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5000/api/chats/${chatId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (isMounted && res.data) {
                    setMessages(res.data.messages || []);
                    
                    // Always set metadata values with strict fallback defaults to prevent layout rendering drops
                    setReportMetadata({
                        file_name: res.data.chat_title || 'Blood Report.pdf',
                        uploaded_at: res.data.upload_date || new Date().toISOString()
                    });
                }
            } catch (err) {
                console.error('Safe catch engaged:', err);
                if (isMounted) {
                    setMessages([]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchChatContext();

        return () => {
            isMounted = false;
        };
    }, [chatId]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || sending) return;

        const userMessageText = input.trim();
        setInput('');
        setSending(true);

        setMessages(prev => [...prev, { sender: 'user', message_text: userMessageText }]);

        try {
            const token = localStorage.getItem('token');
            
            const res = await axios.post(`http://localhost:5000/api/chats/message`, {
                chat_id: chatId,
                message: userMessageText
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data && res.data.ai_response) {
                setMessages(prev => [...prev, { sender: 'ai', message_text: res.data.ai_response }]);
            } else {
                throw new Error("Invalid format in AI response body string map.");
            }
        } catch (err) {
            console.error("Message error:", err);
            setMessages(prev => [...prev, { 
                sender: 'ai', 
                message_text: 'CRITICAL NODE EXCEPTION: Encountered an operational failure parsing vector logic downstream.' 
            }]);
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
                <div className="text-center space-y-3">
                    <p>Synchronizing secure context telemetry maps...</p>
                    <button 
                        onClick={() => setLoading(false)} 
                        className="text-xs text-indigo-400 underline hover:text-indigo-300 block mx-auto mt-2"
                    >
                        Force Bypass Loading
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-4rem)] bg-slate-950 flex flex-col md:flex-row">
            
            {/* Left Hand Fixed Insight Meta Context Column Panel */}
            <div className="w-full md:w-80 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 p-6 flex flex-col justify-between">
                <div className="space-y-4">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold tracking-wider uppercase flex items-center gap-1.5 mb-2 transition-colors"
                    >
                        ← Return to Hub Matrix
                    </button>
                    <div className="border-t border-slate-800/80 pt-4">
                        <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Context Document Source</span>
                        <h3 className="text-sm font-semibold text-slate-200 mt-1 truncate">{reportMetadata.file_name}</h3>
                        <p className="text-xs text-slate-500 mt-1">
                            Indexed on {new Date(reportMetadata.uploaded_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="hidden md:block p-3 bg-slate-950 border border-slate-800 rounded text-[11px] text-slate-500 leading-relaxed">
                    <strong>INTELLIGENCE PARAMETERS:</strong> Conversation prompts securely parse context vectors using localized embeddings before querying generative model endpoints.
                </div>
            </div>

            {/* Right Hand Conversational Interface Stream Window */}
            <div className="flex-1 flex flex-col h-full bg-slate-950">
                
                {/* Scrollable Message History Track */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-center p-6">
                            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                                System initialized. Inquire regarding specifics, normal ranges, or clinical variables inside your report.
                            </p>
                        </div>
                    ) : (
                        messages.map((msg, index) => (
                            <div 
                                key={index} 
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-2xl px-4 py-2.5 rounded text-sm leading-relaxed border ${
                                    msg.sender === 'user' 
                                        ? 'bg-slate-900 border-slate-800 text-slate-200 rounded-br-none shadow-sm'
                                        : 'bg-slate-950 border-slate-800 text-slate-300 rounded-bl-none'
                                }`}>
                                    <span className="block text-[9px] font-black tracking-wider text-slate-500 uppercase mb-1">
                                        {msg.sender === 'user' ? 'Client Operator' : 'MedIntel AI'}
                                    </span>
                                    <p className="whitespace-pre-wrap">{msg.message_text || msg.message}</p>
                                </div>
                            </div>
                        ))
                    )}
                    {sending && (
                        <div className="flex justify-start">
                            <div className="bg-slate-950 border border-slate-800 rounded rounded-bl-none px-4 py-2 text-xs text-slate-500 tracking-wide animate-pulse">
                                Executing retrieval vector cross-queries...
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Secure Command Prompt Input Box */}
                <div className="p-4 bg-slate-900 border-t border-slate-800">
                    <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-3">
                        <input
                            type="text"
                            required
                            value={input}
                            disabled={sending}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask anything related to your report..."
                            className="flex-1 bg-slate-950 border border-slate-800 rounded px-4 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || sending}
                            className="px-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium text-sm rounded transition-colors"
                        >
                            Send
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default ChatSession;