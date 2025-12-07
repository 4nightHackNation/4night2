import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
import { CookieConsent } from "@/components/CookieConsent";
import Index from "./pages/Index";
import CategoryPage from "./pages/CategoryPage";
import ActDetailPage from "./pages/ActDetailPage";
import EditorPage from "./pages/EditorPage";
import AllActsPage from "./pages/AllActsPage";
import CitizenProfilePage from "./pages/CitizenProfilePage";
import OfficerProjectsPage from "./pages/OfficerProjectsPage";
import AdminManagementPage from "./pages/AdminManagementPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CookieConsentProvider>
      <AccessibilityProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <CookieConsent />
            <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/kategoria/:categoryId" element={<CategoryPage />} />
              <Route path="/akt/:actId" element={<ActDetailPage />} />
              <Route path="/edytor" element={<EditorPage />} />
              <Route path="/wszystkie" element={<AllActsPage />} />
              <Route path="/obywatel" element={<CitizenProfilePage />} />
              <Route path="/moje-projekty" element={<OfficerProjectsPage />} />
              <Route path="/admin-zarzadzanie" element={<AdminManagementPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </AccessibilityProvider>
    </CookieConsentProvider>
  </QueryClientProvider>
);export default App;
