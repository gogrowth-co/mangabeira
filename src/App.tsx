import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/hooks/useLanguage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Web2VsWeb3Marketing from "./pages/Web2VsWeb3Marketing";
import Web3ForAthletes from "./pages/Web3ForAthletes";
import Web3SEO from "./pages/Web3SEO";
import TokenHealthScan from "./pages/TokenHealthScan";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/publications/web2-vs-web3-marketing" element={<Web2VsWeb3Marketing />} />
            <Route path="/publications/web3-for-athletes" element={<Web3ForAthletes />} />
            <Route path="/publications/definitive-guide-web3-seo" element={<Web3SEO />} />
            <Route path="/publications/vibe-coded-token-health-scan" element={<TokenHealthScan />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
