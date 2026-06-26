import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            
            // Set session artifacts securely
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Authentication handshake failed. Check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-950 px-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-lg p-8 shadow-xl">
                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Access MedIntel Portal</h2>
                    <p className="text-sm text-slate-400 mt-2">Enter your credentials to authenticate.</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-950/40 border border-red-900 text-red-400 text-sm rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                            placeholder="name@institution.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800/50 text-white font-medium text-sm py-2 rounded shadow-sm transition-colors duration-150"
                    >
                        {loading ? 'Authenticating Gateway...' : 'Secure Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center border-t border-slate-800/60 pt-4">
                    <p className="text-xs text-slate-500">
                        New deployment instance?{' '}
                        <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                            Register Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;