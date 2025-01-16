/*/home/alex/Documents/Project/frontend/src/api/api.js*/

import axios from 'axios';
import { API_BASE_URL, ENDPOINTS } from './config';
import { authService } from './authService';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 60000,
});

// Добавляем токен к каждому запросу
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Adding token to request:', config.url);
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No token found for request:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Обработка ответов
api.interceptors.response.use(
  response => response,
  async (error) => {
    console.error('Response error:', error.response?.status, error.config?.url);
    
    if (error.response?.status === 401) {
      console.log('Unauthorized, attempting token refresh...');
      const originalRequest = error.config;

      if (!originalRequest._retry && !originalRequest.url.includes('token/refresh')) {
        originalRequest._retry = true;

        try {
          const refresh = localStorage.getItem('refresh');

          if (refresh) {
            const response = await api.post(ENDPOINTS.REFRESH, { refresh }, {
              headers: {
                'Content-Type': 'application/json',
              },
              skipAuthRefresh: true
            });
            const { access } = response.data;

            localStorage.setItem('token', access);
            api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

            originalRequest.headers.Authorization = `Bearer ${access}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          localStorage.removeItem('token');
          localStorage.removeItem('refresh');
          if (!originalRequest.url.includes('history')) {
            window.location.href = '/login';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api; 