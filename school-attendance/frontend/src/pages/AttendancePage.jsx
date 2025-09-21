import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

const AttendancePage = () => {
    const videoRef = useRef();
    const [status, setStatus] = useState('Initializing...');
    const [error, setError] = useState('');
    const [isReady, setIsReady] = useState(false);
    const { auth } = useAuth();
    const navigate = useNavigate();
    const { classId } = useParams(); // Get the classId from the URL

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
                        setIsReady(true);
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

    const handleMarkAttendance = async () => {
        setIsReady(false);
        setStatus('Detecting face...');
        setError('');

        if (!classId) {
            setError("Error: No Class ID found in the URL.");
            setIsReady(true);
            return;
        }

        try {
            const detection = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptor();
            
            if (!detection) {
                setError('No face detected. Please try again.');
                setStatus('');
                setIsReady(true);
                return;
            }

            const descriptor = Array.from(detection.descriptor);
            setStatus('Face detected, verifying...');

            const response = await fetch('/api/face/recognize', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}` 
                },
                body: JSON.stringify({ descriptor, classId }) // Send classId to backend
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Verification failed.');
            
            setStatus(`Welcome, ${data.firstName}! Attendance marked.`);
            setTimeout(() => navigate('/dashboard'), 3000);

        } catch (err) {
            setError(err.message || 'An error occurred during verification.');
            setStatus('');
            setIsReady(true);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center">Mark Attendance</h1>
                
                <div className="relative w-full aspect-square bg-gray-200 rounded-md overflow-hidden">
                    <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover"></video>
                </div>

                <div className="text-center h-6">
                    {error ? <p className="text-red-500">{error}</p> : <p className="text-blue-500">{status}</p>}
                </div>

                <button
                    onClick={handleMarkAttendance}
                    disabled={!isReady}
                    className="w-full px-4 py-2 font-bold text-white bg-green-500 rounded-md hover:bg-green-700 disabled:bg-gray-400"
                >
                    {isReady ? 'Verify My Identity' : status}
                </button>
            </div>
        </div>
    );
};

export default AttendancePage;