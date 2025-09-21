import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch users
                const usersRes = await fetch('/api/admin/users', {
                    headers: { 'Authorization': `Bearer ${auth.token}` }
                });
                if (!usersRes.ok) throw new Error('Failed to fetch users');
                const usersData = await usersRes.json();
                setUsers(usersData);

                // Fetch subjects
                const subjectsRes = await fetch('/api/admin/subjects', {
                    headers: { 'Authorization': `Bearer ${auth.token}` }
                });
                if (!subjectsRes.ok) throw new Error('Failed to fetch subjects');
                const subjectsData = await subjectsRes.json();
                setSubjects(subjectsData);

            } catch (err) {
                setError(err.message);
            }
        };

        fetchData();
    }, [auth.token]);

    return (
        <div className="container mx-auto mt-10 p-4">
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <button onClick={() => logout(navigate)} className="bg-red-500 text-white py-2 px-4 rounded">Logout</button>
                </div>

                {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Users List */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">All Users ({users.length})</h2>
                        <div className="overflow-auto max-h-96">
                            <table className="min-w-full bg-white border">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="py-2 px-4 border-b">Name</th>
                                        <th className="py-2 px-4 border-b">Email</th>
                                        <th className="py-2 px-4 border-b">Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.user_id} className="hover:bg-gray-50">
                                            <td className="py-2 px-4 border-b">{user.first_name} {user.last_name}</td>
                                            <td className="py-2 px-4 border-b">{user.email}</td>
                                            <td className="py-2 px-4 border-b">{user.role_name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Subjects List */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">All Subjects ({subjects.length})</h2>
                        <div className="overflow-auto max-h-96">
                           <ul className="space-y-2">
                                {subjects.map(subject => (
                                    <li key={subject.subject_id} className="p-3 bg-gray-50 rounded border">
                                        {subject.subject_name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;