

# Plan: Create `/tools` Page

## New File

### `src/pages/ToolsPage.tsx`
- Standalone page with Header, Footer, and Helmet SEO metadata
- Page header: centered H1 "Tools" (Montserrat Bold, navy) + subtitle (Inter 18px, charcoal/60)
- 2-column grid (desktop) / 1-column (mobile) of 5 tool cards
- Each card: white bg, 12px radius, shadow-sm → hover:shadow-md, border
  - Top-right category badge (rounded-full pill)
  - Top-left icon (40px colored square)
  - Title (Montserrat SemiBold 18px navy) + description (Inter 14px)
  - Dark placeholder div (aspect-video, rounded-lg) with tool name centered in white; DeFi Tokenomics Simulator gets aqua subtitle "5-Year Token Projections"
  - Tech stack tag pills (gray bg, rounded-full)
  - Bottom row: year left + gold CTA button right
- CTA: React Router `<Link>` for internal tools, `<a target="_blank">` for external
- Helmet: title, description, canonical as specified

## Modified File

### `src/App.tsx`
- Add `import ToolsPage from "./pages/ToolsPage"` 
- Add `<Route path="/tools" element={<ToolsPage />} />` above the tokenomics simulator route (around line 82)

No other files touched.

