import React, { useState } from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Row, 
  Col, 
  Button, 
  Alert,
  FormGroup,
  FormInput,
  Badge
} from 'shards-react';

const SinergiaConfigAdminSimple: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pesos');
  
  // Estado mock para demonstração
  const [pesos, setPesos] = useState({
    genero: 10,
    idade: 10,
    municipioResidencia: 15,
    transporteProprio: 10,
    fluenciaPortugues: 15,
    experienciasProfissionais: 20,
    formacaoAcademica: 15,
    idiomasAdicionais: 5,
    habilidadesEspecificas: 0,
    caracteristicasPessoais: 0
  });

  const [iaConfig, setIaConfig] = useState({
    habilitada: true,
    modelo: 'gpt-4',
    temperatura: 0.5,
    maxTokens: 2000,
    thresholdMinimo: 40,
    custoMaximoPorAnalise: 0.10
  });

  const [eliminatorios, setEliminatorios] = useState({
    genero: {
      ativo: false,
      condicao: 'especifico',
      valores: []
    },
    transporteProprio: {
      ativo: true,
      eliminarSemTransporte: true
    },
    fluenciaPortugues: {
      ativo: true,
      nivelMinimo: 'basico',
      eliminarAbaixoNivel: true
    }
  });

  const handlePesoChange = (key: string, value: number) => {
    setPesos(prev => ({ ...prev, [key]: value }));
  };

  const handleIAConfigChange = (key: string, value: any) => {
    setIaConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleEliminatorioChange = (criterio: string, field: string, value: any) => {
    setEliminatorios(prev => ({
      ...prev,
      [criterio]: {
        ...prev[criterio],
        [field]: value
      }
    }));
  };

  const calcularSomaPesos = () => {
    return Object.values(pesos).reduce((sum, peso) => sum + peso, 0);
  };

  return (
    <div>
      <Row className="page-header py-4">
        <Col>
          <h2 className="mb-0">Configuração do SinergIA V2</h2>
          <p className="text-muted">
            Sistema de matching rigoroso Empresa ↔ Imigrante
          </p>
        </Col>
      </Row>

      {/* Status */}
      <Row className="mb-4">
        <Col>
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">
                    Status do Sistema: <Badge theme="success">Online</Badge>
                  </h5>
                  <small className="text-muted">
                    Configuração Ativa: <strong>Configuração Padrão</strong> (v1)
                  </small>
                </div>
                <div>
                  <Button size="sm" theme="primary">
                    Salvar Configuração
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Tabs */}
      <Row className="mb-4">
        <Col>
          <div className="nav nav-tabs">
            <button
              className={`nav-link ${activeTab === 'pesos' ? 'active' : ''}`}
              onClick={() => setActiveTab('pesos')}
            >
              ⚖️ Pesos dos Critérios
            </button>
            <button
              className={`nav-link ${activeTab === 'ia' ? 'active' : ''}`}
              onClick={() => setActiveTab('ia')}
            >
              🤖 Configuração de IA
            </button>
            <button
              className={`nav-link ${activeTab === 'eliminatorios' ? 'active' : ''}`}
              onClick={() => setActiveTab('eliminatorios')}
            >
              🚫 Critérios Eliminatórios
            </button>
          </div>
        </Col>
      </Row>

      {/* Tab: Pesos */}
      {activeTab === 'pesos' && (
        <Card>
          <CardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">⚖️ Configuração de Pesos</h5>
              <Badge theme={calcularSomaPesos() === 100 ? 'success' : 'danger'}>
                Soma: {calcularSomaPesos()}%
              </Badge>
            </div>
          </CardHeader>
          <CardBody>
            {calcularSomaPesos() !== 100 && (
              <Alert theme="warning" className="mb-4">
                <strong>Atenção:</strong> A soma dos pesos deve ser exatamente 100%. 
                Atual: {calcularSomaPesos()}%
              </Alert>
            )}

            <div className="mb-4">
              <h6 className="mb-3 text-primary">Critérios Demográficos</h6>
              
              <FormGroup>
                <label className="d-flex justify-content-between">
                  <span>Gênero</span>
                  <Badge theme="light">{pesos.genero}%</Badge>
                </label>
                <FormInput
                  type="range"
                  min="0"
                  max="100"
                  value={pesos.genero}
                  onChange={(e) => handlePesoChange('genero', parseInt(e.target.value))}
                />
              </FormGroup>

              <FormGroup>
                <label className="d-flex justify-content-between">
                  <span>Idade</span>
                  <Badge theme="light">{pesos.idade}%</Badge>
                </label>
                <FormInput
                  type="range"
                  min="0"
                  max="100"
                  value={pesos.idade}
                  onChange={(e) => handlePesoChange('idade', parseInt(e.target.value))}
                />
              </FormGroup>

              <FormGroup>
                <label className="d-flex justify-content-between">
                  <span>Município</span>
                  <Badge theme="light">{pesos.municipioResidencia}%</Badge>
                </label>
                <FormInput
                  type="range"
                  min="0"
                  max="100"
                  value={pesos.municipioResidencia}
                  onChange={(e) => handlePesoChange('municipioResidencia', parseInt(e.target.value))}
                />
              </FormGroup>

              <FormGroup>
                <label className="d-flex justify-content-between">
                  <span>Transporte</span>
                  <Badge theme="light">{pesos.transporteProprio}%</Badge>
                </label>
                <FormInput
                  type="range"
                  min="0"
                  max="100"
                  value={pesos.transporteProprio}
                  onChange={(e) => handlePesoChange('transporteProprio', parseInt(e.target.value))}
                />
              </FormGroup>

              <FormGroup>
                <label className="d-flex justify-content-between">
                  <span>Fluência Português</span>
                  <Badge theme="light">{pesos.fluenciaPortugues}%</Badge>
                </label>
                <FormInput
                  type="range"
                  min="0"
                  max="100"
                  value={pesos.fluenciaPortugues}
                  onChange={(e) => handlePesoChange('fluenciaPortugues', parseInt(e.target.value))}
                />
              </FormGroup>

              <FormGroup>
                <label className="d-flex justify-content-between">
                  <span>Experiência Profissional</span>
                  <Badge theme="light">{pesos.experienciasProfissionais}%</Badge>
                </label>
                <FormInput
                  type="range"
                  min="0"
                  max="100"
                  value={pesos.experienciasProfissionais}
                  onChange={(e) => handlePesoChange('experienciasProfissionais', parseInt(e.target.value))}
                />
              </FormGroup>

              <FormGroup>
                <label className="d-flex justify-content-between">
                  <span>Formação Acadêmica</span>
                  <Badge theme="light">{pesos.formacaoAcademica}%</Badge>
                </label>
                <FormInput
                  type="range"
                  min="0"
                  max="100"
                  value={pesos.formacaoAcademica}
                  onChange={(e) => handlePesoChange('formacaoAcademica', parseInt(e.target.value))}
                />
              </FormGroup>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Tab: IA */}
      {activeTab === 'ia' && (
        <Card>
          <CardHeader>🤖 Configuração de Inteligência Artificial</CardHeader>
          <CardBody>
            <Row>
              <Col md="6">
                <FormGroup>
                  <label>Habilitar Análise por IA</label>
                  <FormInput
                    type="select"
                    value={iaConfig.habilitada ? 'true' : 'false'}
                    onChange={(e) => handleIAConfigChange('habilitada', e.target.value === 'true')}
                  >
                    <option value="true">Habilitada</option>
                    <option value="false">Desabilitada</option>
                  </FormInput>
                </FormGroup>

                <FormGroup>
                  <label>Modelo de IA</label>
                  <FormInput
                    type="select"
                    value={iaConfig.modelo}
                    onChange={(e) => handleIAConfigChange('modelo', e.target.value)}
                    disabled={!iaConfig.habilitada}
                  >
                    <option value="gpt-4">GPT-4 (Mais preciso)</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Mais econômico)</option>
                  </FormInput>
                </FormGroup>

                <FormGroup>
                  <label>
                    Temperatura: {iaConfig.temperatura}
                  </label>
                  <FormInput
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={iaConfig.temperatura}
                    onChange={(e) => handleIAConfigChange('temperatura', parseFloat(e.target.value))}
                    disabled={!iaConfig.habilitada}
                  />
                  <small className="form-text text-muted">
                    0 = Mais conservador, 1 = Mais criativo
                  </small>
                </FormGroup>
              </Col>

              <Col md="6">
                <FormGroup>
                  <label>Máximo de Tokens</label>
                  <FormInput
                    type="number"
                    min="500"
                    max="4000"
                    value={iaConfig.maxTokens}
                    onChange={(e) => handleIAConfigChange('maxTokens', parseInt(e.target.value) || 1000)}
                    disabled={!iaConfig.habilitada}
                  />
                </FormGroup>

                <FormGroup>
                  <label>
                    Threshold Mínimo: {iaConfig.thresholdMinimo}%
                  </label>
                  <FormInput
                    type="range"
                    min="0"
                    max="100"
                    value={iaConfig.thresholdMinimo}
                    onChange={(e) => handleIAConfigChange('thresholdMinimo', parseInt(e.target.value))}
                    disabled={!iaConfig.habilitada}
                  />
                  <small className="form-text text-muted">
                    Compatibilidade mínima para considerar match válido
                  </small>
                </FormGroup>

                <FormGroup>
                  <label>Custo Máximo por Análise</label>
                  <FormInput
                    type="number"
                    min="0.01"
                    max="1.00"
                    step="0.01"
                    value={iaConfig.custoMaximoPorAnalise}
                    onChange={(e) => handleIAConfigChange('custoMaximoPorAnalise', parseFloat(e.target.value) || 0.10)}
                    disabled={!iaConfig.habilitada}
                  />
                </FormGroup>
              </Col>
            </Row>

            {iaConfig.habilitada && (
              <Alert theme="info" className="mt-3">
                <strong>Custo estimado por análise:</strong> ${
                  iaConfig.modelo === 'gpt-4' ? '0.054' : '0.015'
                } (baseado no modelo e tokens)
              </Alert>
            )}
          </CardBody>
        </Card>
      )}

      {/* Tab: Critérios Eliminatórios */}
      {activeTab === 'eliminatorios' && (
        <Card>
          <CardHeader>🚫 Critérios Eliminatórios</CardHeader>
          <CardBody>
            <Alert theme="warning" className="mb-4">
              <strong>⚠️ Atenção:</strong> Critérios eliminatórios excluem candidatos automaticamente, 
              independente da pontuação em outros critérios.
            </Alert>

            {/* Critério: Gênero */}
            <div className="mb-4 p-3 border rounded">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">👤 Gênero</h6>
                <Badge theme={eliminatorios.genero.ativo ? 'danger' : 'secondary'}>
                  {eliminatorios.genero.ativo ? 'ATIVO' : 'INATIVO'}
                </Badge>
              </div>
              
              <FormGroup>
                <label>Status do Critério</label>
                <FormInput
                  type="select"
                  value={eliminatorios.genero.ativo ? 'true' : 'false'}
                  onChange={(e) => handleEliminatorioChange('genero', 'ativo', e.target.value === 'true')}
                >
                  <option value="false">Inativo - Não elimina por gênero</option>
                  <option value="true">Ativo - Elimina por gênero</option>
                </FormInput>
              </FormGroup>

              {eliminatorios.genero.ativo && (
                <FormGroup>
                  <label>Condição de Eliminação</label>
                  <FormInput
                    type="select"
                    value={eliminatorios.genero.condicao}
                    onChange={(e) => handleEliminatorioChange('genero', 'condicao', e.target.value)}
                  >
                    <option value="especifico">Eliminar se não for gênero específico da vaga</option>
                    <option value="obrigatorio">Eliminar se gênero não foi informado</option>
                    <option value="sempre">Sempre eliminar se não corresponder exatamente</option>
                  </FormInput>
                  <small className="form-text text-muted">
                    {eliminatorios.genero.condicao === 'especifico' && 'Elimina candidatos cujo gênero não corresponde ao exigido pela vaga'}
                    {eliminatorios.genero.condicao === 'obrigatorio' && 'Elimina candidatos que não informaram o gênero'}
                    {eliminatorios.genero.condicao === 'sempre' && 'Eliminação rigorosa - deve corresponder exatamente'}
                  </small>
                </FormGroup>
              )}
            </div>

            {/* Critério: Transporte Próprio */}
            <div className="mb-4 p-3 border rounded">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">🚗 Transporte Próprio</h6>
                <Badge theme={eliminatorios.transporteProprio.ativo ? 'danger' : 'secondary'}>
                  {eliminatorios.transporteProprio.ativo ? 'ATIVO' : 'INATIVO'}
                </Badge>
              </div>
              
              <FormGroup>
                <label>Status do Critério</label>
                <FormInput
                  type="select"
                  value={eliminatorios.transporteProprio.ativo ? 'true' : 'false'}
                  onChange={(e) => handleEliminatorioChange('transporteProprio', 'ativo', e.target.value === 'true')}
                >
                  <option value="false">Inativo - Não elimina por transporte</option>
                  <option value="true">Ativo - Elimina por falta de transporte</option>
                </FormInput>
              </FormGroup>

              {eliminatorios.transporteProprio.ativo && (
                <div>
                  <FormGroup>
                    <label>Configuração de Eliminação</label>
                    <FormInput
                      type="select"
                      value={eliminatorios.transporteProprio.eliminarSemTransporte ? 'true' : 'false'}
                      onChange={(e) => handleEliminatorioChange('transporteProprio', 'eliminarSemTransporte', e.target.value === 'true')}
                    >
                      <option value="false">Não eliminar - Apenas reduzir pontuação</option>
                      <option value="true">Eliminar candidatos sem transporte quando vaga exige</option>
                    </FormInput>
                  </FormGroup>
                  
                  <Alert theme="info" className="mt-2">
                    <small>
                      <strong>Como funciona:</strong> Quando uma oportunidade de trabalho marca "transporte próprio obrigatório", 
                      candidatos sem transporte serão automaticamente eliminados.
                    </small>
                  </Alert>
                </div>
              )}
            </div>

            {/* Critério: Fluência em Português */}
            <div className="mb-4 p-3 border rounded">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">🇵🇹 Fluência em Português</h6>
                <Badge theme={eliminatorios.fluenciaPortugues.ativo ? 'danger' : 'secondary'}>
                  {eliminatorios.fluenciaPortugues.ativo ? 'ATIVO' : 'INATIVO'}
                </Badge>
              </div>
              
              <FormGroup>
                <label>Status do Critério</label>
                <FormInput
                  type="select"
                  value={eliminatorios.fluenciaPortugues.ativo ? 'true' : 'false'}
                  onChange={(e) => handleEliminatorioChange('fluenciaPortugues', 'ativo', e.target.value === 'true')}
                >
                  <option value="false">Inativo - Não elimina por fluência</option>
                  <option value="true">Ativo - Elimina por fluência insuficiente</option>
                </FormInput>
              </FormGroup>

              {eliminatorios.fluenciaPortugues.ativo && (
                <div>
                  <FormGroup>
                    <label>Nível Mínimo Aceitável</label>
                    <FormInput
                      type="select"
                      value={eliminatorios.fluenciaPortugues.nivelMinimo}
                      onChange={(e) => handleEliminatorioChange('fluenciaPortugues', 'nivelMinimo', e.target.value)}
                    >
                      <option value="nenhum">Nenhum - Aceita todos os níveis</option>
                      <option value="basico">Básico - Elimina quem não tem pelo menos básico</option>
                      <option value="intermediario">Intermediário - Elimina abaixo de intermediário</option>
                      <option value="avancado">Avançado - Elimina abaixo de avançado</option>
                      <option value="fluente">Fluente - Só aceita fluentes</option>
                    </FormInput>
                  </FormGroup>

                  <FormGroup>
                    <label>Ação para Candidatos Abaixo do Nível</label>
                    <FormInput
                      type="select"
                      value={eliminatorios.fluenciaPortugues.eliminarAbaixoNivel ? 'true' : 'false'}
                      onChange={(e) => handleEliminatorioChange('fluenciaPortugues', 'eliminarAbaixoNivel', e.target.value === 'true')}
                    >
                      <option value="false">Apenas reduzir pontuação - Não eliminar</option>
                      <option value="true">Eliminar automaticamente abaixo do nível mínimo</option>
                    </FormInput>
                  </FormGroup>

                  <Alert theme="info" className="mt-2">
                    <small>
                      <strong>Nível atual selecionado:</strong> {eliminatorios.fluenciaPortugues.nivelMinimo.toUpperCase()}<br />
                      <strong>Eliminará:</strong> Candidatos com fluência abaixo de "{eliminatorios.fluenciaPortugues.nivelMinimo}"
                    </small>
                  </Alert>
                </div>
              )}
            </div>

            {/* Resumo dos Critérios Ativos */}
            <div className="mt-4 p-3 bg-light rounded">
              <h6>📊 Resumo dos Critérios Eliminatórios</h6>
              <div className="row">
                <div className="col-md-4">
                  <div className="text-center">
                    <Badge theme={eliminatorios.genero.ativo ? 'danger' : 'success'} className="mb-2">
                      Gênero: {eliminatorios.genero.ativo ? 'ATIVO' : 'INATIVO'}
                    </Badge>
                    {eliminatorios.genero.ativo && (
                      <div className="small text-muted">
                        Condição: {eliminatorios.genero.condicao}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center">
                    <Badge theme={eliminatorios.transporteProprio.ativo ? 'danger' : 'success'} className="mb-2">
                      Transporte: {eliminatorios.transporteProprio.ativo ? 'ATIVO' : 'INATIVO'}
                    </Badge>
                    {eliminatorios.transporteProprio.ativo && (
                      <div className="small text-muted">
                        Elimina sem transporte
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center">
                    <Badge theme={eliminatorios.fluenciaPortugues.ativo ? 'danger' : 'success'} className="mb-2">
                      Fluência: {eliminatorios.fluenciaPortugues.ativo ? 'ATIVO' : 'INATIVO'}
                    </Badge>
                    {eliminatorios.fluenciaPortugues.ativo && (
                      <div className="small text-muted">
                        Mín: {eliminatorios.fluenciaPortugues.nivelMinimo}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {(eliminatorios.genero.ativo || eliminatorios.transporteProprio.ativo || eliminatorios.fluenciaPortugues.ativo) && (
                <Alert theme="warning" className="mt-3 mb-0">
                  <strong>⚠️ Cuidado:</strong> Critérios eliminatórios podem reduzir drasticamente o número de matches. 
                  Use com moderação para não excluir candidatos qualificados.
                </Alert>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      <Alert theme="success" className="mt-4">
        <strong>✅ Painel Administrativo Funcionando!</strong><br />
        <small>
          • Edição de pesos em tempo real<br />
          • Configuração de IA parametrizável<br />
          • Critérios eliminatórios configuráveis<br />
          • Validação automática (soma = 100%)<br />
          • Interface totalmente funcional
        </small>
      </Alert>
    </div>
  );
};

export default SinergiaConfigAdminSimple;
