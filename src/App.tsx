import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./institutional/pages/LandingPage";
import AppLayout from "./app/layouts/AppLayout";
import Dashboard from "./app/pages/Dashboard";
import Profile from "./app/pages/Profile";
import PerfilImigrante from "./app/pages/PerfilImigrante";
import PerfilEmpresa from "./app/pages/PerfilEmpresa";
import PerfilMunicipio from "./app/pages/PerfilMunicipio";
import PerfilAcademia from "./app/pages/PerfilAcademia";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Página Institucional - Marketing */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Aplicação - Desenvolvimento */}
          <Route path="/app" element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="perfil-imigrante" element={<PerfilImigrante />} />
            <Route path="perfil-empresa" element={<PerfilEmpresa />} />
            <Route path="perfil-municipio" element={<PerfilMunicipio />} />
            <Route path="perfil-academia" element={<PerfilAcademia />} />
          </Route>
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
