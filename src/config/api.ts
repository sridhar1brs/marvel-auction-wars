// Universal API & Backend URL configuration for Marvel Ascension
// Supports:
// 1. Same-origin deployment (e.g. Express serving static Vite bundle on Render/Railway/VPS)
// 2. Split-domain deployment (e.g. Vercel/Netlify frontend + Render/Railway backend via VITE_API_URL or VITE_BACKEND_URL)
// 3. Localhost development (Vite proxy to localhost:3001)

const env = (typeof import.meta !== 'undefined' && (import.meta as any).env) || {};

export const API_BASE_URL: string = (
  (env.VITE_API_URL as string) ||
  (env.VITE_BACKEND_URL as string) ||
  ''
).replace(/\/+$/, '');

/**
 * Returns the fully qualified or relative URL for any API endpoint.
 * Example: getApiUrl('/api/auth/signin')
 */
export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (!API_BASE_URL) return cleanPath;
  return `${API_BASE_URL}${cleanPath}`;
}
