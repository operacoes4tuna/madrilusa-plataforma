import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  CardBody, 
  CardHeader,
  Button,
  Badge,
  Progress
} from 'shards-react';
import PageTitle from '../components/common/PageTitle';
import { useToast } from '@/hooks/use-toast';
import { useSinergiaV2 } from '../../hooks/useSinergiaV2';
import type { 
  DetailedStats,
  CostMetrics,
  PerformanceMetrics
} from '../../types/sinergia-v2.types';

const SinergiaV2Admin: React.FC = () => {
  const [detailedStats, setDetailedStats] = useState<DetailedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const { toast } = useToast();
  const { getDetailedStats } = useSinergiaV2();

  useEffect(() => {
    loadStats();
    
    // Auto-refresh se habilitado
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(loadStats, 30000); // 30 segundos
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const stats = await getDetailedStats();
      
      if (stats) {
        setDetailedStats(stats);
      } else {
        throw new Error('Não foi possível carregar estatísticas');
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar estatísticas do sistema",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCostTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'danger';
      case 'decreasing': return 'success';
      default: return 'info';
    }
  };

  const getCostTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'trending_up';
      case 'decreasing': return 'trending_down';
      default: return 'trending_flat';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4
    }).format(value);
  };

  if (loading && !detailedStats) {
    return (
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
          <PageTitle 
            title="SinergIA Madrilusa V2 - Admin" 
            subtitle="Dashboard administrativo e métricas do sistema"
          />
        </Row>
        <Row>
          <Col>
            <Card>
              <CardBody className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Carregando...</span>
                </div>
                <p className="mt-3 text-muted">Carregando métricas do sistema...</p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  if (!detailedStats) {
    return (
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
          <PageTitle 
            title="SinergIA Madrilusa V2 - Admin" 
            subtitle="Dashboard administrativo e métricas do sistema"
          />
        </Row>
        <Row>
          <Col>
            <Card>
              <CardBody className="text-center py-5">
                <i className="material-icons" style={{fontSize: '64px', color: '#dc3545'}}>
                  error_outline
                </i>
                <h4 className="mt-3 text-muted">Erro ao Carregar</h4>
                <p className="text-muted mb-4">
                  Não foi possível carregar as métricas do sistema.
                </p>
                <Button theme="primary" onClick={loadStats}>
                  <i className="material-icons mr-1">refresh</i>
                  Tentar Novamente
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  const { cost, performance, system, recommendations } = detailedStats;

  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <div className="col">
          <PageTitle 
            title="SinergIA Madrilusa V2 - Dashboard Admin" 
            subtitle="Monitoramento avançado do sistema de matching rigoroso"
          />
        </div>
        <div className="col-auto">
          <Button 
            theme={autoRefresh ? "success" : "outline-secondary"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="mr-2"
          >
            <i className="material-icons mr-1">
              {autoRefresh ? 'pause' : 'play_arrow'}
            </i>
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </Button>
          <Button 
            theme="primary" 
            size="sm"
            onClick={loadStats}
            disabled={loading}
          >
            <i className="material-icons mr-1">refresh</i>
            Atualizar
          </Button>
        </div>
      </Row>

      {/* Métricas de Custo */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Card className="stats-small">
            <CardBody className="p-3">
              <div className="d-flex align-items-center">
                <div className="icon-wrapper rounded-circle bg-primary text-white mr-3">
                  <i className="material-icons">attach_money</i>
                </div>
                <div>
                  <span className="stats-small__value text-dark">
                    {formatCurrency(cost.totalCostToday)}
                  </span>
                  <span className="stats-small__label text-uppercase text-muted">
                    Custo Hoje
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="stats-small">
            <CardBody className="p-3">
              <div className="d-flex align-items-center">
                <div className="icon-wrapper rounded-circle bg-info text-white mr-3">
                  <i className="material-icons">psychology</i>
                </div>
                <div>
                  <span className="stats-small__value text-dark">
                    {cost.totalTokensToday}
                  </span>
                  <span className="stats-small__label text-uppercase text-muted">
                    Tokens Hoje
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="stats-small">
            <CardBody className="p-3">
              <div className="d-flex align-items-center">
                <div className="icon-wrapper rounded-circle bg-success text-white mr-3">
                  <i className="material-icons">analytics</i>
                </div>
                <div>
                  <span className="stats-small__value text-dark">
                    {cost.totalAnalysesToday}
                  </span>
                  <span className="stats-small__label text-uppercase text-muted">
                    Análises Hoje
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="stats-small">
            <CardBody className="p-3">
              <div className="d-flex align-items-center">
                <div className={`icon-wrapper rounded-circle bg-${getCostTrendColor(cost.costTrend)} text-white mr-3`}>
                  <i className="material-icons">{getCostTrendIcon(cost.costTrend)}</i>
                </div>
                <div>
                  <span className="stats-small__value text-dark">
                    {Math.round(cost.aiUsageRate)}%
                  </span>
                  <span className="stats-small__label text-uppercase text-muted">
                    Uso de IA
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Métricas de Performance */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <CardHeader>
              <h5 className="mb-0">Performance do Sistema</h5>
            </CardHeader>
            <CardBody>
              <div className="table-responsive">
                <table className="table table-sm">
                  <tbody>
                    <tr>
                      <td>Tempo médio de análise:</td>
                      <td className="font-weight-bold">
                        {Math.round(performance.averageProcessingTime)}ms
                      </td>
                    </tr>
                    <tr>
                      <td>Score médio geral:</td>
                      <td className="font-weight-bold">
                        {Math.round(performance.averageScore)}%
                      </td>
                    </tr>
                    <tr>
                      <td>Tokens médios por análise:</td>
                      <td className="font-weight-bold">
                        {Math.round(cost.averageTokensPerAnalysis)}
                      </td>
                    </tr>
                    <tr>
                      <td>Custo médio por análise:</td>
                      <td className="font-weight-bold">
                        {cost.totalAnalysesToday > 0 ? 
                          formatCurrency(cost.totalCostToday / cost.totalAnalysesToday) : 
                          '$0.0000'
                        }
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <CardHeader>
              <h5 className="mb-0">Distribuição de Scores</h5>
            </CardHeader>
            <CardBody>
              {Object.entries(performance.scoreDistribution).map(([range, count]) => (
                <div key={range} className="mb-2">
                  <div className="d-flex justify-content-between mb-1">
                    <small>{range}%</small>
                    <small>{count} matches</small>
                  </div>
                  <Progress 
                    value={cost.totalAnalysesToday > 0 ? (count / cost.totalAnalysesToday) * 100 : 0}
                    theme={range.startsWith('81') ? 'success' : 
                           range.startsWith('61') ? 'info' : 
                           range.startsWith('41') ? 'warning' : 'danger'}
                    style={{ height: '6px' }}
                  />
                </div>
              ))}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Critérios Mais Problemáticos */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <CardHeader>
              <h5 className="mb-0">Critérios Mais Problemáticos</h5>
            </CardHeader>
            <CardBody>
              {performance.topMissingCriteria.map((criteria, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                  <span>{criteria.criteria}</span>
                  <Badge theme="warning">
                    {criteria.frequency}% dos casos
                  </Badge>
                </div>
              ))}
            </CardBody>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <CardHeader>
              <h5 className="mb-0">Recomendações do Sistema</h5>
            </CardHeader>
            <CardBody>
              {recommendations.length > 0 ? (
                recommendations.map((rec, index) => (
                  <div key={index} className="d-flex align-items-start mb-3">
                    <i className="material-icons text-info mr-2 mt-1" style={{ fontSize: '18px' }}>
                      lightbulb
                    </i>
                    <small>{rec}</small>
                  </div>
                ))
              ) : (
                <div className="text-center py-3">
                  <i className="material-icons text-success" style={{ fontSize: '48px' }}>
                    check_circle
                  </i>
                  <p className="text-muted mt-2">
                    Sistema operando dentro dos parâmetros ideais
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Informações do Sistema */}
      <Row className="mb-4">
        <Col>
          <Card>
            <CardHeader>
              <h5 className="mb-0">Informações do Sistema</h5>
            </CardHeader>
            <CardBody>
              <Row>
                <Col md={4}>
                  <div className="mb-3">
                    <small className="text-muted d-block">Buffer Size:</small>
                    <span className="font-weight-bold">{system.bufferSize} análises</span>
                  </div>
                </Col>
                
                <Col md={4}>
                  <div className="mb-3">
                    <small className="text-muted d-block">Registro Mais Antigo:</small>
                    <span className="font-weight-bold">
                      {system.oldestRecord ? 
                        new Date(system.oldestRecord).toLocaleDateString('pt-PT') : 
                        'N/A'
                      }
                    </span>
                  </div>
                </Col>
                
                <Col md={4}>
                  <div className="mb-3">
                    <small className="text-muted d-block">Último Registro:</small>
                    <span className="font-weight-bold">
                      {system.newestRecord ? 
                        new Date(system.newestRecord).toLocaleString('pt-PT') : 
                        'N/A'
                      }
                    </span>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Ações Administrativas */}
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <h5 className="mb-0">Ações Administrativas</h5>
            </CardHeader>
            <CardBody>
              <div className="d-flex flex-wrap">
                <Button 
                  theme="outline-primary" 
                  className="mr-2 mb-2"
                  onClick={loadStats}
                  disabled={loading}
                >
                  <i className="material-icons mr-1">refresh</i>
                  Atualizar Métricas
                </Button>
                
                <Button 
                  theme="outline-info" 
                  className="mr-2 mb-2"
                  onClick={() => {
                    const dataStr = JSON.stringify(detailedStats, null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(dataBlob);
                    
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `sinergia-v2-stats-${new Date().toISOString().split('T')[0]}.json`;
                    link.click();
                    
                    URL.revokeObjectURL(url);
                  }}
                >
                  <i className="material-icons mr-1">download</i>
                  Exportar Estatísticas
                </Button>
                
                <Button 
                  theme={autoRefresh ? "success" : "outline-secondary"}
                  className="mr-2 mb-2"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                >
                  <i className="material-icons mr-1">
                    {autoRefresh ? 'pause' : 'play_arrow'}
                  </i>
                  {autoRefresh ? 'Pausar' : 'Ativar'} Auto-refresh
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SinergiaV2Admin;
