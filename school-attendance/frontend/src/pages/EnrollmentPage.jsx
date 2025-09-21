import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EnrollmentPage = () => {
    const navigate = useNavigate();
    const webcamRef = useRef(null);
    const [message, setMessage] = useState('Please position your face in the center and capture.');
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const capture = async () => {
        setError('');
        setIsProcessing(true);
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            setMessage('Processing...');
            try {
                await axios.post('/users/enroll-face', { image: imageSrc });
                
                const user = JSON.parse(localStorage.getItem('user'));
                user.is_face_enrolled = true;
                localStorage.setItem('user', JSON.stringify(user));

                setMessage('Enrollment successful! Redirecting to dashboard...');
                setTimeout(() => navigate(`/${user.role.toLowerCase()}/dashboard`), 2000);
            } catch (err) {
                setError(err.response?.data?.msg || 'Enrollment failed. Please try again.');
                setMessage('Please position your face in the center and capture.');
                setIsProcessing(false);
            }
        } else {
            setError('Could not capture image. Please ensure your webcam is enabled.');
            setIsProcessing(false);
        }
    };

    return (
        <div>
            <h1>Face Enrollment</h1>
            <p>{message}</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={720}
                height={480}
            />
            <button onClick={capture} disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Capture and Enroll'}
            </button>
        </div>
    );
};

export default EnrollmentPage;