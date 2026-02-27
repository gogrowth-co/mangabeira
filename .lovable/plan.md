

# Delete Static Sitemap File

## What
Delete `public/sitemap.xml` since the Netlify function at `/.netlify/functions/sitemap` is confirmed working. The static file takes precedence over the `_redirects` rewrite rule, preventing the dynamic sitemap from being served.

## Change
- **Delete `public/sitemap.xml`** -- removes the static file so the `_redirects` rule can properly route `/sitemap.xml` requests to the Netlify function.

No other files need to change.

