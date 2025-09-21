import React, { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import * as faceapi from 'face-api.js';

const BLINK_THRESHOLD = 0.25; // You might need to adjust this value

const CameraCapture = ({ onVerified, onCancel }) => {
    const webcamRef = useRef(null);
    const intervalRef = useRef(null);
    const [message, setMessage] = useState('Loading models...');
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const blinking = useRef(false);

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = '/models'; // Assumes models are in /public/models
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            ]);
            setModelsLoaded(true);
            setMessage('Please look at the camera and blink.');
        };
        loadModels();
    }, []);

    const stopDetection = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const captureAndVerify = useCallback(() => {
        if (!webcamRef.current) return;

        stopDetection(); // Stop detecting blinks
        const imageSrc = webcamRef.current.getScreenshot();
        setMessage('Verifying...');
        
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const location = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                };
                try {
                    await axios.post('/users/verify-attendance', { image: imageSrc, location });
                    onVerified({ success: true });
                } catch (err) {
                    onVerified({ success: false, message: err.response?.data?.message || 'Verification failed.' });
                }
            },
            () => {
                onVerified({ success: false, message: 'Could not get location. Please enable location services.' });
            }
        );
    }, [onVerified, stopDetection]);
    
    const getEyeAspectRatio = (landmarks) => {
        const eyeAspectRatio = (eye) => {
            const d1 = faceapi.euclideanDistance(eye[1], eye[5]);
            const d2 = faceapi.euclideanDistance(eye[2], eye[4]);
            const d3 = faceapi.euclideanDistance(eye[0], eye[3]);
            return (d1 + d2) / (2 * d3);
        };
        return (eyeAspectRatio(landmarks.getLeftEye()) + eyeAspectRatio(landmarks.getRightEye())) / 2;
    };

    const handleVideoFrame = useCallback(async () => {
        if (webcamRef.current?.video && webcamRef.current.video.readyState === 4) {
            const detections = await faceapi.detectSingleFace(webcamRef.current.video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
            
            if (detections) {
                const ear = getEyeAspectRatio(detections.landmarks);
                
                if (ear < BLINK_THRESHOLD) {
                    blinking.current = true;
                }
                
                if (ear > BLINK_THRESHOLD && blinking.current) {
                    setMessage('Blink detected! Capturing...');
                    blinking.current = false;
                    captureAndVerify();
                }
            }
        }
    }, [captureAndVerify]);
    
    useEffect(() => {
        if (modelsLoaded) {
            intervalRef.current = setInterval(handleVideoFrame, 200);
        }
        return () => stopDetection();
    }, [modelsLoaded, handleVideoFrame, stopDetection]);

    return (
        <div>
            <h4>{message}</h4>
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={720}
                height={480}
            />
            <button onClick={onCancel}>Cancel</button>
        </div>
    );
};

export default CameraCapture;