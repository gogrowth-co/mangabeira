

# Fix: Add `/tools` route mapping in `getPathForLocaleSync`

## Problem
The `getPathForLocaleSync` function in `src/lib/translations.ts` has no explicit handler for the bare `/tools` path. When the language switcher switches from EN to BR, it falls through to line 331-332 which produces `/${locale}/tools` → `/br/tools` (404) instead of `/br/ferramentas`.

Compare with `/publications` which has an explicit handler at line 307-311.

## Fix

In `src/lib/translations.ts`, add a `/tools` handler block (similar to the `/publications` block) before the fallback at line 331:

```typescript
if (cleanPath === '/tools') {
  if (locale === 'br') return '/br/ferramentas';
  if (locale === 'es') return '/es/herramientas';
  return '/tools';
}
```

Insert this between the `/publications/` block (ending line 329) and the fallback (line 331).

**Single file change, 4 lines added.** No other files modified.

