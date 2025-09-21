import React from 'react';
import { Navigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const ProtectedRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" />;
    }

    try {
        const decoded = jwt_decode(token);
        const userRole = decoded.user.role;

        // Check for token expiration
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return <Navigate to="/login" />;
        }
        
        // Check if the user has the required role
        if (requiredRole && userRole !== requiredRole) {
            // Redirect to their own dashboard if they try to access a page they don't have a role for
            return <Navigate to={`/${userRole.toLowerCase()}/dashboard`} />;
        }

        return children;

    } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return <Navigate to="/login" />;
    }
};

export default ProtectedRoute;