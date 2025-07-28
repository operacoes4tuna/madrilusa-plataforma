import React from 'react';
import { Container, Row, Col } from 'shards-react';

import PageTitle from '../components/common/PageTitle';
import SmallStats from '../components/common/SmallStats';
import { useAuth } from '@/modules/auth/hooks/useAuth';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Calcular dias na plataforma
  const diasNaPlataforma = user?.createdAt 
    ? Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  // Métricas simplificadas sem gráficos
  const smallStats = [
    {
      label: "Perfil Completo",
      value: "100%",
      percentage: "Verificado",
      increase: true,
      attrs: { md: "6", sm: "6" }
    },
    {
      label: "Dias na Plataforma",
      value: diasNaPlataforma,
      percentage: "Activo",
      increase: true,
      attrs: { md: "6", sm: "6" }
    },
    {
      label: "Estado da Conta",
      value: "Activa",
      percentage: "Verificada",
      increase: true,
      attrs: { md: "6", sm: "6" }
    },
    {
      label: "Último Acesso",
      value: "Hoje",
      percentage: "Recente",
      increase: true,
      attrs: { md: "6", sm: "6" }
    }
  ];

  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle 
          title="Dashboard" 
          subtitle="Visão Geral" 
          className="text-sm-left mb-3" 
        />
      </Row>

      {/* Small Stats Blocks */}
      <Row>
        {smallStats.map((stats, idx) => (
          <Col className="col-lg mb-4" key={idx} {...stats.attrs}>
            <SmallStats
              id={`small-stats-${idx}`}
              variation="1"
              label={stats.label}
              value={stats.value}
              percentage={stats.percentage}
              increase={stats.increase}
            />
          </Col>
        ))}
      </Row>

      {/* Welcome Section */}
      <Row>
        <Col lg="8" md="12" sm="12" className="mb-4">
          <div className="card small">
            <div className="card-header border-bottom">
              <h6 className="m-0">Bem-vindo ao Portal Madrilusa</h6>
            </div>
            <div className="card-body">
              <h4 className="mb-3">Olá, {user?.nomeCompleto}!</h4>
              <p className="text-muted mb-4">
                Este é o seu espaço pessoal onde pode gerir as suas informações e acompanhar 
                o seu progresso na plataforma Madrilusa. Explore as funcionalidades disponíveis 
                através do menu lateral.
              </p>
              
              <div className="bg-light border rounded p-3">
                <h6 className="mb-2" style={{ color: '#F5A623' }}>Próximos Passos</h6>
                <ul className="mb-0 text-muted small">
                  <li>Complete o seu perfil com todas as informações</li>
                  <li>Explore as funcionalidades disponíveis</li>
                  <li>Mantenha os seus dados actualizados</li>
                </ul>
              </div>
            </div>
          </div>
        </Col>

        <Col lg="4" md="6" sm="12" className="mb-4">
          <div className="card small">
            <div className="card-header border-bottom">
              <h6 className="m-0">Resumo da Conta</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <strong className="text-muted d-block mb-1">Nome Completo</strong>
                <span>{user?.nomeCompleto}</span>
              </div>
              
              <div className="mb-3">
                <strong className="text-muted d-block mb-1">Email</strong>
                <span>{user?.email}</span>
              </div>
              
              <div className="mb-3">
                <strong className="text-muted d-block mb-1">Membro desde</strong>
                <span>
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-PT', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </span>
              </div>
              
              <div>
                <strong className="text-muted d-block mb-1">Estado da Conta</strong>
                <span className="badge badge-success">Activa</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard; 