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
  FormGroup,
  FormInput,
  FormSelect,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from 'shards-react';
import PageTitle from '../components/common/PageTitle';
import { useToast } from '@/hooks/use-toast';
import type { 
  ContribuicaoUnificada,
  TipoDadoProfissional 
} from '../../../types/dados-profissionais.types';

interface DadosProfissionaisStats {
  totalDados: number;
  totalExperiencias: number;
  totalFormacoes: number;
  totalIdiomas: number;
  totalUsuariosComDados: number;
}

const DadosProfissionaisAdmin: React.FC = () => {
  const [dados, setDados] = useState<ContribuicaoUnificada[]>([]);
  const [stats, setStats] = useState<DadosProfissionaisStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState<string>('');
  const [filtroUsuario, setFiltroUsuario] = useState<string>('');
  const [filtroAtivo, setFiltroAtivo] = useState<string>('true');
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const { toast } = useToast();

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    fetchStats();
    fetchDados();
  }, [filtroTipo, filtroUsuario, filtroAtivo, currentPage]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dados-profissionais/admin/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const fetchDados = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        limit: ITEMS_PER_PAGE.toString(),
        offset: (currentPage * ITEMS_PER_PAGE).toString()
      });
      
      if (filtroTipo) params.append('tipo', filtroTipo);
      if (filtroUsuario) params.append('userId', filtroUsuario);
      if (filtroAtivo !== '') params.append('ativo', filtroAtivo);

      const response = await fetch(`/api/dados-profissionais/admin/all?${params}`);
      const data = await response.json();
      
      if (data.success) {
        if (currentPage === 0) {
          setDados(data.data);
        } else {
          setDados(prev => [...prev, ...data.data]);
        }
        setHasMore(data.hasMore);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados profissionais",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = () => {
    setCurrentPage(0);
    setDados([]);
  };

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'experiencia': return 'work';
      case 'formacao': return 'school';
      case 'idioma': return 'language';
      default: return 'assignment';
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'experiencia': return 'success';
      case 'formacao': return 'warning';
      case 'idioma': return 'info';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle 
          title="Dados Profissionais" 
          subtitle="Gestão de dados estruturados dos imigrantes"
        />
      </Row>

      {/* Estatísticas */}
      {stats && (
        <Row className="mb-4">
          <Col lg={2} md={4} sm={6} className="mb-3">
            <Card className="stats-small">
              <CardBody className="p-3">
                <div className="d-flex align-items-center">
                  <div className="icon-wrapper rounded-circle bg-primary text-white mr-3">
                    <i className="material-icons">assignment</i>
                  </div>
                  <div>
                    <span className="stats-small__value text-dark">{stats.totalDados}</span>
                    <span className="stats-small__label text-uppercase text-muted">Total</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col lg={2} md={4} sm={6} className="mb-3">
            <Card className="stats-small">
              <CardBody className="p-3">
                <div className="d-flex align-items-center">
                  <div className="icon-wrapper rounded-circle bg-success text-white mr-3">
                    <i className="material-icons">work</i>
                  </div>
                  <div>
                    <span className="stats-small__value text-dark">{stats.totalExperiencias}</span>
                    <span className="stats-small__label text-uppercase text-muted">Experiências</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col lg={2} md={4} sm={6} className="mb-3">
            <Card className="stats-small">
              <CardBody className="p-3">
                <div className="d-flex align-items-center">
                  <div className="icon-wrapper rounded-circle bg-warning text-white mr-3">
                    <i className="material-icons">school</i>
                  </div>
                  <div>
                    <span className="stats-small__value text-dark">{stats.totalFormacoes}</span>
                    <span className="stats-small__label text-uppercase text-muted">Formações</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col lg={2} md={4} sm={6} className="mb-3">
            <Card className="stats-small">
              <CardBody className="p-3">
                <div className="d-flex align-items-center">
                  <div className="icon-wrapper rounded-circle bg-info text-white mr-3">
                    <i className="material-icons">language</i>
                  </div>
                  <div>
                    <span className="stats-small__value text-dark">{stats.totalIdiomas}</span>
                    <span className="stats-small__label text-uppercase text-muted">Idiomas</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col lg={2} md={4} sm={6} className="mb-3">
            <Card className="stats-small">
              <CardBody className="p-3">
                <div className="d-flex align-items-center">
                  <div className="icon-wrapper rounded-circle bg-secondary text-white mr-3">
                    <i className="material-icons">people</i>
                  </div>
                  <div>
                    <span className="stats-small__value text-dark">{stats.totalUsuariosComDados}</span>
                    <span className="stats-small__label text-uppercase text-muted">Usuários</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      {/* Filtros */}
      <Row className="mb-4">
        <Col>
          <Card>
            <CardHeader>
              <h5 className="mb-0">Filtros</h5>
            </CardHeader>
            <CardBody>
              <Row>
                <Col md={3}>
                  <FormGroup>
                    <label>Tipo</label>
                    <FormSelect
                      value={filtroTipo}
                      onChange={(e) => {
                        setFiltroTipo(e.target.value);
                        handleFilterChange();
                      }}
                      className="form-control"
                    >
                      <option value="">Todos os tipos</option>
                      <option value="experiencia">Experiências</option>
                      <option value="formacao">Formações</option>
                      <option value="idioma">Idiomas</option>
                    </FormSelect>
                  </FormGroup>
                </Col>

                <Col md={3}>
                  <FormGroup>
                    <label>Status</label>
                    <FormSelect
                      value={filtroAtivo}
                      onChange={(e) => {
                        setFiltroAtivo(e.target.value);
                        handleFilterChange();
                      }}
                      className="form-control"
                    >
                      <option value="">Todos</option>
                      <option value="true">Ativos</option>
                      <option value="false">Inativos</option>
                    </FormSelect>
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <label>Buscar por usuário</label>
                    <InputGroup>
                      <FormInput
                        placeholder="ID ou email do usuário..."
                        value={filtroUsuario}
                        onChange={(e) => setFiltroUsuario(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleFilterChange();
                          }
                        }}
                      />
                      <InputGroupAddon type="append">
                        <Button 
                          theme="primary"
                          onClick={handleFilterChange}
                        >
                          <i className="material-icons">search</i>
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Lista de Dados */}
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <h5 className="mb-0">
                Dados Profissionais 
                {dados.length > 0 && <Badge theme="secondary" className="ml-2">{dados.length}</Badge>}
              </h5>
            </CardHeader>
            <CardBody>
              {loading && dados.length === 0 ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Carregando...</span>
                  </div>
                </div>
              ) : dados.length === 0 ? (
                <div className="text-center py-4">
                  <i className="material-icons" style={{fontSize: '48px', color: '#ccc'}}>
                    assignment
                  </i>
                  <h5 className="mt-2 text-muted">Nenhum dado encontrado</h5>
                  <p className="text-muted">Ajuste os filtros para ver mais resultados.</p>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Tipo</th>
                          <th>Título</th>
                          <th>Usuário</th>
                          <th>Descrição</th>
                          <th>Criado em</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dados.map((dado) => (
                          <tr key={dado.id}>
                            <td>
                              <Badge theme={getTipoColor(dado.tipo)}>
                                <i className={`material-icons mr-1`} style={{fontSize: '14px'}}>
                                  {getTipoIcon(dado.tipo)}
                                </i>
                                {dado.tipo}
                              </Badge>
                            </td>
                            <td>
                              <strong>{dado.titulo}</strong>
                            </td>
                            <td>
                              <div>
                                <small className="text-muted d-block">{dado.user?.nomeCompleto}</small>
                                <small className="text-muted">{(dado.user as any)?.email}</small>
                              </div>
                            </td>
                            <td>
                              <small>{dado.descricao}</small>
                            </td>
                            <td>
                              <small>{formatDate(dado.createdAt.toString())}</small>
                            </td>
                            <td>
                              <Badge theme="success">Ativo</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {hasMore && (
                    <div className="text-center mt-3">
                      <Button 
                        theme="outline-primary"
                        onClick={loadMore}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm mr-2" />
                            Carregando...
                          </>
                        ) : (
                          <>
                            <i className="material-icons mr-1">expand_more</i>
                            Carregar Mais
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DadosProfissionaisAdmin;
