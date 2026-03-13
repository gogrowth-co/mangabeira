import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { LanguageProvider, detectBrowserLanguage } from "./contexts/LanguageContext";
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
import TokenomicsSimulatorPage from "./tools/tokenomics-simulator/TokenomicsSimulatorPage";
import ToolsPage from "./pages/ToolsPage";
import { useEffect } from "react";
import { useIsFetching } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

const PrerenderSignal = () => {
  const isFetching = useIsFetching();
  useEffect(() => {
    if (isFetching === 0) {
      window.prerenderReady = true;
    }
  }, [isFetching]);
  return null;
};

const App = () => {

  // Redirect component defined inside App to ensure proper React context
  const RootRedirect = () => {
    const location = useLocation();
    
    useEffect(() => {
      if (location.pathname === '/') {
        const preferredLang = detectBrowserLanguage();
        if (preferredLang === 'br') {
          window.location.href = '/br';
        } else if (preferredLang === 'es') {
          window.location.href = '/es';
        }
      }
    }, [location.pathname]);

    return <Index />;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <PrerenderSignal />
      <Helmet>
          <meta name="description" content="Gabriel Mangabeira — Olympian turned Growth Marketing Strategist. Blending AI, Web3, and performance marketing to deliver measurable growth." />
          <meta property="og:title" content="Gabriel Mangabeira | Olympian & Growth Marketing Strategist" />
          <meta property="og:description" content="Gabriel Mangabeira — Olympian turned Growth Marketing Strategist. Blending AI, Web3, and performance marketing to deliver measurable growth." />
          <meta name="twitter:title" content="Gabriel Mangabeira | Olympian & Growth Marketing Strategist" />
          <meta name="twitter:description" content="Gabriel Mangabeira — Olympian turned Growth Marketing Strategist. Blending AI, Web3, and performance marketing to deliver measurable growth." />
        </Helmet>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <LanguageProvider>
              <Routes>
              <Route path="/" element={<RootRedirect />} />
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
              <Route path="/br/servicos/web3-auditoria-de-growth" element={<Web3GrowthAudit />} />
              <Route path="/es/servicios/web3-auditoria-de-growth" element={<Web3GrowthAudit />} />
              
              {/* Redirects for audit pages without locale prefix */}
              <Route path="/servicos/web3-auditoria-de-growth" element={<Navigate to="/br/servicos/web3-auditoria-de-growth" replace />} />
              <Route path="/servicios/web3-auditoria-de-growth" element={<Navigate to="/es/servicios/web3-auditoria-de-growth" replace />} />
              
              {/* RSS feeds */}
              <Route path="/rss/:lang.xml" element={<RssFeed />} />
              
              {/* Redirects for incorrect system page URLs */}
              <Route path="/br/about" element={<Navigate to="/br/sobre" replace />} />
              <Route path="/es/about" element={<Navigate to="/es/acerca-de" replace />} />
              <Route path="/br/privacy-policy" element={<Navigate to="/br/politica-de-privacidade" replace />} />
              <Route path="/es/privacy-policy" element={<Navigate to="/es/politica-de-privacidade" replace />} />
              
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
              
              {/* Auth route */}
              <Route path="/auth" element={<Auth />} />
              
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
