import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const EnrollPage = () => {
    const videoRef = useRef();
    const [status, setStatus] = useState('Initializing...');
    const [error, setError] = useState('');
    const [isReady, setIsReady] = useState(false); // New state to control button
    const { auth } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const loadAssets = async () => {
            try {
                setStatus('Loading face models...');
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                    faceapi.nets.faceRecognitionNet.loadFromUri('/models')
                ]);
                startVideo();
            } catch (err) {
                setError('Could not load face models. Please refresh.');
            }
        };

        const startVideo = () => {
            setStatus("Starting camera...");
            navigator.mediaDevices.getUserMedia({ video: {} })
                .then(stream => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        setStatus('Please position your face in the camera.');
                        setIsReady(true); // Enable the button once the camera is ready
                    }
                })
                .catch(err => {
                    setError('Webcam access denied. Please allow camera permissions.');
                });
        };

        loadAssets();
        
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const handleEnroll = async () => {
        setIsReady(false); // Disable button during processing
        setStatus('Detecting face...');
        setError('');

        try {
            const detection = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptor();
            
            if (!detection) {
                setError('No face detected. Please try again.');
                setStatus('');
                setIsReady(true); // Re-enable button on failure
                return;
            }

            const descriptor = Array.from(detection.descriptor);
            setStatus('Face detected, saving enrollment data...');

            const response = await fetch('/api/face/enroll', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}` 
                },
                body: JSON.stringify({ descriptor })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Enrollment failed.');
            
            setStatus('Enrollment successful! Redirecting to dashboard...');
            setTimeout(() => navigate('/dashboard'), 2000);

        } catch (err) {
            setError(err.message || 'An error occurred during enrollment.');
            setStatus('');
            setIsReady(true); // Re-enable button on failure
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center">Face Enrollment</h1>
                
                <div className="relative w-full aspect-square bg-gray-200 rounded-md overflow-hidden">
                    <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover"></video>
                </div>

                <div className="text-center h-6">
                    {error ? <p className="text-red-500">{error}</p> : <p className="text-blue-500">{status}</p>}
                </div>

                <button
                    onClick={handleEnroll}
                    disabled={!isReady}
                    className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {isReady ? 'Enroll My Face' : status}
                </button>
            </div>
        </div>
    );
};

export default EnrollPage;