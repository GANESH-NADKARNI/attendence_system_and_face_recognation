import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ModeratorDashboard = () => {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/admin/users', {
                    headers: { 'Authorization': `Bearer ${auth.token}` }
                });
                if (!res.ok) throw new Error('Failed to fetch user data');
                const data = await res.json();
                setUsers(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchUsers();
    }, [auth.token]);

    return (
        <div className="container mx-auto mt-10 p-4">
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Moderator Dashboard</h1>
                    <button onClick={() => logout(navigate)} className="bg-red-500 text-white py-2 px-4 rounded">Logout</button>
                </div>

                {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
                
                <div>
                    <h2 className="text-2xl font-semibold mb-4">User Monitoring ({users.length})</h2>
                    <div className="overflow-auto max-h-[60vh]">
                        <table className="min-w-full bg-white border">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="py-2 px-4 border-b">Name</th>
                                    <th className="py-2 px-4 border-b">Role</th>
                                    <th className="py-2 px-4 border-b">UID</th>
                                    <th className="py-2 px-4 border-b">Face Enrolled?</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.user_id} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border-b">{user.first_name} {user.last_name}</td>
                                        <td className="py-2 px-4 border-b">{user.role_name}</td>
                                        <td className="py-2 px-4 border-b">{user.uid || 'N/A'}</td>
                                        <td className="py-2 px-4 border-b text-center">
                                            {user.is_face_enrolled ? '✔️' : '❌'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModeratorDashboard;