import React, { useState } from 'react';
import { Container, Row, Col, Card, CardBody, Button } from 'shards-react';
import PageTitle from '../components/common/PageTitle';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/modules/auth/hooks/useAuth';

// Tipos para SinergIA
interface Match {
  score: number;
  explanation: string;
  contributionType: string;
  targetCategory: string;
  targetContributionId: string;
  commonTags: string[];
}

interface CategoryResults {
  categoria: string;
  totalFound: number;
  topMatches: Match[];
  averageScore: number;
}

interface SinergiaResults {
  userId: string;
  processedAt: string;
  totalMatches: number;
  empresas: CategoryResults;
  municipios: CategoryResults;
  academias: CategoryResults;
  familias: CategoryResults;
}

const SinergIA: React.FC = () => {
  const [results, setResults] = useState<SinergiaResults | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const processSinergia = async () => {
    if (!user?.id) {
      toast({
        title: "Erro",
        description: "Usuário não identificado",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch(`/api/sinergia/test-analyze/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          maxMatchesPerCategory: 5,
          minScoreThreshold: 30
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.data);
        toast({
          title: "🧠 Análise Concluída",
          description: `${data.data.totalMatches} sinergias encontradas`,
        });
      } else {
        throw new Error(data.message || data.error || 'Erro desconhecido');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao processar sinergia';
      setError(errorMessage);
      
      toast({
        title: "Erro na Análise",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSolicitarContato = async (match: Match) => {
    try {
      const response = await fetch('/api/sinergia/request-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          targetCategory: match.targetCategory,
          matchScore: match.score,
          explanation: match.explanation,
          userMessage: `Interesse em ${match.contributionType} com ${match.score}% de sinergia`,
          userEmail: user?.email,
          userName: user?.nomeCompleto
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "✅ Contato Solicitado",
          description: "A administração entrará em contacto em breve",
        });
      } else {
        throw new Error(data.error || 'Erro ao solicitar contato');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível solicitar contato",
        variant: "destructive",
      });
    }
  };

  const getCategoryIcon = (categoria: string): string => {
    const icons: Record<string, string> = {
      'EMPRESA': 'business',
      'MUNICIPIO': 'location_city',
      'ACADEMIA': 'school',
      'FAMILIA_ACOLHIMENTO': 'home'
    };
    return icons[categoria] || 'help';
  };

  const getCategoryLabel = (categoria: string): string => {
    const labels: Record<string, string> = {
      'EMPRESA': 'Empresas',
      'MUNICIPIO': 'Municípios',
      'ACADEMIA': 'Academias',
      'FAMILIA_ACOLHIMENTO': 'Famílias'
    };
    return labels[categoria] || categoria;
  };

  const getCategoryColor = (categoria: string): string => {
    const colors: Record<string, string> = {
      'EMPRESA': '#007bff',
      'MUNICIPIO': '#ffc107',
      'ACADEMIA': '#17a2b8',
      'FAMILIA_ACOLHIMENTO': '#e83e8c'
    };
    return colors[categoria] || '#6c757d';
  };

  const renderProgressBar = (score: number) => {
    const percentage = Math.min(100, Math.max(0, score));
    const barColor = percentage >= 70 ? '#28a745' : percentage >= 50 ? '#ffc107' : '#17a2b8';
    
    return (
      <div className="progress mb-2" style={{ height: '8px' }}>
        <div 
          className="progress-bar" 
          style={{ 
            width: `${percentage}%`, 
            backgroundColor: barColor 
          }}
        />
      </div>
    );
  };

  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle 
          title="SinergIA Madrilusa"
          subtitle="Inteligência Artificial da Madrilusa para gerar sinergia e match"
          className="text-sm-left mb-3" 
        />
      </Row>

      {/* Descrição */}
      <Row className="mb-4">
        <Col>
          <Card>
            <CardBody>
              <p className="text-muted mb-3">
                A <strong>SinergIA</strong> utiliza inteligência artificial para analisar suas contribuições 
                e encontrar compatibilidades com empresas, municípios, academias e famílias da rede Madrilusa.
              </p>
              <div className="alert alert-info">
                <i className="material-icons mr-2">info</i>
                <strong>Privacidade:</strong> Os nomes das entidades são mantidos confidenciais. 
                Para obter contactos, solicite através da administração.
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Estado Inicial / Botão de Processamento */}
      {!results && !error && (
        <Row className="justify-content-center">
          <Col md="8" lg="6">
            <Card>
              <CardBody className="text-center py-5">
                <i 
                  className="material-icons mb-3" 
                  style={{fontSize: '72px', color: '#F5A623'}}
                >
                  psychology
                </i>
                <h4 className="mb-3">Descobrir Sinergias</h4>
                <p className="text-muted mb-4">
                  A IA irá analisar suas <strong>{user?.categoria === 'IMIGRANTE' ? 'habilidades' : 
                  user?.categoria === 'EMPRESA' ? 'oportunidades' : 
                  user?.categoria === 'MUNICIPIO' ? 'projetos' : 
                  user?.categoria === 'ACADEMIA' ? 'cursos' : 'suporte'}</strong> e 
                  encontrar conexões com outras entidades da rede.
                </p>
                
                <Button 
                  theme="primary" 
                  size="lg"
                  onClick={processSinergia}
                  disabled={isProcessing}
                  style={{ minWidth: '200px' }}
                >
                  {isProcessing ? (
                    <>
                      <span className="spinner-border spinner-border-sm mr-2" />
                      Processando...
                    </>
                  ) : (
                    <>
                      🧠 Processar Sinergia
                    </>
                  )}
                </Button>

                {isProcessing && (
                  <div className="mt-3">
                    <small className="text-muted">
                      <i className="material-icons mr-1" style={{fontSize: '16px'}}>schedule</i>
                      Isto pode demorar alguns segundos...
                    </small>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      {/* Estado de Erro */}
      {error && (
        <Row className="justify-content-center">
          <Col md="8">
            <Card>
              <CardBody className="text-center py-4">
                <i className="material-icons mb-3 text-danger" style={{fontSize: '48px'}}>
                  error_outline
                </i>
                <h5 className="text-danger">Erro na Análise</h5>
                <p className="text-muted mb-3">{error}</p>
                <Button 
                  theme="outline-primary" 
                  onClick={() => {
                    setError(null);
                    setResults(null);
                  }}
                >
                  Tentar Novamente
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      {/* Resultados */}
      {results && (
        <>
          {/* Resumo Geral */}
          <Row className="mb-4">
            <Col>
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="mb-1">
                        <i className="material-icons mr-2" style={{color: '#F5A623'}}>
                          analytics
                        </i>
                        Análise Concluída
                      </h5>
                      <p className="text-muted mb-0">
                        <strong>{results.totalMatches} sinergias</strong> encontradas em {' '}
                        {new Date(results.processedAt).toLocaleString('pt-PT')}
                      </p>
                    </div>
                    <Button 
                      theme="outline-secondary" 
                      size="sm"
                      onClick={() => setResults(null)}
                    >
                      Nova Análise
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Cards por Categoria */}
          <Row>
            {/* Empresas */}
            <Col lg="6" className="mb-4">
              <Card style={{ borderLeft: `4px solid ${getCategoryColor('EMPRESA')}` }}>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">
                      <i className="material-icons mr-2" style={{color: getCategoryColor('EMPRESA')}}>
                        {getCategoryIcon('EMPRESA')}
                      </i>
                      {getCategoryLabel('EMPRESA')}
                    </h6>
                    <span className="badge" style={{backgroundColor: getCategoryColor('EMPRESA'), color: '#fff'}}>
                      {results.empresas.totalFound} sinergia{results.empresas.totalFound !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {results.empresas.totalFound > 0 ? (
                    <>
                      <small className="text-muted d-block mb-2">
                        Score médio: {results.empresas.averageScore}%
                      </small>
                      
                      {results.empresas.topMatches.map((match, index) => (
                        <div key={index} className="mb-3 p-2 border rounded">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <small className="text-muted">{match.contributionType}</small>
                            <strong style={{color: getCategoryColor('EMPRESA')}}>{match.score}%</strong>
                          </div>
                          
                          {renderProgressBar(match.score)}
                          
                          <p className="mb-2 small">{match.explanation}</p>
                          
                          {match.commonTags.length > 0 && (
                            <div className="mb-2">
                              <small className="text-muted">Tags em comum: </small>
                              {match.commonTags.slice(0, 3).map((tag, i) => (
                                <span key={i} className="badge badge-light mr-1" style={{fontSize: '10px'}}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          <Button
                            size="sm"
                            theme="outline-primary"
                            onClick={() => handleSolicitarContato(match)}
                            style={{ fontSize: '11px' }}
                          >
                            📞 Solicitar Contato
                          </Button>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-3">
                      <i className="material-icons text-muted mb-2" style={{fontSize: '32px'}}>
                        sentiment_neutral
                      </i>
                      <p className="text-muted mb-0 small">
                        Nenhuma sinergia encontrada com empresas
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>

            {/* Municípios */}
            <Col lg="6" className="mb-4">
              <Card style={{ borderLeft: `4px solid ${getCategoryColor('MUNICIPIO')}` }}>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">
                      <i className="material-icons mr-2" style={{color: getCategoryColor('MUNICIPIO')}}>
                        {getCategoryIcon('MUNICIPIO')}
                      </i>
                      {getCategoryLabel('MUNICIPIO')}
                    </h6>
                    <span className="badge" style={{backgroundColor: getCategoryColor('MUNICIPIO'), color: '#fff'}}>
                      {results.municipios.totalFound} sinergia{results.municipios.totalFound !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {results.municipios.totalFound > 0 ? (
                    <>
                      <small className="text-muted d-block mb-2">
                        Score médio: {results.municipios.averageScore}%
                      </small>
                      
                      {results.municipios.topMatches.map((match, index) => (
                        <div key={index} className="mb-3 p-2 border rounded">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <small className="text-muted">{match.contributionType}</small>
                            <strong style={{color: getCategoryColor('MUNICIPIO')}}>{match.score}%</strong>
                          </div>
                          
                          {renderProgressBar(match.score)}
                          
                          <p className="mb-2 small">{match.explanation}</p>
                          
                          {match.commonTags.length > 0 && (
                            <div className="mb-2">
                              <small className="text-muted">Tags em comum: </small>
                              {match.commonTags.slice(0, 3).map((tag, i) => (
                                <span key={i} className="badge badge-light mr-1" style={{fontSize: '10px'}}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          <Button
                            size="sm"
                            theme="outline-primary"
                            onClick={() => handleSolicitarContato(match)}
                            style={{ fontSize: '11px' }}
                          >
                            📞 Solicitar Contato
                          </Button>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-3">
                      <i className="material-icons text-muted mb-2" style={{fontSize: '32px'}}>
                        sentiment_neutral
                      </i>
                      <p className="text-muted mb-0 small">
                        Nenhuma sinergia encontrada com municípios
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>

            {/* Academias */}
            <Col lg="6" className="mb-4">
              <Card style={{ borderLeft: `4px solid ${getCategoryColor('ACADEMIA')}` }}>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">
                      <i className="material-icons mr-2" style={{color: getCategoryColor('ACADEMIA')}}>
                        {getCategoryIcon('ACADEMIA')}
                      </i>
                      {getCategoryLabel('ACADEMIA')}
                    </h6>
                    <span className="badge" style={{backgroundColor: getCategoryColor('ACADEMIA'), color: '#fff'}}>
                      {results.academias.totalFound} sinergia{results.academias.totalFound !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {results.academias.totalFound > 0 ? (
                    <>
                      <small className="text-muted d-block mb-2">
                        Score médio: {results.academias.averageScore}%
                      </small>
                      
                      {results.academias.topMatches.map((match, index) => (
                        <div key={index} className="mb-3 p-2 border rounded">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <small className="text-muted">{match.contributionType}</small>
                            <strong style={{color: getCategoryColor('ACADEMIA')}}>{match.score}%</strong>
                          </div>
                          
                          {renderProgressBar(match.score)}
                          
                          <p className="mb-2 small">{match.explanation}</p>
                          
                          {match.commonTags.length > 0 && (
                            <div className="mb-2">
                              <small className="text-muted">Tags em comum: </small>
                              {match.commonTags.slice(0, 3).map((tag, i) => (
                                <span key={i} className="badge badge-light mr-1" style={{fontSize: '10px'}}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          <Button
                            size="sm"
                            theme="outline-primary"
                            onClick={() => handleSolicitarContato(match)}
                            style={{ fontSize: '11px' }}
                          >
                            📞 Solicitar Contato
                          </Button>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-3">
                      <i className="material-icons text-muted mb-2" style={{fontSize: '32px'}}>
                        sentiment_neutral
                      </i>
                      <p className="text-muted mb-0 small">
                        Nenhuma sinergia encontrada com academias
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>

            {/* Famílias */}
            <Col lg="6" className="mb-4">
              <Card style={{ borderLeft: `4px solid ${getCategoryColor('FAMILIA_ACOLHIMENTO')}` }}>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">
                      <i className="material-icons mr-2" style={{color: getCategoryColor('FAMILIA_ACOLHIMENTO')}}>
                        {getCategoryIcon('FAMILIA_ACOLHIMENTO')}
                      </i>
                      {getCategoryLabel('FAMILIA_ACOLHIMENTO')}
                    </h6>
                    <span className="badge" style={{backgroundColor: getCategoryColor('FAMILIA_ACOLHIMENTO'), color: '#fff'}}>
                      {results.familias.totalFound} sinergia{results.familias.totalFound !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {results.familias.totalFound > 0 ? (
                    <>
                      <small className="text-muted d-block mb-2">
                        Score médio: {results.familias.averageScore}%
                      </small>
                      
                      {results.familias.topMatches.map((match, index) => (
                        <div key={index} className="mb-3 p-2 border rounded">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <small className="text-muted">{match.contributionType}</small>
                            <strong style={{color: getCategoryColor('FAMILIA_ACOLHIMENTO')}}>{match.score}%</strong>
                          </div>
                          
                          {renderProgressBar(match.score)}
                          
                          <p className="mb-2 small">{match.explanation}</p>
                          
                          {match.commonTags.length > 0 && (
                            <div className="mb-2">
                              <small className="text-muted">Tags em comum: </small>
                              {match.commonTags.slice(0, 3).map((tag, i) => (
                                <span key={i} className="badge badge-light mr-1" style={{fontSize: '10px'}}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          <Button
                            size="sm"
                            theme="outline-primary"
                            onClick={() => handleSolicitarContato(match)}
                            style={{ fontSize: '11px' }}
                          >
                            📞 Solicitar Contato
                          </Button>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-3">
                      <i className="material-icons text-muted mb-2" style={{fontSize: '32px'}}>
                        sentiment_neutral
                      </i>
                      <p className="text-muted mb-0 small">
                        Nenhuma sinergia encontrada com famílias
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Informações Adicionais */}
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <h6 className="mb-3">
                    <i className="material-icons mr-2">info</i>
                    Como Funciona
                  </h6>
                  <Row>
                    <Col md="6">
                      <ul className="list-unstyled small">
                        <li className="mb-2">
                          <i className="material-icons mr-2 text-primary" style={{fontSize: '16px'}}>check_circle</i>
                          A IA analisa suas contribuições e tags
                        </li>
                        <li className="mb-2">
                          <i className="material-icons mr-2 text-primary" style={{fontSize: '16px'}}>check_circle</i>
                          Compara com outras entidades da rede
                        </li>
                        <li className="mb-2">
                          <i className="material-icons mr-2 text-primary" style={{fontSize: '16px'}}>check_circle</i>
                          Calcula porcentagem de compatibilidade
                        </li>
                      </ul>
                    </Col>
                    <Col md="6">
                      <ul className="list-unstyled small">
                        <li className="mb-2">
                          <i className="material-icons mr-2 text-warning" style={{fontSize: '16px'}}>privacy_tip</i>
                          Nomes das entidades são confidenciais
                        </li>
                        <li className="mb-2">
                          <i className="material-icons mr-2 text-warning" style={{fontSize: '16px'}}>support_agent</i>
                          Contactos via administração Madrilusa
                        </li>
                        <li className="mb-2">
                          <i className="material-icons mr-2 text-warning" style={{fontSize: '16px'}}>schedule</i>
                          1 análise por dia permitida
                        </li>
                      </ul>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default SinergIA;
