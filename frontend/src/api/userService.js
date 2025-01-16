import api from './api';
import { ENDPOINTS } from './config';

export const userService = {
  async getUserProfile() {
    try {
      const response = await api.get(ENDPOINTS.PROFILE);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch profile');
    }
  },

  async getUserStats() {
    try {
      const response = await api.get(ENDPOINTS.USER_STATS);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch user stats');
    }
  },

  async updateProfile(userData) {
    try {
      const response = await api.put(ENDPOINTS.PROFILE, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to update profile');
    }
  },

  async updateAvatar(formData) {
    try {
      const response = await api.put(`${ENDPOINTS.PROFILE}/avatar/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to update avatar');
    }
  }
}; 