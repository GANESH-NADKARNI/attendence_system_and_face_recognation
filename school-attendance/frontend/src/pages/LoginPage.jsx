import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    // This is a safeguard. If the user lands here without a role, guide them back.
    if (!location.state?.role) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-lg text-red-500">No role selected.</p>
                    <Link to="/" className="text-blue-500 hover:underline">Go Home</Link>
                </div>
            </div>
        );
    }
    const role = location.state.role;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role }),
            });
            
            // Attempt to get the JSON response from the backend
            const data = await response.json();

            // If the response status is not 'ok' (e.g., 401, 500), throw an error
            if (!response.ok) {
                // Use the specific error message from the backend if it exists
                throw new Error(data.message || 'An unknown error occurred.');
            }
            
            // If successful, call the login function from context and navigate
            login(data.token);
            navigate('/dashboard');

        } catch (err) {
            // Display the specific error message to the user
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Login as a {role}</h1>
                </div>
                {error && <p className="text-sm text-center text-red-500 bg-red-100 p-2 rounded-md">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label>Email address</label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 mt-1 border rounded-md"/>
                    </div>
                    <div>
                        <label>Password</label>
                        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 mt-1 border rounded-md"/>
                    </div>
                    <div>
                        <button type="submit" disabled={loading} className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-gray-400">
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>
                 <div className="text-sm text-center mt-4">
                    <p>Don't have an account? <Link to="/register" state={{ role }} className="font-medium text-blue-500 hover:underline">Register</Link></p>
                    <p className="mt-2"><Link to="/" className="text-blue-500 hover:underline">Back to Role Selection</Link></p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;