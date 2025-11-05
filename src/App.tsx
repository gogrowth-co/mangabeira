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
import SitemapViewer from "./pages/SitemapViewer";
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
              
              {/* Redirects for incorrect system page URLs */}
              <Route path="/br/about" element={<Navigate to="/br/sobre" replace />} />
              <Route path="/es/about" element={<Navigate to="/es/acerca-de" replace />} />
              <Route path="/br/privacy-policy" element={<Navigate to="/br/politica-de-privacidade" replace />} />
              <Route path="/es/privacy-policy" element={<Navigate to="/es/politica-de-privacidade" replace />} />
              
              {/* Publications hub */}
              <Route path="/publications" element={<Publications />} />
              <Route path="/br/artigos" element={<PublicationsBR />} />
              <Route path="/es/articulos" element={<PublicationsES />} />
              
              {/* English publication routes */}
              <Route path="/publications/web3-for-athletes" element={<Web3ForAthletes />} />
              <Route path="/publications/web2-vs-web3-marketing" element={<Web2VsWeb3Marketing />} />
              <Route path="/publications/definitive-guide-web3-seo" element={<Web3SEO />} />
              <Route path="/publications/vibe-coded-token-health-scan" element={<TokenHealthScan />} />
              
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
              
              {/* Admin routes - dev only */}
              {isDevMode() && (
                <>
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/new" element={<AdminNew />} />
                  <Route path="/admin/edit/:id" element={<AdminEdit />} />
                  <Route path="/admin/edit/:id/:lang" element={<AdminEditLanguage />} />
                </>
              )}

              {/* Sitemap viewer for humans */}
              <Route path="/sitemap-viewer" element={<SitemapViewer />} />

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
