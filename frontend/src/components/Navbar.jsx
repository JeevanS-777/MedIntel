import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Helper to evaluate link selection states without neon lines
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 bg-slate-950 border-b border-slate-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    
                    {/* Balanced Corporate Identity Frame */}
                    <div className="flex items-center">
                        <Link to={token ? "/dashboard" : "/"} className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded bg-gradient-to-br from-blue-700 to-indigo-800 flex items-center justify-center">
                                <span className="text-white font-bold text-sm tracking-tight">M</span>
                            </div>
                            <span className="text-lg font-bold text-slate-100 tracking-wide">
                                Med<span className="text-slate-400 font-normal">Intel</span>
                            </span>
                        </Link>
                    </div>

                    {/* Standard Action Links Network */}
                    <div className="flex items-center gap-6">
                        {token ? (
                            <>
                                <div className="hidden md:block text-xs font-semibold tracking-wider text-slate-500 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                                    SESSION ID: <span className="text-slate-300 uppercase font-bold">{user.name || 'USER'}</span>
                                </div>
                                
                                <Link 
                                    to="/dashboard" 
                                    className={`text-sm font-medium transition-colors duration-150 ${
                                        isActive('/dashboard') 
                                            ? 'text-white border-b-2 border-indigo-500 pb-5 pt-5 -mb-[1px]' 
                                            : 'text-slate-400 hover:text-slate-200'
                                    }`}
                                >
                                    Dashboard
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="px-3 py-1.5 rounded text-sm font-medium border border-slate-700 text-slate-300 hover:bg-slate-900 hover:text-slate-100 transition-all duration-150"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link 
                                    to="/login" 
                                    className={`text-sm font-medium transition-colors duration-150 ${
                                        isActive('/login') ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                                    }`}
                                >
                                    Sign In
                                </Link>
                                
                                <Link
                                    to="/register"
                                    className="px-4 py-1.5 rounded text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors duration-150"
                                >
                                    Register Account
                                </Link>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;