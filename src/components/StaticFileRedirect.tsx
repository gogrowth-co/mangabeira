import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component that handles static file requests (.xml, .txt, etc.)
 * by preventing React Router from processing them and forcing a proper static file load
 */
export default function StaticFileRedirect() {
  const location = useLocation();

  useEffect(() => {
    // Force a full page reload to let Netlify serve the static file
    // This bypasses React Router and lets the _redirects file handle it properly
    window.location.href = location.pathname;
  }, [location.pathname]);

  // Show a brief loading message while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Loading...</div>
    </div>
  );
}
