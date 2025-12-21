const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/$/, '');

export const env = {
  apiBaseUrl: API_BASE_URL,
};
