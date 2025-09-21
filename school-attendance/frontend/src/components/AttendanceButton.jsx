import React, { useState } from 'react';
import CameraCapture from './CameraCapture';

const AttendanceButton = () => {
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const handleVerificationResult = (result) => {
        setIsCameraOpen(false);
        if (result.success) {
            setStatusMessage(`✔️ Success! Attendance marked at ${new Date().toLocaleTimeString()}`);
        } else {
            setStatusMessage(`❌ Failed: ${result.message}. Please try again.`);
        }
    };

    return (
        <div>
            <h3>Mark Your Attendance</h3>
            <button onClick={() => { setStatusMessage(''); setIsCameraOpen(true); }} disabled={isCameraOpen}>
                Open Face Lock
            </button>
            {isCameraOpen && (
                <div className="modal">
                    <CameraCapture onVerified={handleVerificationResult} onCancel={() => setIsCameraOpen(false)} />
                </div>
            )}
            {statusMessage && <p>{statusMessage}</p>}
        </div>
    );
};

export default AttendanceButton;