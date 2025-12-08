import { Api } from './Api';



const baseURL = import.meta.env.VITE_API_URL || '/api';

export const api = new Api({
    baseURL: baseURL,
});

api.instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});