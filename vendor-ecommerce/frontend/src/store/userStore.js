import { create } from 'zustand';
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Configure Axios to automatically attach JWT token
api.interceptors.request.use((config) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
    if (userInfo && userInfo.token) {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
});

export { api };

export const useUserStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('userInfo') || 'null'),
    login: async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('userInfo', JSON.stringify(data));
            set({ user: data });
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || error.message };
        }
    },
    register: async (name, email, password, role) => {
        try {
            const { data } = await api.post('/auth/register', { name, email, password, role });
            localStorage.setItem('userInfo', JSON.stringify(data));
            set({ user: data });
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || error.message };
        }
    },
    logout: () => {
        localStorage.removeItem('userInfo');
        set({ user: null });
        window.location.href = '/login';
    }
}));
