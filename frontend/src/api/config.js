export const API_BASE_URL = 'http://localhost:8000/api';

export const ENDPOINTS = {
  GENERATE: '/generation/generate/',
  HISTORY: '/generation/history/',
  LOGIN: '/login/',
  REGISTER: '/register/',
  REFRESH: '/token/refresh/',
  CSRF: '/csrf/',
  PROFILE: '/users/profile/',
  USER_STATS: '/users/stats/'
};

export const API_CONFIG = {
  TIMEOUT: 60000,
  GENERATION_TIMEOUT: 120000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
}; 