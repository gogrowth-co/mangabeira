

# DeFi Tokenomics Simulator — Updated Implementation Plan

## Scope Changes from Original Plan
- Do NOT modify `Header.tsx` -- the "Tools" nav item is a `#tools` jumplink, not a route
- Do NOT create `src/pages/Tools.tsx` or `/tools` index routes
- Only create the three simulator routes

## New Files to Create

### 1. `src/tools/tokenomics-simulator/strings.ts`
All translations (en, ptBR, es) as specified in the prompt. Self-contained, does not use the CSV system.

### 2. `src/tools/tokenomics-simulator/engine.ts`
Pure TypeScript simulation engine:
- `simulateTokenomics(params)` -- 5-year loop (emission, staking, rewards, burn, dilution)
- `formatNumber(n)` -- K/M/B formatting
- `parseSupply(input)` -- parses "1B", "500M", etc.
- `encodeParamsToURL()` / `decodeParamsFromURL()` -- URL query string sync

### 3. `src/tools/tokenomics-simulator/TokenomicsSimulatorPage.tsx`
Main page component accepting `lang: "en" | "pt-BR" | "es"`. Manages state, renders Header/Footer, SEO, breadcrumb, info bar, two-column layout. Hydrates from URL params on mount, syncs via `replaceState`.

### 4. `src/tools/tokenomics-simulator/ConfigPanel.tsx`
Left sidebar: token name input, max supply input (K/M/B), 4 preset buttons (2x2), 5 sliders with numeric inputs, reset link.

### 5. `src/tools/tokenomics-simulator/ResultsPanel.tsx`
Right side (`id="results-section"`): export buttons, Year 1 metrics grid (6 cards), line chart, donut chart, scenario table, smart insights, footer strip.

### 6. `src/tools/tokenomics-simulator/MetricCard.tsx`
Reusable card with aqua left border, label, formatted value, color coding for dilution.

### 7. `src/tools/tokenomics-simulator/InsightsPanel.tsx`
Evaluates conditions and renders amber/aqua/green/neutral insight cards.

### 8. `src/tools/tokenomics-simulator/SimulatorSEO.tsx`
Helmet component with per-language title, description, canonical, hreflang, and JSON-LD schema.

## Existing Files to Modify

### `src/App.tsx` -- Add 3 Routes Only
```text
<Route path="/tools/tokenomics-simulator" element={<TokenomicsSimulatorPage lang="en" />} />
<Route path="/br/ferramentas/simulador-tokenomics" element={<TokenomicsSimulatorPage lang="pt-BR" />} />
<Route path="/es/herramientas/simulador-tokenomics" element={<TokenomicsSimulatorPage lang="es" />} />
```
Placed above the dynamic catch-all routes.

### `src/lib/translations.ts` -- Add Tool Path Mapping
Add handling in both `getPathForLocale` and `getPathForLocaleSync` for the tools paths, following the same pattern as the audit page:
- Normalize `/ferramentas` and `/herramientas` to `/tools`
- Map `/tools/tokenomics-simulator` between the three localized URLs

This ensures the language switcher works correctly when on the simulator page.

### `public/_redirects` -- Trailing Slash Rules
Add 301 redirects for the new tool routes with trailing slashes.

## NOT Modified
- `src/components/Header.tsx` -- untouched, `#tools` jumplink stays as-is
- No `src/pages/Tools.tsx` created
- No `/tools`, `/br/ferramentas`, `/es/herramientas` index routes

## Dependencies
- **html2canvas** -- needs to be installed for PNG export
- All others (recharts, lucide-react, sonner, shadcn) already present

## Design
Light-mode tool matching the reference screenshot. Navy headings, aqua accents, gold CTAs, white cards with subtle shadows, 3px aqua left borders on metric cards. Uses existing Tailwind tokens and font families (Poppins/Inter/Montserrat).

## File Structure
```text
src/tools/tokenomics-simulator/
  strings.ts
  engine.ts
  TokenomicsSimulatorPage.tsx
  ConfigPanel.tsx
  ResultsPanel.tsx
  MetricCard.tsx
  InsightsPanel.tsx
  SimulatorSEO.tsx

Modified:
  src/App.tsx              -- 3 new routes
  src/lib/translations.ts  -- tool path locale mapping
  public/_redirects        -- trailing slash rules
```

