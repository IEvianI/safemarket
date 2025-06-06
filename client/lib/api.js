import axios from 'axios';

const api = axios.create({
  baseURL: 'https://safemarket-backend.onrender.com/api',
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  console.log('Envoi avec token:', token);
  console.log('URL complète:', config.baseURL + config.url);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
