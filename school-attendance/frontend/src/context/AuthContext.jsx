import React, { createContext, useState, useContext, useEffect } from 'react';
import jwtDecode from 'jwt-decode'; // <-- This is the only line that changed

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const storedAuth = localStorage.getItem('auth');
        if (!storedAuth) return { token: null, user: null };
        
        try {
            const parsedAuth = JSON.parse(storedAuth);
            const decodedToken = jwtDecode(parsedAuth.token);
            if (decodedToken.exp * 1000 < Date.now()) {
                localStorage.removeItem('auth');
                return { token: null, user: null };
            }
            return parsedAuth;
        } catch (error) {
            return { token: null, user: null };
        }
    });

    useEffect(() => {
        if (auth.token) {
            localStorage.setItem('auth', JSON.stringify(auth));
        } else {
            localStorage.removeItem('auth');
        }
    }, [auth]);

    const login = (token) => {
        try {
            const decoded = jwtDecode(token);
            const user = {
                id: decoded.user.id,
                email: decoded.user.email,
                role: decoded.user.role,
                isFaceEnrolled: decoded.user.isFaceEnrolled,
                firstName: decoded.user.firstName
            };
            setAuth({ token, user });
        } catch (error) {
            console.error("Failed to decode token:", error);
            setAuth({ token: null, user: null });
        }
    };

    const logout = (navigate) => {
        setAuth({ token: null, user: null });
        localStorage.removeItem('auth');
        navigate('/login', { replace: true });
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};