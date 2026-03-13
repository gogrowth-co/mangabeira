import React from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from 'react-helmet-async';
import App from "./App.tsx";
import "./index.css";

// Signal for Netlify Prerender Extension — set to true once app has mounted
declare global {
  interface Window { prerenderReady: boolean; }
}
window.prerenderReady = false;

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
