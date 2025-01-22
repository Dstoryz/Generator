import api from './api';
import { ENDPOINTS } from './config';

export const generationService = {
  async generateImage(data) {
    try {
      console.log('Sending data to server:', data);
      const response = await api.post(ENDPOINTS.GENERATE, data);
      console.log('Server response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Generation error:', error.response?.data || error);
      throw new Error(error.response?.data?.detail || 'Failed to generate image');
    }
  },

  async getHistory(page = 1, perPage = 12) {
    try {
      const response = await api.get(ENDPOINTS.HISTORY, {
        params: {
          page,
          per_page: perPage
        }
      });
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        next: response.data.next,
        previous: response.data.previous
      };
      
    } catch (error) {
      console.error('Error fetching history:', error);
      throw new Error(error.response?.data?.detail || 'Failed to fetch history');
    }
  },

  async deleteFromHistory(id) {
    try {
      await api.delete(`${ENDPOINTS.HISTORY}${id}/`);
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to delete image');
    }
  },

  async initializeCSRF() {
    try {
      await api.get(ENDPOINTS.CSRF);
    } catch (error) {
      console.error('Failed to get CSRF token:', error);
    }
  },

  async getModelParameters(modelName) {
    try {
      const response = await api.get(
        ENDPOINTS.MODEL_PARAMETERS.replace(':modelName', modelName)
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching model parameters:', error);
      throw error;
    }
  }
}; 