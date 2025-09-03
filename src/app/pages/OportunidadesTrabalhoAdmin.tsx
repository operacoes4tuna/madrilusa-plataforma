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
  OportunidadeTrabalho,
  OportunidadeStats
} from '../../types/oportunidades-trabalho.types';
import { 
  OPCOES_GENERO_OPORTUNIDADE,
  OPCOES_BINARIAS_OPORTUNIDADE,
  NIVEIS_ESCOLARIDADE_OPORTUNIDADE
} from '../../types/oportunidades-trabalho.types';

const OportunidadesTrabalhoAdmin: React.FC = () => {
  const [oportunidades, setOportunidades] = useState<ContribuicaoUnificada[]>([]);
  const [stats, setStats] = useState<OportunidadeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<string>('');
  const [filtroGenero, setFiltroGenero] = useState<string>('');
  const [filtroMunicipio, setFiltroMunicipio] = useState<string>('');
  const [filtroEscolaridade, setFiltroEscolaridade] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const { toast } = useToast();

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    fetchStats();
    fetchOportunidades();
  }, [filtroStatus, filtroGenero, filtroMunicipio, filtroEscolaridade, currentPage]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/oportunidades-trabalho/admin/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const fetchOportunidades = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        limit: ITEMS_PER_PAGE.toString(),
        offset: (currentPage * ITEMS_PER_PAGE).toString()
      });
      
      if (filtroStatus !== '') params.append('ativo', filtroStatus);
      if (filtroGenero) params.append('genero', filtroGenero);
      if (filtroMunicipio) params.append('municipio', filtroMunicipio);
      if (filtroEscolaridade) params.append('escolaridade', filtroEscolaridade);

      const response = await fetch(`/api/oportunidades-trabalho/admin/all?${params}`);
      const data = await response.json();
      
      if (data.success) {
        // Converter para formato unificado
        const oportunidadesUnificadas: ContribuicaoUnificada[] = data.data.map((op: any) => ({
          id: op.id,
          tipo: 'oportunidade_trabalho' as const,
          titulo: op.titulo,
          descricao: `${op.nomeCargo} | ${op.descricaoCargo?.substring(0, 100)}${op.descricaoCargo && op.descricaoCargo.length > 100 ? '...' : ''}`,
          tags: [op.nomeCargo, op.nomeProfissao, op.municipioResidencia].filter(Boolean),
          createdAt: new Date(op.createdAt),
          updatedAt: new Date(op.updatedAt),
          userId: op.userId,
          dadosEstruturados: op,
          user: op.user
        }));

        if (currentPage === 0) {
          setOportunidades(oportunidadesUnificadas);
        } else {
          setOportunidades(prev => [...prev, ...oportunidadesUnificadas]);
        }
        setHasMore(data.hasMore);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Erro ao buscar oportunidades:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar oportunidades",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = () => {
    setCurrentPage(0);
    setOportunidades([]);
  };

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
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

  const getStatusBadge = (ativo: boolean) => {
    return ativo ? (
      <Badge theme="success">Ativa</Badge>
    ) : (
      <Badge theme="warning">Inativa</Badge>
    );
  };

  const getCriteriosSummary = (oportunidade: OportunidadeTrabalho) => {
    const criterios = [];
    
    if (oportunidade.genero && oportunidade.genero !== 'INDIFERENTE') {
      criterios.push(`${oportunidade.genero === 'F' ? 'Feminino' : 'Masculino'}`);
    }
    if (oportunidade.idade) {
      criterios.push(`${oportunidade.idade}`);
    }
    if (oportunidade.municipioResidencia) {
      criterios.push(oportunidade.municipioResidencia);
    }
    if (oportunidade.nivelEscolaridade && oportunidade.nivelEscolaridade !== 'Indiferente') {
      criterios.push(oportunidade.nivelEscolaridade);
    }

    return criterios.length > 0 ? criterios.join(' • ') : 'Sem critérios específicos';
  };

  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle 
          title="Oportunidades de Trabalho" 
          subtitle="Gestão administrativa de oportunidades publicadas pelas empresas"
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
                    <i className="material-icons">work_outline</i>
                  </div>
                  <div>
                    <span className="stats-small__value text-dark">{stats.totalOportunidades}</span>
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
                    <i className="material-icons">check_circle</i>
                  </div>
                  <div>
                    <span className="stats-small__value text-dark">{stats.oportunidadesAtivas}</span>
                    <span className="stats-small__label text-uppercase text-muted">Ativas</span>
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
                    <i className="material-icons">pause</i>
                  </div>
                  <div>
                    <span className="stats-small__value text-dark">{stats.oportunidadesInativas}</span>
                    <span className="stats-small__label text-uppercase text-muted">Inativas</span>
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
                    <i className="material-icons">visibility</i>
                  </div>
                  <div>
                    <span className="stats-small__value text-dark">{stats.totalVisualizacoes}</span>
                    <span className="stats-small__label text-uppercase text-muted">Visualizações</span>
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
                    <i className="material-icons">business</i>
                  </div>
                  <div>
                    <span className="stats-small__value text-dark">{stats.totalEmpresas}</span>
                    <span className="stats-small__label text-uppercase text-muted">Empresas</span>
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
                <Col md={2}>
                  <FormGroup>
                    <label>Status</label>
                    <FormSelect
                      value={filtroStatus}
                      onChange={(e) => {
                        setFiltroStatus(e.target.value);
                        handleFilterChange();
                      }}
                      className="form-control"
                    >
                      <option value="">Todas</option>
                      <option value="true">Ativas</option>
                      <option value="false">Inativas</option>
                    </FormSelect>
                  </FormGroup>
                </Col>

                <Col md={2}>
                  <FormGroup>
                    <label>Género</label>
                    <FormSelect
                      value={filtroGenero}
                      onChange={(e) => {
                        setFiltroGenero(e.target.value);
                        handleFilterChange();
                      }}
                      className="form-control"
                    >
                      <option value="">Todos</option>
                      {OPCOES_GENERO_OPORTUNIDADE.map((opcao) => (
                        <option key={opcao} value={opcao}>
                          {opcao === 'F' ? 'Feminino' : opcao === 'M' ? 'Masculino' : 'Indiferente'}
                        </option>
                      ))}
                    </FormSelect>
                  </FormGroup>
                </Col>

                <Col md={3}>
                  <FormGroup>
                    <label>Escolaridade</label>
                    <FormSelect
                      value={filtroEscolaridade}
                      onChange={(e) => {
                        setFiltroEscolaridade(e.target.value);
                        handleFilterChange();
                      }}
                      className="form-control"
                    >
                      <option value="">Todas</option>
                      {NIVEIS_ESCOLARIDADE_OPORTUNIDADE.map((nivel) => (
                        <option key={nivel} value={nivel}>
                          {nivel}
                        </option>
                      ))}
                    </FormSelect>
                  </FormGroup>
                </Col>

                <Col md={5}>
                  <FormGroup>
                    <label>Buscar por município</label>
                    <InputGroup>
                      <FormInput
                        placeholder="Digite o município..."
                        value={filtroMunicipio}
                        onChange={(e) => setFiltroMunicipio(e.target.value)}
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

      {/* Lista de Oportunidades */}
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <h5 className="mb-0">
                Oportunidades Publicadas
                {oportunidades.length > 0 && <Badge theme="secondary" className="ml-2">{oportunidades.length}</Badge>}
              </h5>
            </CardHeader>
            <CardBody>
              {loading && oportunidades.length === 0 ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Carregando...</span>
                  </div>
                </div>
              ) : oportunidades.length === 0 ? (
                <div className="text-center py-4">
                  <i className="material-icons" style={{fontSize: '48px', color: '#ccc'}}>
                    work_outline
                  </i>
                  <h5 className="mt-2 text-muted">Nenhuma oportunidade encontrada</h5>
                  <p className="text-muted">Ajuste os filtros para ver mais resultados.</p>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Oportunidade</th>
                          <th>Empresa</th>
                          <th>Critérios</th>
                          <th>Visualizações</th>
                          <th>Criado em</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {oportunidades.map((oportunidade) => {
                          const opData = oportunidade.dadosEstruturados as OportunidadeTrabalho;
                          
                          return (
                            <tr key={oportunidade.id}>
                              <td>
                                <div>
                                  <strong className="d-block">{oportunidade.titulo}</strong>
                                  <small className="text-muted">
                                    {opData.nomeCargo}
                                    {opData.nomeProfissao && ` (${opData.nomeProfissao})`}
                                  </small>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <small className="text-muted d-block">{oportunidade.user?.nomeCompleto}</small>
                                  <small className="text-muted">{(oportunidade.user as any)?.email}</small>
                                </div>
                              </td>
                              <td>
                                <small>{getCriteriosSummary(opData)}</small>
                              </td>
                              <td>
                                <Badge theme="info">
                                  <i className="material-icons mr-1" style={{fontSize: '12px'}}>visibility</i>
                                  {opData.visualizacoes}
                                </Badge>
                              </td>
                              <td>
                                <small>{formatDate(oportunidade.createdAt.toString())}</small>
                              </td>
                              <td>
                                {getStatusBadge(opData.ativo)}
                              </td>
                            </tr>
                          );
                        })}
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

export default OportunidadesTrabalhoAdmin;
