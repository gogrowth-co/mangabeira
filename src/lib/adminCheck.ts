export function isDevMode(): boolean {
  return import.meta.env.DEV || window.location.hostname === 'localhost';
}
