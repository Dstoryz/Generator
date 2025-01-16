/*/home/alex/Documents/Project/frontend/src/api/authService.js*/

import api from './api';
import { ENDPOINTS } from './config';

export const authService = {
  async login(credentials) {
    try {
      console.log('Attempting login...');
      const response = await api.post(ENDPOINTS.LOGIN, credentials);
      console.log('Login successful, setting tokens...');
      
      const { token, refresh } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('refresh', refresh);
      
      // Устанавливаем токен в заголовки сразу после логина
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  async refreshToken() {
    try {
      const refresh = localStorage.getItem('refresh');
      if (!refresh) throw new Error('No refresh token');

      const response = await api.post(ENDPOINTS.REFRESH, { refresh });
      const { access } = response.data;
      
      localStorage.setItem('token', access);
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      return access;
    } catch (error) {
      this.logout();
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    delete api.defaults.headers.common['Authorization'];
  },

  getToken() {
    return localStorage.getItem('token');
  },

  async register(userData) {
    try {
      console.log('Attempting registration...');
      const response = await api.post(ENDPOINTS.REGISTER, userData);
      console.log('Registration successful, setting tokens...');
      
      const { token, refresh } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('refresh', refresh);
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error(error.response?.data?.detail || 'Registration failed');
    }
  }
}; 