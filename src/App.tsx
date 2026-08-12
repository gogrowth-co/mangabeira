import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import IndexBR from "./pages/IndexBR";
import IndexES from "./pages/IndexES";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Admin from "./pages/Admin";
import AdminNew from "./pages/AdminNew";
import AdminEdit from "./pages/AdminEdit";
import AdminEditLanguage from "./pages/AdminEditLanguage";
import DynamicPage from "./pages/DynamicPage";
import Publications from "./pages/Publications";
import PublicationsBR from "./pages/PublicationsBR";
import PublicationsES from "./pages/PublicationsES";
import Auth from "./pages/Auth";
import RssFeed from "./pages/RssFeed";
import Web3GrowthAudit from "./pages/Web3GrowthAudit";
import AuditPaymentSuccess from "./pages/AuditPaymentSuccess";
import AuditLandingV2 from "./pages/AuditLandingV2";
import TokenomicsSimulatorPage from "./tools/tokenomics-simulator/TokenomicsSimulatorPage";
import ToolsPage from "./pages/ToolsPage";
import OAuthConsent from "./pages/OAuthConsent";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <LanguageProvider>
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/br" element={<IndexBR />} />
              <Route path="/es" element={<IndexES />} />
              
              {/* Tools */}
              <Route path="/tools" element={<ToolsPage lang="en" />} />
              <Route path="/br/ferramentas" element={<ToolsPage lang="pt-BR" />} />
              <Route path="/es/herramientas" element={<ToolsPage lang="es" />} />
              <Route path="/br/tools" element={<Navigate to="/br/ferramentas" replace />} />
              <Route path="/es/tools" element={<Navigate to="/es/herramientas" replace />} />

              {/* Tools - Tokenomics Simulator */}
              <Route path="/tools/tokenomics-simulator" element={<TokenomicsSimulatorPage lang="en" />} />
              <Route path="/br/ferramentas/simulador-tokenomics" element={<TokenomicsSimulatorPage lang="pt-BR" />} />
              <Route path="/es/herramientas/simulador-tokenomics" element={<TokenomicsSimulatorPage lang="es" />} />
              
              {/* Web3 Growth Audit */}
              <Route path="/services/web3-growth-audit" element={<Web3GrowthAudit />} />
              <Route path="/services/web3-growth-audit/payment-success" element={<AuditPaymentSuccess />} />
              {/* Every Stripe Payment Link redirects here after checkout, and the
                  component's own canonical is this URL — but the route was missing,
                  so buyers landed on the 404 page after paying. Live since the $97
                  promo launched 2026-08-04. Added 2026-08-12. */}
              <Route path="/audit-payment-success" element={<AuditPaymentSuccess />} />
              <Route path="/br/servicos/web3-auditoria-de-growth" element={<Web3GrowthAudit />} />
              <Route path="/es/servicios/web3-auditoria-de-growth" element={<Web3GrowthAudit />} />

              {/* Retired 2026-08-12. The old ads landing page is no longer live;
                  redirected rather than 404'd so any stray ad or email link still
                  lands on the real service page. src/pages/AuditLanding.tsx is kept
                  in the repo, so restoring is just re-adding its import and route.
                  Dropping the import also keeps that page's code and images out of
                  the bundle. */}
              <Route
                path="/audit"
                element={<Navigate to="/services/web3-growth-audit" replace />}
              />

              {/* Test landing page from the Claude Design prototype. noindex; not in site nav. */}
              <Route path="/lp/web3-growth-audit-v2" element={<AuditLandingV2 />} />
              
              {/* Redirects for audit pages without locale prefix */}
              <Route path="/servicos/web3-auditoria-de-growth" element={<Navigate to="/br/servicos/web3-auditoria-de-growth" replace />} />
              <Route path="/servicios/web3-auditoria-de-growth" element={<Navigate to="/es/servicios/web3-auditoria-de-growth" replace />} />
              
              {/* RSS feeds */}
              <Route path="/rss/:lang.xml" element={<RssFeed />} />
              
              {/* System pages (About + Privacy) — explicit routes so direct
                  navigation / hard refresh works without falling through to
                  the dynamic /:slug catch-all. */}
              <Route path="/about" element={<About />} />
              <Route path="/br/sobre" element={<About />} />
              <Route path="/es/acerca-de" element={<About />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/br/politica-de-privacidade" element={<PrivacyPolicy />} />
              <Route path="/es/politica-de-privacidad" element={<PrivacyPolicy />} />

              {/* Redirects for incorrect system page URLs */}
              <Route path="/br/about" element={<Navigate to="/br/sobre" replace />} />
              <Route path="/es/about" element={<Navigate to="/es/acerca-de" replace />} />
              <Route path="/br/privacy-policy" element={<Navigate to="/br/politica-de-privacidade" replace />} />
              <Route path="/es/privacy-policy" element={<Navigate to="/es/politica-de-privacidad" replace />} />
              
              {/* Publications hub */}
              <Route path="/publications" element={<Publications />} />
              <Route path="/br/artigos" element={<PublicationsBR />} />
              <Route path="/es/articulos" element={<PublicationsES />} />
              
              {/* English publication routes - load from database via DynamicPage */}
              <Route path="/publications/:slug" element={<DynamicPage />} />
              
              {/* Portuguese routes (BR) - load from database via DynamicPage */}
              <Route path="/br/artigos/:slug" element={<DynamicPage />} />
              
              {/* Spanish routes (ES) - load from database via DynamicPage */}
              <Route path="/es/articulos/:slug" element={<DynamicPage />} />
              
              {/* Redirect old incorrect slugs to correct ones */}
              <Route path="/web3-seo-guide" element={<Navigate to="/publications/definitive-guide-web3-seo" replace />} />
              <Route path="/token-health-scan" element={<Navigate to="/publications/vibe-coded-token-health-scan" replace />} />
              <Route path="/br/web3-seo-guide" element={<Navigate to="/br/artigos/definitive-guide-web3-seo" replace />} />
              <Route path="/br/token-health-scan" element={<Navigate to="/br/artigos/vibe-coded-token-health-scan" replace />} />
              <Route path="/es/web3-seo-guide" element={<Navigate to="/es/articulos/definitive-guide-web3-seo" replace />} />
              <Route path="/es/token-health-scan" element={<Navigate to="/es/articulos/vibe-coded-token-health-scan" replace />} />
              <Route path="/es/articulos/estudo-de-caso-defi-avici" element={<Navigate to="/es/articulos/estudio-de-caso-defi-avici" replace />} />
              
              {/* Auth route */}
              <Route path="/auth" element={<Auth />} />

              {/* MCP OAuth consent screen */}
              <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />
              
              {/* Admin routes - requires authentication */}
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/new" element={<AdminNew />} />
              <Route path="/admin/edit/:id" element={<AdminEdit />} />
              <Route path="/admin/edit/:id/:lang" element={<AdminEditLanguage />} />
              
              {/* Dynamic pages */}
              <Route path="/br/:slug" element={<DynamicPage />} />
              <Route path="/es/:slug" element={<DynamicPage />} />
              <Route path="/:slug" element={<DynamicPage />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
              </Routes>
            </LanguageProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
