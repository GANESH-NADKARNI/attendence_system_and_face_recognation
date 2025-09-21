import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState([]);
    const [activeClass, setActiveClass] = useState(null);
    const [teacherSubjects, setTeacherSubjects] = useState([]); // Assuming we'll fetch this
    const [selectedSubject, setSelectedSubject] = useState('');
    const [error, setError] = useState('');

    // Fetch analytics and teacher's subjects on component load
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch analytics
                const analyticsRes = await fetch('/api/analytics/teacher', {
                    headers: { 'Authorization': `Bearer ${auth.token}` }
                });
                if (!analyticsRes.ok) throw new Error('Failed to fetch analytics');
                const analyticsData = await analyticsRes.json();
                setAnalytics(analyticsData);

                // Placeholder for fetching teacher-specific subjects - for now, we assume they have subjects
                // In a real app, you'd fetch this from '/api/teachers/:id/subjects'
                // For this example, we will just manage an active class state
            } catch (err) {
                setError(err.message);
            }
        };
        fetchData();
    }, [auth.token]);

    const handleStartClass = async () => {
        // For simplicity, we'll just start a class for a placeholder subject.
        // A real implementation would use a dropdown of the teacher's actual subjects.
        const subjectId = 1; // Placeholder for 'Mathematics'
        setError('');
        try {
            const res = await fetch('/api/class/start', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}` 
                },
                body: JSON.stringify({ subjectId })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Could not start class');
            setActiveClass({ id: data.classId, subject: 'Placeholder Subject' });
            alert(`Class started! Share this link with students: ${window.location.origin}/attendance/${data.classId}`);
        } catch (err) {
            setError(err.message);
        }
    };
    
    const handleEndClass = async () => {
        if (!activeClass) return;
        setError('');
        try {
            const res = await fetch('/api/class/end', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}` 
                },
                body: JSON.stringify({ classId: activeClass.id })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Could not end class');
            setActiveClass(null);
            alert('Class has been ended.');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
                    <button onClick={() => logout(navigate)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
                </div>

                {/* --- Action Buttons --- */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h2 className="text-xl font-semibold mb-4">Class Management</h2>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <div className="flex gap-4">
                        <button 
                            onClick={handleStartClass} 
                            disabled={!!activeClass}
                            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
                        >
                            Start New Class
                        </button>
                        <button 
                            onClick={handleEndClass}
                            disabled={!activeClass}
                            className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-gray-400"
                        >
                            End Active Class
                        </button>
                    </div>
                     {activeClass && <p className="text-blue-600 mt-4">A class is currently active. Students can join using the attendance link.</p>}
                </div>

                {/* --- Analytics Section --- */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Past Class Analytics</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="py-2 px-4 border">Class ID</th>
                                    <th className="py-2 px-4 border">Subject</th>
                                    <th className="py-2 px-4 border">Start Time</th>
                                    <th className="py-2 px-4 border">Attendees (#)</th>
                                    <th className="py-2 px-4 border">Attendee List</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analytics.length > 0 ? analytics.map(item => (
                                    <tr key={item.class_id} className="text-center">
                                        <td className="py-2 px-4 border">{item.class_id}</td>
                                        <td className="py-2 px-4 border">{item.subject_name}</td>
                                        <td className="py-2 px-4 border">{new Date(item.start_time).toLocaleString()}</td>
                                        <td className="py-2 px-4 border">{item.attendance_count}</td>
                                        <td className="py-2 px-4 border text-left">{item.attendees || 'None'}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4">No class data found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;