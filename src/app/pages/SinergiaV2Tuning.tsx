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
  Progress,
  FormGroup,
  FormInput
} from 'shards-react';
import PageTitle from '../components/common/PageTitle';
import { useToast } from '@/hooks/use-toast';

interface TuningRecommendation {
  criterio: string;
  pesoAtual: number;
  pesoSugerido: number;
  justificativa: string;
  confianca: number;
  baseadoEm: number;
}

interface AlgorithmTuning {
  currentWeights: Record<string, number>;
  suggestedWeights: Record<string, number>;
  recommendations: TuningRecommendation[];
  confidence: number;
  basedOnFeedbacks: number;
}

interface FeedbackStats {
  totalFeedbacks: number;
  recentFeedbacks: number;
  avgScoreOriginal: number;
  avgScorePercebido: number;
  scoreDifference: number;
  relevanceRate: number;
  topCriteriaImportant: { criterio: string; frequency: number }[];
}

const SinergiaV2Tuning: React.FC = () => {
  const [tuningData, setTuningData] = useState<AlgorithmTuning | null>(null);
  const [feedbackStats, setFeedbackStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [customWeights, setCustomWeights] = useState<Record<string, number>>({});
  const { toast } = useToast();

  const criteriosLabels: Record<string, string> = {
    'genero': 'Género',
    'idade': 'Idade',
    'municipio': 'Localização',
    'transporteProprio': 'Transporte Próprio',
    'fluenciaPortugues': 'Fluência em Português',
    'experiencias': 'Experiências Profissionais',
    'formacao': 'Formação Acadêmica',
    'idiomas': 'Idiomas',
    'habilidades': 'Habilidades Técnicas',
    'caracteristicas': 'Características Pessoais'
  };

  useEffect(() => {
    loadTuningData();
    loadFeedbackStats();
  }, []);

  const loadTuningData = async () => {
    try {
      const response = await fetch('/api/sinergia-v2/tuning/recommendations');
      const data = await response.json();
      
      if (data.success) {
        setTuningData(data.data);
        setCustomWeights(data.data.currentWeights);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Erro ao carregar dados de tuning:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar recomendações de tuning",
        variant: "destructive",
      });
    }
  };

  const loadFeedbackStats = async () => {
    try {
      const response = await fetch('/api/sinergia-v2/feedback/stats');
      const data = await response.json();
      
      if (data.success) {
        setFeedbackStats(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Erro ao carregar stats de feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'success';
    if (confidence >= 60) return 'info';
    if (confidence >= 40) return 'warning';
    return 'danger';
  };

  const handleWeightChange = (criterio: string, value: number) => {
    setCustomWeights(prev => ({
      ...prev,
      [criterio]: Math.max(0, Math.min(30, value)) // Limite 0-30%
    }));
  };

  const applyRecommendations = () => {
    if (!tuningData) return;
    
    const newWeights = { ...customWeights };
    tuningData.recommendations.forEach(rec => {
      if (rec.confianca >= 60) {
        newWeights[rec.criterio] = rec.pesoSugerido;
      }
    });
    
    setCustomWeights(newWeights);
    
    toast({
      title: "✅ Recomendações Aplicadas",
      description: "Pesos ajustados conforme recomendações de alta confiança",
    });
  };

  const resetWeights = () => {
    if (!tuningData) return;
    setCustomWeights(tuningData.currentWeights);
    
    toast({
      title: "Pesos Restaurados",
      description: "Voltou aos pesos padrão do sistema",
    });
  };

  if (loading) {
    return (
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
          <PageTitle 
            title="SinergIA V2 - Tuning" 
            subtitle="Ajuste e otimização do algoritmo baseado em feedback"
          />
        </Row>
        <Row>
          <Col>
            <Card>
              <CardBody className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Carregando...</span>
                </div>
                <p className="mt-3 text-muted">Carregando dados de tuning...</p>
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
          title="SinergIA V2 - Tuning & Otimização" 
          subtitle="Ajuste do algoritmo baseado em feedback real dos usuários"
        />
      </Row>

      {/* Estatísticas de Feedback */}
      {feedbackStats && (
        <Row className="mb-4">
          <Col lg={2} md={4} sm={6} className="mb-3">
            <Card className="stats-small">
              <CardBody className="p-3">
                <div className="d-flex align-items-center">
                  <div className="icon-wrapper rounded-circle bg-info text-white mr-3">
                    <i className="material-icons">feedback</i>
                  </div>
                  <div>
                    <span className="stats-small__value text-dark">{feedbackStats.totalFeedbacks}</span>
                    <span className="stats-small__label text-uppercase text-muted">Feedbacks</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col lg={2} md={4} sm={6} className="mb-3">
            <Card className="stats-small">
              <CardBody className="p-3">
                <div className="d-flex align-items-center">
                  <div className="icon-wrapper rounded-circle bg-primary text-white mr-3">
                    <i className="material-icons">trending_up</i>
                  </div>
                  <div>
                    <span className="stats-small__value text-dark">{feedbackStats.scoreDifference > 0 ? '+' : ''}{feedbackStats.scoreDifference}%</span>
                    <span className="stats-small__label text-uppercase text-muted">Diferença</span>
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
                    <i className="material-icons">thumb_up</i>
                  </div>
                  <div>
                    <span className="stats-small__value text-dark">{feedbackStats.relevanceRate}%</span>
                    <span className="stats-small__label text-uppercase text-muted">Relevância</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      {/* Recomendações de Tuning */}
      {tuningData && tuningData.recommendations.length > 0 && (
        <Row className="mb-4">
          <Col>
            <Card>
              <CardHeader>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Recomendações de Tuning</h5>
                  <Badge theme={getConfidenceColor(tuningData.confidence)}>
                    {Math.round(tuningData.confidence)}% confiança
                  </Badge>
                </div>
              </CardHeader>
              <CardBody>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Critério</th>
                        <th>Peso Atual</th>
                        <th>Peso Sugerido</th>
                        <th>Confiança</th>
                        <th>Justificativa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tuningData.recommendations.map((rec, index) => (
                        <tr key={index}>
                          <td className="font-weight-medium">
                            {criteriosLabels[rec.criterio] || rec.criterio}
                          </td>
                          <td>{rec.pesoAtual}%</td>
                          <td>
                            <span className={rec.pesoSugerido > rec.pesoAtual ? 'text-success' : 'text-warning'}>
                              {rec.pesoSugerido}%
                              {rec.pesoSugerido > rec.pesoAtual ? ' ↑' : ' ↓'}
                            </span>
                          </td>
                          <td>
                            <Badge theme={getConfidenceColor(rec.confianca)}>
                              {Math.round(rec.confianca)}%
                            </Badge>
                          </td>
                          <td>
                            <small>{rec.justificativa}</small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-3">
                  <Button 
                    theme="primary" 
                    className="mr-2"
                    onClick={applyRecommendations}
                  >
                    <i className="material-icons mr-1">auto_fix_high</i>
                    Aplicar Recomendações de Alta Confiança
                  </Button>
                  <Button 
                    theme="outline-secondary"
                    onClick={resetWeights}
                  >
                    <i className="material-icons mr-1">refresh</i>
                    Restaurar Pesos Padrão
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      {/* Editor Manual de Pesos */}
      {tuningData && (
        <Row className="mb-4">
          <Col>
            <Card>
              <CardHeader>
                <h5 className="mb-0">Ajuste Manual de Pesos</h5>
              </CardHeader>
              <CardBody>
                <Row>
                  {Object.entries(customWeights).map(([criterio, peso]) => (
                    <Col key={criterio} md={4} className="mb-3">
                      <FormGroup>
                        <label>{criteriosLabels[criterio] || criterio}</label>
                        <div className="d-flex align-items-center">
                          <FormInput
                            type="number"
                            min="0"
                            max="30"
                            step="1"
                            value={peso}
                            onChange={(e) => handleWeightChange(criterio, parseInt(e.target.value) || 0)}
                            style={{ maxWidth: '80px' }}
                          />
                          <span className="ml-2 text-muted">%</span>
                          <div className="ml-3 flex-grow-1">
                            <Progress 
                              value={(peso / 30) * 100} 
                              theme={peso > 15 ? 'warning' : 'info'}
                              style={{ height: '6px' }}
                            />
                          </div>
                        </div>
                      </FormGroup>
                    </Col>
                  ))}
                </Row>
                
                <div className="mt-3 p-3 bg-light rounded">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Total dos Pesos:</span>
                    <span className="font-weight-bold">
                      {Object.values(customWeights).reduce((sum, peso) => sum + peso, 0)}%
                    </span>
                  </div>
                  <small className="text-muted">
                    Recomendado: 100% total. Ajuste os pesos conforme a importância de cada critério.
                  </small>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      {/* Critérios Mais Importantes para Usuários */}
      {feedbackStats && feedbackStats.topCriteriaImportant.length > 0 && (
        <Row className="mb-4">
          <Col md={6}>
            <Card>
              <CardHeader>
                <h5 className="mb-0">Critérios Mais Valorizados</h5>
              </CardHeader>
              <CardBody>
                {feedbackStats.topCriteriaImportant.map((criteria, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <span className="font-weight-medium">
                        {criteriosLabels[criteria.criterio] || criteria.criterio}
                      </span>
                    </div>
                    <div className="d-flex align-items-center">
                      <div className="mr-3" style={{ width: '100px' }}>
                        <Progress 
                          value={criteria.frequency * 100}
                          theme="primary"
                          style={{ height: '8px' }}
                        />
                      </div>
                      <Badge theme="primary">
                        {Math.round(criteria.frequency * 100)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>
          </Col>

          <Col md={6}>
            <Card>
              <CardHeader>
                <h5 className="mb-0">Análise de Discrepâncias</h5>
              </CardHeader>
              <CardBody>
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>Score Médio Calculado:</span>
                    <span className="font-weight-bold">{feedbackStats.avgScoreOriginal}%</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>Score Médio Percebido:</span>
                    <span className="font-weight-bold">{feedbackStats.avgScorePercebido}%</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>Diferença:</span>
                    <span className={`font-weight-bold ${feedbackStats.scoreDifference > 0 ? 'text-success' : 'text-warning'}`}>
                      {feedbackStats.scoreDifference > 0 ? '+' : ''}{feedbackStats.scoreDifference}%
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>Taxa de Relevância:</span>
                    <span className="font-weight-bold text-success">{feedbackStats.relevanceRate}%</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h6>Interpretação:</h6>
                  <small className="text-muted">
                    {feedbackStats.scoreDifference > 10 && 
                      "⚠️ Sistema está subestimando compatibilidades. Considere aumentar pesos dos critérios mais valorizados."
                    }
                    {feedbackStats.scoreDifference < -10 && 
                      "⚠️ Sistema está superestimando compatibilidades. Considere ser mais rigoroso nos critérios."
                    }
                    {Math.abs(feedbackStats.scoreDifference) <= 10 && 
                      "✅ Sistema está bem calibrado. Diferença entre calculado e percebido é aceitável."
                    }
                  </small>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      {/* Ações Administrativas */}
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <h5 className="mb-0">Ações de Tuning</h5>
            </CardHeader>
            <CardBody>
              <div className="d-flex flex-wrap">
                <Button 
                  theme="primary" 
                  className="mr-2 mb-2"
                  onClick={loadTuningData}
                  disabled={loading}
                >
                  <i className="material-icons mr-1">refresh</i>
                  Atualizar Dados
                </Button>
                
                <Button 
                  theme="success" 
                  className="mr-2 mb-2"
                  onClick={applyRecommendations}
                  disabled={!tuningData || tuningData.recommendations.length === 0}
                >
                  <i className="material-icons mr-1">auto_fix_high</i>
                  Aplicar Sugestões IA
                </Button>
                
                <Button 
                  theme="warning" 
                  className="mr-2 mb-2"
                  onClick={resetWeights}
                  disabled={!tuningData}
                >
                  <i className="material-icons mr-1">restore</i>
                  Restaurar Padrão
                </Button>
                
                <Button 
                  theme="outline-info" 
                  className="mr-2 mb-2"
                  onClick={() => {
                    const data = {
                      tuningData,
                      feedbackStats,
                      customWeights,
                      exportedAt: new Date().toISOString()
                    };
                    
                    const dataStr = JSON.stringify(data, null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(dataBlob);
                    
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `sinergia-v2-tuning-${new Date().toISOString().split('T')[0]}.json`;
                    link.click();
                    
                    URL.revokeObjectURL(url);
                  }}
                >
                  <i className="material-icons mr-1">download</i>
                  Exportar Configuração
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SinergiaV2Tuning;
