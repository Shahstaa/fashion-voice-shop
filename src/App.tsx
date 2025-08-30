import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { VoiceProvider } from "@/contexts/VoiceContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProductDataProvider } from "@/contexts/ProductDataContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MerchantIndex from "./pages/MerchantIndex";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <ProductDataProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <VoiceProvider>
                  <Routes>
                    {/* Main app routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/categories" element={<Index />} />
                    <Route path="/categories/:category" element={<Index />} />
                    <Route path="/categories/:category/:subcategory" element={<Index />} />
                    <Route path="/product/:category/:subcategory/:productId" element={<Index />} />
                    <Route path="/cart" element={<Index />} />
                    
                    {/* Merchant routes */}
                    <Route path="/merchant" element={<MerchantIndex />} />
                    
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </VoiceProvider>
              </BrowserRouter>
            </ProductDataProvider>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
