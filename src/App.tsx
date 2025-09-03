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
import PerfilFamilia from "./app/pages/PerfilFamilia";
import AdminDashboard from "./app/pages/AdminDashboard"; // ✨ ADMIN
import UserManagement from "./app/pages/UserManagement"; // ✨ ADMIN
import TiposContribuicaoManagement from "./app/pages/TiposContribuicaoManagement"; // ✨ CONTRIBUIÇÕES
import TagsManagement from "./app/pages/TagsManagement"; // ✨ CONTRIBUIÇÕES
import MinhasContribuicoes from "./app/pages/MinhasContribuicoes"; // ✨ CONTRIBUIÇÕES USUÁRIO
import MinhasContribuicoesUnificadas from "./app/pages/MinhasContribuicoesUnificadas"; // ✨ CONTRIBUIÇÕES UNIFICADAS
import ContribuicoesPorTipo from "./app/pages/ContribuicoesPorTipo"; // ✨ MENU DINÂMICO
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import SinergIA from "./app/pages/SinergIA";
import DadosProfissionaisAdmin from "./app/pages/DadosProfissionaisAdmin"; // ✨ DADOS PROFISSIONAIS ADMIN
import ExperienciasProfissionais from "./app/pages/ExperienciasProfissionais"; // ✨ DADOS PROFISSIONAIS
import FormacaoAcademica from "./app/pages/FormacaoAcademica"; // ✨ DADOS PROFISSIONAIS
import IdiomasConhecidos from "./app/pages/IdiomasConhecidos"; // ✨ DADOS PROFISSIONAIS

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
            <Route path="perfil-familia" element={<PerfilFamilia />} />
            <Route path="admin-dashboard" element={<AdminDashboard />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="tipos-contribuicao" element={<TiposContribuicaoManagement />} />
            <Route path="tags-management" element={<TagsManagement />} />
            <Route path="contribuicoes/:tipoId" element={<ContribuicoesPorTipo />} />
            <Route path="minhas-contribuicoes" element={<MinhasContribuicoesUnificadas />} />
            <Route path="sinergia" element={<SinergIA />} />
            <Route path="dados-profissionais-admin" element={<DadosProfissionaisAdmin />} />
            <Route path="dados-profissionais/experiencias" element={<ExperienciasProfissionais />} />
            <Route path="dados-profissionais/formacao" element={<FormacaoAcademica />} />
            <Route path="dados-profissionais/idiomas" element={<IdiomasConhecidos />} />
          </Route>
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
