import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        uid: ''
    });
    const [subjectIds, setSubjectIds] = useState([]);
    const [allSubjects, setAllSubjects] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    if (!location.state?.role) {
        return <div className="text-center p-8">Please select a role first. <Link to="/" className="text-blue-500">Go Home</Link></div>;
    }
    const { role } = location.state;

    // Fetch subjects when the component loads if the role is Teacher
    useEffect(() => {
        if (role === 'Teacher') {
            const fetchSubjects = async () => {
                try {
                    const res = await fetch('/api/subjects');
                    if (!res.ok) throw new Error('Could not fetch subjects');
                    const data = await res.json();
                    setAllSubjects(data);
                } catch (err) {
                    setError('Could not load subjects. Please try refreshing.');
                }
            };
            fetchSubjects();
        }
    }, [role]);

    const { firstName, lastName, email, password, uid } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubjectChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
        setSubjectIds(selectedOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const body = { firstName, lastName, email, password, role };
            if (role === 'Student') body.uid = uid;
            if (role === 'Teacher') body.subjectIds = subjectIds;

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Registration failed');

            setSuccess('Registration successful! You can now log in.');
            setTimeout(() => navigate('/login', { state: { role } }), 2000);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center">Register as a {role}</h2>
                {error && <p className="text-red-500 bg-red-100 p-2 text-center rounded">{error}</p>}
                {success && <p className="text-green-500 bg-green-100 p-2 text-center rounded">{success}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Common fields */}
                    <div>
                        <label className="block text-sm font-medium">First Name</label>
                        <input type="text" name="firstName" value={firstName} onChange={onChange} required className="w-full px-3 py-2 mt-1 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Last Name</label>
                        <input type="text" name="lastName" value={lastName} onChange={onChange} required className="w-full px-3 py-2 mt-1 border rounded-md" />
                    </div>
                     {/* Role-specific fields */}
                    {role === 'Student' && (
                        <div>
                            <label className="block text-sm font-medium">Student UID</label>
                            <input type="text" name="uid" value={uid} onChange={onChange} required className="w-full px-3 py-2 mt-1 border rounded-md"/>
                        </div>
                    )}
                    {role === 'Teacher' && (
                        <div>
                            <label className="block text-sm font-medium">Subjects</label>
                            <select
                                multiple
                                required
                                value={subjectIds}
                                onChange={handleSubjectChange}
                                className="w-full px-3 py-2 mt-1 border rounded-md h-32"
                            >
                                {allSubjects.map(subject => (
                                    <option key={subject.subject_id} value={subject.subject_id}>
                                        {subject.subject_name}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">Hold Ctrl (or Cmd on Mac) to select multiple subjects.</p>
                        </div>
                    )}
                    {/* Common fields cont. */}
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input type="email" name="email" value={email} onChange={onChange} required className="w-full px-3 py-2 mt-1 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Password</label>
                        <input type="password" name="password" value={password} onChange={onChange} required minLength="6" className="w-full px-3 py-2 mt-1 border rounded-md" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-gray-400">
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <div className="text-center">
                    <Link to="/login" state={{ role }} className="text-sm text-blue-500 hover:underline">
                        Already have an account? Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;