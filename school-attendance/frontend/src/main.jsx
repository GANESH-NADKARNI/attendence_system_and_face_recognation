import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import axios from 'axios';

// When running with Docker, the Nginx proxy handles routing.
// For local dev, we use Vite's proxy (configured in vite.config.js) or point directly.
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '/api';

axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);