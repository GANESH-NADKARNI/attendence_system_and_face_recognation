import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();
    const [activeClass, setActiveClass] = useState(null);

    useEffect(() => {
        // Poll for an active class every 5 seconds
        const intervalId = setInterval(async () => {
            try {
                const response = await fetch('/api/class/active', {
                    headers: { 'Authorization': `Bearer ${auth.token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setActiveClass(data);
                } else {
                    setActiveClass(null);
                }
            } catch (error) {
                setActiveClass(null);
            }
        }, 5000);

        return () => clearInterval(intervalId); // Cleanup on component unmount
    }, [auth.token]);

    const handleJoinClass = () => {
        if (activeClass) {
            navigate(`/attendance/${activeClass.class_id}`);
        }
    };

    return (
        <div className="container mx-auto mt-10 p-4">
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Student Dashboard</h1>
                    <button onClick={() => logout(navigate)} className="bg-red-500 text-white py-2 px-4 rounded">Logout</button>
                </div>

                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">
                        {activeClass ? `Class Available: ${activeClass.subject_name}` : "No Active Class"}
                    </h2>
                    <button
                        onClick={handleJoinClass}
                        disabled={!activeClass}
                        className="w-full py-3 px-4 rounded text-white font-bold bg-blue-500 disabled:bg-gray-400"
                    >
                        Join Class
                    </button>
                     {!auth.user.isFaceEnrolled && (
                        <p className="text-red-500 mt-4">
                            You must <a href="/enroll" className="underline">enroll your face</a> before you can join a class.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;