import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Access controller guarding protected workspace views.
 * If no session token footprint exists inside client storage, boots to login.
 */
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;