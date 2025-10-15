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
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<RigorousMatchFrontend | null>(null);
  const [contactMessage, setContactMessage] = useState('');

  const isEmpresa = user?.categoria === 'EMPRESA';
  const isImigrante = user?.categoria === 'IMIGRANTE';

  useEffect(() => {
    if (isEmpresa) {
      fetchOportunidades();
    }
  }, [isEmpresa]);

  // Iniciar análise automaticamente ao entrar na página
  useEffect(() => {
    if (isImigrante && user?.id && !isAnalyzing && matches.length === 0) {
      // Para imigrantes, iniciar automaticamente
      handleAnalyze();
    } else if (isEmpresa && selectedOportunidade && !isAnalyzing && matches.length === 0) {
      // Para empresas, iniciar quando tiver oportunidade selecionada
      handleAnalyze();
    }
  }, [isImigrante, isEmpresa, selectedOportunidade, user?.id]);

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
    setSelectedMatch(match);

    // Criar mensagem padrão baseada no tipo de usuário
    const defaultMessage = isEmpresa
      ? `Olá ${match.imigrante?.nomeCompleto},\n\nVimos seu perfil através do SinergIA Madrilusa e identificamos uma compatibilidade de ${match.scoreTotal}% com nossa vaga.\n\nGostaríamos de conversar sobre esta oportunidade.\n\nAguardamos seu contato!`
      : `Olá,\n\nVi a vaga "${match.oportunidade?.titulo}" na empresa ${match.oportunidade?.empresa} através do SinergIA Madrilusa.\n\nIdentifiquei uma compatibilidade de ${match.scoreTotal}% com meu perfil e gostaria de saber mais sobre esta oportunidade.\n\nAguardo retorno!`;

    setContactMessage(defaultMessage);
    setShowContactModal(true);
  };

  const handleSendContactRequest = async () => {
    if (!selectedMatch || !contactMessage.trim()) {
      alert('Por favor, escreva uma mensagem antes de enviar.');
      return;
    }

    try {
      // Buscar admin do sistema
      const adminResponse = await fetch('/api/users?categoria=ADMIN');
      const adminData = await adminResponse.json();

      if (!adminData.success || !adminData.data || adminData.data.length === 0) {
        alert('❌ Erro: Administrador do sistema não encontrado.');
        return;
      }

      const adminId = adminData.data[0].id;

      // Montar a notificação para o admin
      const notificationMessage = isEmpresa
        ? `🔔 NOVA SOLICITAÇÃO DE CONTATO\n\n` +
          `📊 Match: ${selectedMatch.scoreTotal}% de compatibilidade\n` +
          `🏢 Empresa: ${user?.nomeCompleto}\n` +
          `👤 Candidato: ${selectedMatch.imigrante?.nomeCompleto}\n` +
          `📧 Email do candidato: ${selectedMatch.imigrante?.email}\n` +
          `💼 Vaga: ${selectedMatch.oportunidade?.titulo}\n\n` +
          `📝 Mensagem da empresa:\n${contactMessage}`
        : `🔔 NOVA SOLICITAÇÃO DE CONTATO\n\n` +
          `📊 Match: ${selectedMatch.scoreTotal}% de compatibilidade\n` +
          `👤 Imigrante: ${user?.nomeCompleto}\n` +
          `📧 Email do imigrante: ${user?.email}\n` +
          `🏢 Empresa: ${selectedMatch.oportunidade?.empresa}\n` +
          `💼 Vaga: ${selectedMatch.oportunidade?.titulo}\n\n` +
          `📝 Mensagem do imigrante:\n${contactMessage}`;

      // Enviar notificação para o admin
      const response = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: adminId,
          tipo: 'SOLICITACAO_CONTATO_SINERGIA',
          titulo: `Solicitação de Contato - Match ${selectedMatch.scoreTotal}%`,
          mensagem: notificationMessage,
          metadata: {
            matchId: `${selectedMatch.oportunidadeId}-${selectedMatch.imigranteId}`,
            oportunidadeId: selectedMatch.oportunidadeId,
            imigranteId: selectedMatch.imigranteId,
            remetenteId: user?.id,
            remetenteTipo: user?.categoria,
            scoreCompatibilidade: selectedMatch.scoreTotal,
            mensagemOriginal: contactMessage
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Solicitação enviada para o administrador do sistema com sucesso!\n\nO administrador Madrilusa entrará em contato em breve para intermediar o contato.');
        setShowContactModal(false);
        setContactMessage('');
        setSelectedMatch(null);
      } else {
        alert(`❌ Erro ao enviar solicitação: ${data.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      alert('❌ Erro ao enviar solicitação de contato. Tente novamente.');
    }
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
      {/* Loading durante análise */}
      {isAnalyzing && (
        <Row>
          <Col>
            <Card>
              <CardBody>
                <div className="text-center py-5">
                  <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} />
                  <h4 className="text-muted">Analisando compatibilidades...</h4>
                  <p className="text-muted">
                    {isEmpresa ?
                      'Buscando os melhores candidatos para sua vaga' :
                      'Encontrando as melhores oportunidades para você'
                    }
                  </p>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      {/* Animação de Match */}
      {!isAnalyzing && filteredMatches.length > 0 && (
        <Row>
          <Col>
            <MatchAnimation topMatch={filteredMatches[0]} isEmpresa={isEmpresa} />
          </Col>
        </Row>
      )}

      {/* Resultados */}
      {!isAnalyzing && error && (
        <Row className="mb-4">
          <Col>
            <div className="alert alert-danger">
              <i className="material-icons mr-2">error</i>
              {error}
            </div>
          </Col>
        </Row>
      )}

      {!isAnalyzing && filteredMatches.length > 0 && (
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
                  <div>
                    <Button
                      theme="outline-secondary"
                      size="sm"
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


      {/* Modal de Solicitação de Contato */}
      <Modal open={showContactModal} toggle={() => setShowContactModal(false)} size="lg">
        <ModalHeader>
          <i className="material-icons mr-2">contact_mail</i>
          Solicitar Contato
        </ModalHeader>
        <ModalBody>
          {selectedMatch && (
            <>
              <div className="mb-3 p-3 bg-light rounded">
                <h6 className="mb-2">
                  {isEmpresa
                    ? `Candidato: ${selectedMatch.imigrante?.nomeCompleto}`
                    : `Vaga: ${selectedMatch.oportunidade?.titulo}`
                  }
                </h6>
                <div className="d-flex align-items-center">
                  <Badge theme={selectedMatch.scoreTotal >= 80 ? 'success' : 'info'} className="mr-2">
                    {selectedMatch.scoreTotal}% de compatibilidade
                  </Badge>
                  {isEmpresa ? (
                    <small className="text-muted">
                      {selectedMatch.imigrante?.email}
                    </small>
                  ) : (
                    <small className="text-muted">
                      {selectedMatch.oportunidade?.empresa}
                    </small>
                  )}
                </div>
              </div>

              <FormGroup>
                <label htmlFor="contactMessage">Mensagem</label>
                <textarea
                  id="contactMessage"
                  className="form-control"
                  rows={8}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Escreva sua mensagem..."
                />
                <small className="text-muted">
                  Esta mensagem será enviada para {isEmpresa ? 'o candidato' : 'a empresa'}.
                </small>
              </FormGroup>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button theme="secondary" onClick={() => setShowContactModal(false)}>
            Cancelar
          </Button>
          <Button theme="primary" onClick={handleSendContactRequest}>
            <i className="material-icons mr-1" style={{ fontSize: '14px' }}>send</i>
            Enviar Solicitação
          </Button>
        </ModalFooter>
      </Modal>

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
