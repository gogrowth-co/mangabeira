import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Web2VsWeb3Marketing from "./pages/Web2VsWeb3Marketing";
import Web3ForAthletes from "./pages/Web3ForAthletes";
import Web3SEO from "./pages/Web3SEO";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/publications/web2-vs-web3-marketing" element={<Web2VsWeb3Marketing />} />
          <Route path="/publications/web3-for-athletes" element={<Web3ForAthletes />} />
          <Route path="/publications/definitive-guide-web3-seo" element={<Web3SEO />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
