import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { LanguageProvider, detectBrowserLanguage } from "./contexts/LanguageContext";
import Index from "./pages/Index";
import IndexBR from "./pages/IndexBR";
import IndexES from "./pages/IndexES";
import NotFound from "./pages/NotFound";
import Web2VsWeb3Marketing from "./pages/Web2VsWeb3Marketing";
import Web3ForAthletes from "./pages/Web3ForAthletes";
import Web3SEO from "./pages/Web3SEO";
import TokenHealthScan from "./pages/TokenHealthScan";
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
import { useEffect } from "react";
import { isDevMode } from "./lib/adminCheck";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

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
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <LanguageProvider>
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route path="/br" element={<IndexBR />} />
              <Route path="/es" element={<IndexES />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              
              {/* Publications hub */}
              <Route path="/publications" element={<Publications />} />
              <Route path="/br/artigos" element={<PublicationsBR />} />
              <Route path="/es/articulos" element={<PublicationsES />} />
              
              {/* Publication routes now handled by DynamicPage with localized slug support */}
              
              {/* Redirect old incorrect slugs to correct ones */}
              <Route path="/web3-seo-guide" element={<Navigate to="/publications/definitive-guide-web3-seo" replace />} />
              <Route path="/token-health-scan" element={<Navigate to="/publications/vibe-coded-token-health-scan" replace />} />
              <Route path="/br/web3-seo-guide" element={<Navigate to="/br/artigos/definitive-guide-web3-seo" replace />} />
              <Route path="/br/token-health-scan" element={<Navigate to="/br/artigos/vibe-coded-token-health-scan" replace />} />
              <Route path="/es/web3-seo-guide" element={<Navigate to="/es/articulos/definitive-guide-web3-seo" replace />} />
              <Route path="/es/token-health-scan" element={<Navigate to="/es/articulos/vibe-coded-token-health-scan" replace />} />
              
              {/* Admin routes - dev only */}
              {isDevMode() && (
                <>
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/new" element={<AdminNew />} />
                  <Route path="/admin/edit/:id" element={<AdminEdit />} />
                  <Route path="/admin/edit/:id/:lang" element={<AdminEditLanguage />} />
                </>
              )}
              
              {/* Dynamic pages */}
              <Route path="/br/:slug" element={<DynamicPage />} />
              <Route path="/es/:slug" element={<DynamicPage />} />
              <Route path="/:slug" element={<DynamicPage />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </LanguageProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
