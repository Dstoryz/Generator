import api from './api';
import { ENDPOINTS, API_CONFIG } from './config';

export const generationService = {
  async generateImage(data) {
    try {
      const response = await api.post(ENDPOINTS.GENERATE, {
        prompt: data.prompt,
        model: data.model,
        style: data.style,
        n_steps: data.n_steps,
        guidance_scale: data.guidance_scale,
        seed: data.seed,
        width: data.width,
        height: data.height,
        negative_prompt: data.negative_prompt,
        sampler: data.sampler,
        clip_skip: data.clip_skip,
        tiling: data.tiling,
        hires_fix: data.hires_fix,
        denoising_strength: data.denoising_strength,
        safety_checker: data.safety_checker,
        color_scheme: data.color_scheme
      });
      return response.data;
    } catch (error) {
      console.error('Image generation error:', error);
      throw error;
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
      
      const data = response.data;
      
      if (!data || typeof data !== 'object') {
        console.error('Invalid response data:', data);
        throw new Error('Invalid response format');
      }
      
      return {
        results: Array.isArray(data.results) ? data.results : [],
        count: data.count || 0,
        next: data.next,
        previous: data.previous
      };
      
    } catch (error) {
      console.error('Error fetching history:', error);
      throw error;
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
  }
}; 