import React from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

// Remove the static prerender block from #root before React mounts so the
// crawler-visible HTML never duplicates with the hydrated React tree.
const rootEl = document.getElementById("root")!;
const prerenderBlock = rootEl.querySelector('[data-prerender="true"]');
if (prerenderBlock) prerenderBlock.remove();

createRoot(rootEl).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
