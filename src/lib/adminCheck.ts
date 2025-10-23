export function isDevMode(): boolean {
  const isDev = import.meta.env.DEV;
  const isLocalhost = window.location.hostname === 'localhost';
  const isLovable = window.location.hostname.includes('lovableproject.com');
  
  // Admin only accessible on development environments
  // NOT accessible on production (mangabeira.net)
  return isDev || isLocalhost || isLovable;
}
