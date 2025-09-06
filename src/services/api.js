// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',
});

export const register = (username, password) => {
    return api.post('/auth/register', { username, password });
};

// Add the login function
export const login = (username, password) => {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    return api.post('/auth/token', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
};

export const startExam = (token, params = {}) => {
    // Filter out any null/undefined values from params
    const filteredParams = Object.entries(params).reduce((acc, [key, value]) => {
        if (value) acc[key] = value;
        return acc;
    }, {});

    const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: filteredParams,
    };
    return api.get('/exams/start', config);
};


export const getTopics = (token) => {
    return api.get('/exams/topics', {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// src/services/api.js
// ... (keep startExam, getTopics, etc.)

// NEW: Function to save exam result
export const saveResult = (resultData, token) => {
    return api.post('/exams/save_result', resultData, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// NEW: Function to fetch exam history
export const getHistory = (token) => {
    return api.get('/exams/history', {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// src/services/api.js
// ...

// NEW: Function to fetch details of a single exam attempt
export const getHistoryDetail = (attemptId, token) => {
    return api.get(`/exams/history/${attemptId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};


export default api;