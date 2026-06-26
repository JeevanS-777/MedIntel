import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Strict client-side alignment check
        if (formData.password !== formData.confirmPassword) {
            setError('Password mismatch error. Verify confirmation input.');
            setLoading(false);
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            
            setSuccess('Identity registered successfully on core database nodes. Redirecting...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Registration gateway rejection. Account may already exist.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-950 px-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-lg p-8 shadow-xl">
                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Create an Account</h2>
                    <p className="text-sm text-slate-400 mt-2">Initialize identity records to access MedIntel platform.</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-950/40 border border-red-900 text-red-400 text-sm rounded">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-3 bg-emerald-950/40 border border-emerald-900 text-emerald-400 text-sm rounded">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-1.5">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                            placeholder="Dr. Alexander Vance"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-1.5">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                            placeholder="vance@medintel.org"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-1.5">
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

                    <div>
                        <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-1.5">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800/50 text-white font-medium text-sm py-2 rounded shadow-sm transition-colors duration-150"
                    >
                        {loading ? 'Compiling Credentials...' : 'Register Secure Profile'}
                    </button>
                </form>

                <div className="mt-6 text-center border-t border-slate-800/60 pt-4">
                    <p className="text-xs text-slate-500">
                        Existing operator node?{' '}
                        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;