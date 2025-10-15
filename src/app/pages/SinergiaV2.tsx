import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  CardBody, 
  CardHeader,
  Button,
  FormGroup,
  FormInput,
  FormSelect,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'shards-react';
import PageTitle from '../components/common/PageTitle';
import MatchCard from '../components/sinergia-v2/MatchCard';
import MatchAnimation from '../components/sinergia-v2/MatchAnimation';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useSinergiaV2 } from '../../hooks/useSinergiaV2';
import type {
  RigorousMatchFrontend,
  FilterOptions
} from '../../types/sinergia-v2.types';

const SinergiaV2: React.FC = () => {
  const { user } = useAuth();
  const {
    analyzeOpportunityMatches,
    analyzeImigranteOpportunities,
    isAnalyzing,
    matches,
    error,
    clearError,
    clearMatches
  } = useSinergiaV2();

  const [filters, setFilters] = useState<FilterOptions>({
    minScore: 50,
    maxScore: 100,
    sortBy: 'score',
    sortOrder: 'desc',
    showOnlyAI: false,
    showOnlyHigh: false
  });

  const [selectedOportunidade, setSelectedOportunidade] = useState<string>('');
  const [oportunidades, setOportunidades] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const isEmpresa = user?.categoria === 'EMPRESA';
  const isImigrante = user?.categoria === 'IMIGRANTE';

  useEffect(() => {
    if (isEmpresa) {
      fetchOportunidades();
    }
  }, [isEmpresa]);

  const fetchOportunidades = async () => {
    try {
      const response = await fetch(`/api/oportunidades-trabalho/empresa/${user?.id}`);
      const data = await response.json();

      if (data.success) {
        setOportunidades(data.data);
        if (data.data.length > 0) {
          setSelectedOportunidade(data.data[0].id);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar oportunidades:', error);
    }
  };

  const handleAnalyze = async () => {
    clearError();
    clearMatches();

    if (isEmpresa && selectedOportunidade) {
      await analyzeOpportunityMatches(selectedOportunidade, {
        minScore: filters.minScore,
        maxResults: 50,
        useAI: true,
        includeBreakdown: true
      });
    } else if (isImigrante && user?.id) {
      await analyzeImigranteOpportunities(user.id, {
        minScore: filters.minScore,
        maxResults: 50,
        useAI: true,
        includeBreakdown: true
      });
    }
  };

  const filteredMatches = matches
    .filter(match => {
      if (match.scoreTotal < filters.minScore || match.scoreTotal > filters.maxScore) return false;
      if (filters.showOnlyAI && match.tokensUsed === 0) return false;
      if (filters.showOnlyHigh && match.scoreTotal < 70) return false;
      return true;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filters.sortBy) {
        case 'score':
          aValue = a.scoreTotal;
          bValue = b.scoreTotal;
          break;
        case 'created':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'tokens':
          aValue = a.tokensUsed;
          bValue = b.tokensUsed;
          break;
        default:
          aValue = a.scoreTotal;
          bValue = b.scoreTotal;
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleRequestContact = (match: RigorousMatchFrontend) => {
    // Implementar lógica de solicitação de contato
    console.log('Solicitar contato para:', match);
    // TODO: Integrar com sistema de mensagens
  };

  const handleExportMatch = (match: RigorousMatchFrontend) => {
    // Criar dados para export
    const exportData = {
      match,
      exportedAt: new Date().toISOString(),
      exportedBy: user?.nomeCompleto,
      summary: {
        scoreTotal: match.scoreTotal,
        tokensUsed: match.tokensUsed,
        matchedCriteria: match.matchedItems.length,
        unmatchedCriteria: match.unmatchedItems.length
      }
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `sinergia-v2-match-${match.scoreTotal}pct-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  if (!isEmpresa && !isImigrante) {
    return (
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
                  <PageTitle 
          title="SinergIA Madrilusa V2" 
          subtitle="Sistema de matching rigoroso disponível apenas para Empresas e Imigrantes"
        />
        </Row>
        <Row>
          <Col>
            <Card>
              <CardBody className="text-center py-5">
                <i className="material-icons" style={{fontSize: '64px', color: '#fd7e14'}}>
                  business_center
                </i>
                <h4 className="mt-3 text-muted">Acesso Restrito</h4>
                <p className="text-muted">
                  O SinergIA Madrilusa V2 está disponível apenas para usuários das categorias Empresa e Imigrante.
                </p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle 
          title="SinergIA Madrilusa V2" 
          subtitle={isEmpresa ? 
            "Encontre os candidatos ideais com matching rigoroso baseado em IA" :
            "Descubra oportunidades compatíveis com seu perfil profissional"
          }
        />
      </Row>

      {/* Animação de Match */}
      {filteredMatches.length > 0 && (
        <Row>
          <Col>
            <MatchAnimation topMatch={filteredMatches[0]} isEmpresa={isEmpresa} />
          </Col>
        </Row>
      )}

      {/* Controles */}
      <Row className="mb-4">
        <Col>
          <Card>
            <CardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  {isEmpresa ? 'Análise de Candidatos' : 'Análise de Oportunidades'}
                </h5>
                <div>
                  <Button
                    theme="outline-secondary"
                    size="sm"
                    className="mr-2"
                    onClick={() => setShowFilters(true)}
                  >
                    <i className="material-icons mr-1">filter_list</i>
                    Filtros
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <Row>
                {isEmpresa && (
                  <Col md={6}>
                    <FormGroup>
                      <label>Selecionar Oportunidade</label>
                      <FormSelect
                        value={selectedOportunidade}
                        onChange={(e) => setSelectedOportunidade(e.target.value)}
                        className="form-control"
                      >
                        <option value="">Selecione uma oportunidade...</option>
                        {oportunidades.map(op => (
                          <option key={op.id} value={op.id}>
                            {op.titulo} - {op.nomeCargo}
                          </option>
                        ))}
                      </FormSelect>
                    </FormGroup>
                  </Col>
                )}

                <Col md={3}>
                  <FormGroup>
                    <label>Score Mínimo</label>
                    <FormInput
                      type="number"
                      min="0"
                      max="100"
                      value={filters.minScore}
                      onChange={(e) => setFilters(prev => ({ ...prev, minScore: parseInt(e.target.value) || 0 }))}
                    />
                  </FormGroup>
                </Col>

                <Col md={3}>
                  <FormGroup>
                    <label>&nbsp;</label>
                    <div>
                      <Button 
                        theme="primary" 
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || (isEmpresa && !selectedOportunidade)}
                        className="w-100"
                      >
                        {isAnalyzing ? (
                          <>
                            <span className="spinner-border spinner-border-sm mr-2" />
                            Analisando...
                          </>
                        ) : (
                          <>
                            <i className="material-icons mr-1">psychology</i>
                            Iniciar Análise IA
                          </>
                        )}
                      </Button>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Resultados */}
      {error && (
        <Row className="mb-4">
          <Col>
            <div className="alert alert-danger">
              <i className="material-icons mr-2">error</i>
              {error}
            </div>
          </Col>
        </Row>
      )}

      {filteredMatches.length > 0 && (
        <Row className="mb-4">
          <Col>
            <Card>
              <CardHeader>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    Resultados da Análise
                    <Badge theme="secondary" className="ml-2">
                      {filteredMatches.length} matches
                    </Badge>
                  </h5>
                  <small className="text-muted">
                    Ordenado por {filters.sortBy === 'score' ? 'compatibilidade' : 
                                 filters.sortBy === 'created' ? 'data' : 'tokens IA'} 
                    ({filters.sortOrder === 'desc' ? 'maior primeiro' : 'menor primeiro'})
                  </small>
                </div>
              </CardHeader>
              <CardBody>
                <Row>
                  {filteredMatches.map((match, index) => (
                    <Col key={`${match.oportunidadeId}-${match.imigranteId}`} lg={6} className="mb-4">
                      <MatchCard
                        match={match}
                        viewMode={isEmpresa ? 'opportunity' : 'immigrant'}
                        onRequestContact={handleRequestContact}
                        onExportMatch={handleExportMatch}
                      />
                    </Col>
                  ))}
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      {matches.length === 0 && !isAnalyzing && (
        <Row>
          <Col>
            <Card>
              <CardBody>
                <div className="text-center py-5">
                  <i className="material-icons" style={{fontSize: '64px', color: '#fd7e14'}}>
                    psychology
                  </i>
                  <h4 className="mt-3 text-muted">
                    {isEmpresa ? 'Encontre Candidatos Ideais' : 'Descubra Oportunidades Compatíveis'}
                  </h4>
                  <p className="text-muted mb-4">
                    {isEmpresa ? 
                      'Selecione uma oportunidade de trabalho e inicie a análise para encontrar os candidatos mais compatíveis.' :
                      'Inicie a análise para descobrir oportunidades de trabalho que correspondem ao seu perfil profissional.'
                    }
                  </p>
                  <Button 
                    theme="primary" 
                    onClick={handleAnalyze}
                    disabled={isEmpresa && !selectedOportunidade}
                  >
                    <i className="material-icons mr-1">psychology</i>
                    Iniciar Primeira Análise
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      {/* Modal de Filtros */}
      <Modal open={showFilters} toggle={() => setShowFilters(false)} size="lg">
        <ModalHeader>
          <i className="material-icons mr-2">filter_list</i>
          Filtros Avançados
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col md={6}>
              <FormGroup>
                <label>Score Mínimo</label>
                <FormInput
                  type="number"
                  min="0"
                  max="100"
                  value={filters.minScore}
                  onChange={(e) => setFilters(prev => ({ ...prev, minScore: parseInt(e.target.value) || 0 }))}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <label>Score Máximo</label>
                <FormInput
                  type="number"
                  min="0"
                  max="100"
                  value={filters.maxScore}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxScore: parseInt(e.target.value) || 100 }))}
                />
              </FormGroup>
            </Col>
          </Row>
          
          <Row>
            <Col md={6}>
              <FormGroup>
                <label>Ordenar por</label>
                <FormSelect
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  className="form-control"
                >
                  <option value="score">Compatibilidade</option>
                  <option value="created">Data de Análise</option>
                  <option value="tokens">Tokens IA</option>
                </FormSelect>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <label>Ordem</label>
                <FormSelect
                  value={filters.sortOrder}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortOrder: e.target.value as any }))}
                  className="form-control"
                >
                  <option value="desc">Maior primeiro</option>
                  <option value="asc">Menor primeiro</option>
                </FormSelect>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <div className="custom-control custom-checkbox">
                  <input 
                    type="checkbox" 
                    className="custom-control-input" 
                    id="showOnlyAI"
                    checked={filters.showOnlyAI}
                    onChange={(e) => setFilters(prev => ({ ...prev, showOnlyAI: e.target.checked }))}
                  />
                  <label className="custom-control-label" htmlFor="showOnlyAI">
                    Apenas análises com IA
                  </label>
                </div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <div className="custom-control custom-checkbox">
                  <input 
                    type="checkbox" 
                    className="custom-control-input" 
                    id="showOnlyHigh"
                    checked={filters.showOnlyHigh}
                    onChange={(e) => setFilters(prev => ({ ...prev, showOnlyHigh: e.target.checked }))}
                  />
                  <label className="custom-control-label" htmlFor="showOnlyHigh">
                    Apenas alta compatibilidade (≥70%)
                  </label>
                </div>
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button theme="secondary" onClick={() => setShowFilters(false)}>
            Aplicar Filtros
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default SinergiaV2;
