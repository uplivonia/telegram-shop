// Central API endpoint resolver
export const API =
  (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.replace(/\/$/, ''))
  || 'http://localhost:4000';
