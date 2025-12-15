const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/$/, '');
const DEMO_USER_ID =
  import.meta.env.VITE_DEMO_USER_ID ?? '32c9b77a-5fe8-4efc-9d62-9ce5c6290321';

export const env = {
  apiBaseUrl: API_BASE_URL,
  demoUserId: DEMO_USER_ID,
};
