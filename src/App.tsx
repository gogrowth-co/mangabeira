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
              <Route path="/publications/web2-vs-web3-marketing" element={<Web2VsWeb3Marketing />} />
              <Route path="/publications/web3-for-athletes" element={<Web3ForAthletes />} />
              <Route path="/publications/definitive-guide-web3-seo" element={<Web3SEO />} />
              <Route path="/publications/vibe-coded-token-health-scan" element={<TokenHealthScan />} />
              
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
