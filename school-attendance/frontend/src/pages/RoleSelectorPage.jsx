import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSelectorPage = () => {
    const navigate = useNavigate();
    
    // Add "Moderator" to this list
    const roles = ['Admin', 'Teacher', 'Student', 'Moderator'];

    const handleRoleSelect = (role) => {
        // Navigate to the login page, passing the selected role in the state
        navigate('/login', { state: { role } });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800">Welcome</h1>
                    <p className="mt-2 text-gray-600">Please select your role to login</p>
                </div>
                <div className="space-y-4">
                    {roles.map((role) => (
                        <button
                            key={role}
                            onClick={() => handleRoleSelect(role)}
                            className="w-full px-4 py-3 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors"
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RoleSelectorPage;