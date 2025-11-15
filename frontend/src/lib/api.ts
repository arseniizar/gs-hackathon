// src/lib/api.ts
import axios from 'axios';

// The base URL for our Spring Boot backend.
// In a real app, this would come from an environment variable.
const API_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Axios interceptor to add the JWT token to every secure request
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


// --- AUTHENTICATION ---
export const loginUser = async (credentials: object) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
};

export const registerUser = async (userData: object) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
};


// --- TEAM PROFILE ---
export const getTeamProfile = async () => {
    const response = await apiClient.get('/team/profile');
    return response.data;
};

export const updateTeamProfile = async (profileData: object) => {
    const response = await apiClient.put('/team/profile', profileData);
    return response.data;
};


// --- PUBLIC CHALLENGES ---
export const getChallenges = async () => {
    const response = await apiClient.get('/challenges');
    return response.data;
};

export const getChallengeDetails = async (challengeId: string) => {
    const response = await apiClient.get(`/challenges/${challengeId}`);
    return response.data;
};


// --- LEADERBOARD & SUBMISSIONS ---
export const getLeaderboardForChallenge = async (challengeId: string) => {
    const response = await apiClient.get(`/challenges/${challengeId}/leaderboard`);
    return response.data;
};

export const getMySubmissions = async (challengeId: string) => {
    const response = await apiClient.get(`/submissions/my?challengeId=${challengeId}`);
    return response.data;
};

export const submitSolution = async (challengeId: string, file: File) => {
    const formData = new FormData();
    formData.append('challengeId', challengeId);
    formData.append('file', file);

    const response = await apiClient.post('/submit', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};


// --- ADMIN: CHALLENGE MANAGEMENT ---
export const adminGetAllChallenges = async () => {
    const response = await apiClient.get('/admin/challenges');
    return response.data;
};

export const adminCreateChallenge = async (challengeData: object) => {
    const response = await apiClient.post('/admin/challenges', challengeData);
    return response.data;
};

export const adminUpdateChallenge = async (id: string, challengeData: object) => {
    const response = await apiClient.put(`/admin/challenges/${id}`, challengeData);
    return response.data;
};

export const adminDeleteChallenge = async (id: string) => {
    await apiClient.delete(`/admin/challenges/${id}`);
};

export const getSubmissionDetails = async (submissionId: string) => {
    const response = await apiClient.get(`/submissions/${submissionId}`);
    return response.data;
};


// --- ADMIN: USER MANAGEMENT ---
export const adminGetAllUsers = async () => {
    const response = await apiClient.get('/admin/users');
    return response.data;
};

export const adminDeleteUser = async (id: string) => {
    await apiClient.delete(`/admin/users/${id}`);
};