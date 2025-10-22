import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Afiliados from "./pages/Afiliados";
import AreaVip from "./pages/AreaVip";
import Recomendacoes from "./pages/Recomendacoes";
import Newsletter from "./pages/Newsletter";
import Login from "./pages/Login";
import Checkout from "./pages/Checkout";
import Ebook from "./pages/Ebook";
import RiskCalculator from "./components/tools/RiskCalculator";
import PerformanceDashboard from "./components/tools/PerformanceDashboard";
import PortfolioAnalysis from "./components/tools/PortfolioAnalysis";
import MonthlyReports from "./components/tools/MonthlyReports";
import PremiumSignals from "./components/tools/PremiumSignals";
import EconomicCalendar from "./components/tools/EconomicCalendar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/afiliados" element={<Afiliados />} />
            <Route path="/login" element={<Login />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route 
              path="/area-vip" 
              element={
                <ProtectedRoute>
                  <AreaVip />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/area-vip/ebook" 
              element={
                <ProtectedRoute>
                  <Ebook />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/area-vip/risk-calculator"
              element={
                <ProtectedRoute>
                  <RiskCalculator />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/area-vip/performance-dashboard" 
              element={
                <ProtectedRoute>
                  <PerformanceDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/area-vip/portfolio-analysis" 
              element={
                <ProtectedRoute>
                  <PortfolioAnalysis />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/area-vip/monthly-reports" 
              element={
                <ProtectedRoute>
                  <MonthlyReports />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/area-vip/premium-signals" 
              element={
                <ProtectedRoute>
                  <PremiumSignals />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/area-vip/economic-calendar" 
              element={
                <ProtectedRoute>
                  <EconomicCalendar />
                </ProtectedRoute>
              } 
            />
            <Route path="/recomendacoes" element={<Recomendacoes />} />
            <Route path="/newsletter" element={<Newsletter />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
