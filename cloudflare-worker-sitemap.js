/**
 * Cloudflare Worker to enforce correct Content-Type for sitemap.xml
 * 
 * Deploy this worker and create a route for: mangabeira.net/sitemap.xml
 * 
 * This ensures the sitemap is always served with:
 * - Content-Type: application/xml; charset=utf-8
 * - Proper cache and security headers
 */

export default {
  async fetch(request, env, ctx) {
    // Fetch the original response from origin
    const response = await fetch(request);
    
    // Clone the response so we can modify headers
    const newResponse = new Response(response.body, response);
    
    // Set the correct headers
    newResponse.headers.set('Content-Type', 'application/xml; charset=utf-8');
    newResponse.headers.set('Cache-Control', 'public, max-age=0, must-revalidate, no-cache, no-store, no-transform');
    newResponse.headers.set('X-Content-Type-Options', 'nosniff');
    
    return newResponse;
  }
};
