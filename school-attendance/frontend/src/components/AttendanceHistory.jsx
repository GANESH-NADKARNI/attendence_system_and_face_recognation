import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AttendanceHistory = () => {
    const [records, setRecords] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get('/users/attendance');
                setRecords(res.data);
            } catch (err) {
                console.error('Could not fetch attendance history');
            }
        };
        fetchHistory();
    }, []);

    return (
        <div>
            <h3>Your Attendance History</h3>
            {records.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Date & Time</th>
                            <th>Location (Lat, Lon)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map(rec => (
                            <tr key={rec.record_id}>
                                <td>{new Date(rec.check_in_time).toLocaleString()}</td>
                                <td>{rec.latitude}, {rec.longitude}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No attendance records found.</p>
            )}
        </div>
    );
};

export default AttendanceHistory;