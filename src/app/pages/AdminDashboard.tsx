import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'shards-react';
import PageTitle from '../components/common/PageTitle';
import SmallStats from '../components/common/SmallStats';

interface AdminStats {
  totalUsers: number;
  usersByCategory: {
    IMIGRANTE: number;
    EMPRESA: number;
    MUNICIPIO: number;
    ACADEMIA: number;
    FAMILIA_ACOLHIMENTO: number;
    ADMIN: number;
  };
  recentUsers: number;
  profilesCompleted: number;
}

interface ContribuicoesStats {
  totalTipos: number;
  totalTags: number;
  totalContribuicoes: number;
  tagsComUso: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [contribuicoesStats, setContribuicoesStats] = useState<ContribuicoesStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsRes, contribuicoesRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/contribuicoes/stats')
      ]);

      const statsData = await statsRes.json();
      const contribuicoesData = await contribuicoesRes.json();
      
      if (statsData.success) {
        setStats(statsData.data);
      } else {
        setError(statsData.error || 'Erro ao carregar estatísticas');
      }

      if (contribuicoesData.success) {
        setContribuicoesStats(contribuicoesData.data.resumo);
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      setError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchAdminStats();
  };

  if (loading) {
    return (
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
          <PageTitle 
            title="Dashboard Administrativo" 
            subtitle="Carregando..."
            className="text-sm-left mb-3" 
          />
        </Row>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Carregando...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
          <PageTitle 
            title="Dashboard Administrativo" 
            subtitle="Erro"
            className="text-sm-left mb-3" 
          />
        </Row>
        <div className="alert alert-danger">
          <h5>Erro ao carregar dashboard</h5>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={handleRefresh}>
            Tentar Novamente
          </button>
        </div>
      </Container>
    );
  }

  const adminStats = [
    {
      label: "Total de Usuários",
      value: stats?.totalUsers || 0,
      percentage: "Registrados",
      increase: true,
      attrs: { md: "6", sm: "6" }
    },
    {
      label: "Imigrantes",
      value: stats?.usersByCategory?.IMIGRANTE || 0,
      percentage: "Perfis",
      increase: true,
      attrs: { md: "6", sm: "6" }
    },
    {
      label: "Empresas",
      value: stats?.usersByCategory?.EMPRESA || 0,
      percentage: "Ativas",
      increase: true,
      attrs: { md: "6", sm: "6" }
    },
    {
      label: "Municípios",
      value: stats?.usersByCategory?.MUNICIPIO || 0,
      percentage: "Parceiros",
      increase: true,
      attrs: { md: "6", sm: "6" }
    },
    {
      label: "Academias",
      value: stats?.usersByCategory?.ACADEMIA || 0,
      percentage: "Formação",
      increase: true,
      attrs: { md: "6", sm: "6" }
    },
    {
      label: "Famílias",
      value: stats?.usersByCategory?.FAMILIA_ACOLHIMENTO || 0,
      percentage: "Acolhimento",
      increase: true,
      attrs: { md: "6", sm: "6" }
    },
    {
      label: "Novos (7 dias)",
      value: stats?.recentUsers || 0,
      percentage: "Recentes",
      increase: true,
      attrs: { md: "6", sm: "6" }
    },
    {
      label: "Perfis Completos",
      value: stats?.profilesCompleted || 0,
      percentage: "Finalizados",
      increase: true,
      attrs: { md: "6", sm: "6" }
    }
  ];

  // Estatísticas de contribuições
  const contribuicoesStatsCards = [
    {
      label: "Total Contribuições",
      value: contribuicoesStats?.totalContribuicoes || 0,
      percentage: "Ativas",
      increase: true,
      attrs: { md: "6", sm: "6" }
    },
    {
      label: "Tipos Configurados",
      value: contribuicoesStats?.totalTipos || 0,
      percentage: "Disponíveis",
      increase: true,
      attrs: { md: "6", sm: "6" }
    },
    {
      label: "Tags no Sistema",
      value: contribuicoesStats?.totalTags || 0,
      percentage: "Cadastradas",
      increase: true,
      attrs: { md: "6", sm: "6" }
    },
    {
      label: "Tags em Uso",
      value: contribuicoesStats?.tagsComUso || 0,
      percentage: "Utilizadas",
      increase: true,
      attrs: { md: "6", sm: "6" }
    }
  ];

  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle 
          title="Dashboard Administrativo" 
          subtitle="Visão Geral da Plataforma" 
          className="text-sm-left mb-3" 
        />
      </Row>

      {/* Small Stats Blocks - REUTILIZA COMPONENTE EXISTENTE */}
      <Row>
        {adminStats.map((stat, idx) => (
          <Col className="col-lg mb-4" key={idx} {...stat.attrs}>
            <SmallStats
              id={`admin-stats-${idx}`}
              variation="1"
              label={stat.label}
              value={stat.value}
              percentage={stat.percentage}
              increase={stat.increase}
            />
          </Col>
        ))}
      </Row>

      {/* Estatísticas de Contribuições */}
      <Row className="mb-4">
        <Col>
          <div className="card small">
            <div className="card-header border-bottom d-flex justify-content-between align-items-center">
              <h6 className="m-0">Sistema de Contribuições</h6>
              <div>
                <Button
                  size="sm"
                  theme="outline-primary"
                  className="mr-2"
                  onClick={() => window.location.href = '/app/tipos-contribuicao'}
                >
                  <i className="material-icons mr-1">category</i>
                  Tipos
                </Button>
                <Button
                  size="sm"
                  theme="outline-secondary"
                  onClick={() => window.location.href = '/app/tags-management'}
                >
                  <i className="material-icons mr-1">local_offer</i>
                  Tags
                </Button>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        {contribuicoesStatsCards.map((stat, idx) => (
          <Col className="col-lg mb-4" key={idx} {...stat.attrs}>
            <SmallStats
              id={`contribuicoes-stats-${idx}`}
              variation="1"
              label={stat.label}
              value={stat.value}
              percentage={stat.percentage}
              increase={stat.increase}
            />
          </Col>
        ))}
      </Row>

      {/* Summary Cards */}
      <Row>
        <Col lg="8" md="12" sm="12" className="mb-4">
          <div className="card small">
            <div className="card-header border-bottom">
              <h6 className="m-0">Resumo da Plataforma</h6>
            </div>
            <div className="card-body">
              <h4 className="mb-3" style={{ color: '#F5A623' }}>
                Plataforma Madrilusa - Painel Administrativo
              </h4>
              <p className="text-muted mb-4">
                Gerencie usuários registrados, acompanhe estatísticas e mantenha 
                a plataforma funcionando de forma otimizada.
              </p>
              
              <div className="bg-light border rounded p-3">
                <h6 className="mb-2" style={{ color: '#4A90A4' }}>Ações Disponíveis</h6>
                <ul className="mb-0 text-muted small">
                  <li>Visualizar totalizadores por categoria de usuário</li>
                  <li>Gerir informações de usuários registrados</li>
                  <li>Filtrar e buscar perfis específicos</li>
                  <li>Editar ou remover contas conforme necessário</li>
                </ul>
              </div>
            </div>
          </div>
        </Col>

        <Col lg="4" md="6" sm="12" className="mb-4">
          <div className="card small">
            <div className="card-header border-bottom">
              <h6 className="m-0">Ações Rápidas</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <a href="/app/user-management" className="btn btn-primary btn-sm btn-block">
                  <i className="material-icons mr-1">group</i>
                  Gerir Usuários
                </a>
              </div>
              
              <div className="mb-3">
                <button 
                  className="btn btn-outline-primary btn-sm btn-block" 
                  onClick={handleRefresh}
                  disabled={loading}
                >
                  <i className="material-icons mr-1">refresh</i>
                  Atualizar Dados
                </button>
              </div>
              
              <div>
                <a href="/app/profile" className="btn btn-outline-secondary btn-sm btn-block">
                  <i className="material-icons mr-1">person</i>
                  Meu Perfil
                </a>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard; 