import React, { useState, useEffect } from 'react';
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
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Badge
} from 'shards-react';
import { useConfiguracaoSinergia } from '@/hooks/useConfiguracaoSinergia';

const SinergiaConfigAdmin: React.FC = () => {
  const {
    configuracaoAtiva,
    configuracaoEditando,
    statusSistema,
    isLoading,
    isSaving,
    isDirty,
    canSave,
    error,
    atualizarConfiguracaoEditando,
    salvarConfiguracao,
    resetarParaAtiva,
    simularImpacto
  } = useConfiguracaoSinergia();

  const [activeTab, setActiveTab] = useState('pesos');
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  // Inicializar configuração editando quando ativa carregar
  useEffect(() => {
    if (configuracaoAtiva && !configuracaoEditando) {
      atualizarConfiguracaoEditando(configuracaoAtiva);
    }
  }, [configuracaoAtiva, configuracaoEditando, atualizarConfiguracaoEditando]);

  const handlePesoChange = (key: string, value: number) => {
    if (!configuracaoEditando) return;
    
    const novosPesos = { ...configuracaoEditando.pesos, [key]: value };
    atualizarConfiguracaoEditando({
      ...configuracaoEditando,
      pesos: novosPesos
    });
  };

  const handleIAConfigChange = (key: string, value: any) => {
    if (!configuracaoEditando) return;
    
    atualizarConfiguracaoEditando({
      ...configuracaoEditando,
      iaConfig: {
        ...configuracaoEditando.iaConfig,
        [key]: value
      }
    });
  };

  const handleEliminatorioChange = (key: string, field: string, value: any) => {
    if (!configuracaoEditando) return;
    
    atualizarConfiguracaoEditando({
      ...configuracaoEditando,
      eliminatorios: {
        ...configuracaoEditando.eliminatorios,
        [key]: {
          ...configuracaoEditando.eliminatorios[key],
          [field]: value
        }
      }
    });
  };

  const handleSimular = async () => {
    const resultado = await simularImpacto();
    setSimulationResult(resultado);
  };

  const handleSalvar = async () => {
    setShowSaveConfirm(false);
    try {
      await salvarConfiguracao(
        `Config ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`,
        'Configuração criada via interface administrativa',
        false
      );
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const calcularSomaPesos = () => {
    if (!configuracaoEditando) return 0;
    return Object.values(configuracaoEditando.pesos).reduce((sum: number, peso: any) => sum + (peso as number), 0);
  };

  if (isLoading) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Carregando...</span>
            </div>
            <p className="mt-3">Carregando configurações...</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardBody>
          <Alert theme="danger">
            <strong>Erro ao carregar configurações:</strong> {error}
          </Alert>
        </CardBody>
      </Card>
    );
  }

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

      {/* Status do Sistema */}
      <Row className="mb-4">
        <Col>
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">
                    Status do Sistema: <Badge theme={statusSistema?.status === 'online' ? 'success' : 'warning'}>
                      {statusSistema?.status || 'Desconhecido'}
                    </Badge>
                  </h5>
                  <small className="text-muted">
                    Configuração Ativa: <strong>{configuracaoAtiva?.nome || 'Nenhuma'}</strong> 
                    {configuracaoAtiva && ` (v${configuracaoAtiva.versao})`}
                  </small>
                </div>
                <div>
                  {isDirty && (
                    <Badge theme="warning" className="mr-2">
                      Alterações não salvas
                    </Badge>
                  )}
                  <Button
                    size="sm"
                    theme="secondary"
                    className="mr-2"
                    onClick={resetarParaAtiva}
                    disabled={!isDirty}
                  >
                    Descartar Alterações
                  </Button>
                  <Button
                    size="sm"
                    theme="primary"
                    onClick={() => setShowSaveConfirm(true)}
                    disabled={!canSave}
                  >
                    Salvar Configuração
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Tabs de navegação */}
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
            <button
              className={`nav-link ${activeTab === 'simulacao' ? 'active' : ''}`}
              onClick={() => setActiveTab('simulacao')}
            >
              🧪 Simulação
            </button>
          </div>
        </Col>
      </Row>

      {/* Tab: Pesos dos Critérios */}
      {activeTab === 'pesos' && configuracaoEditando && (
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

            {/* Critérios Demográficos */}
            <div className="mb-4">
              <h6 className="mb-3 text-primary">Critérios Demográficos</h6>
              
              <FormGroup>
                <label className="d-flex justify-content-between">
                  <span>Gênero</span>
                  <Badge theme="light">{configuracaoEditando.pesos.genero}%</Badge>
                </label>
                <FormInput
                  type="range"
                  min="0"
                  max="100"
                  value={configuracaoEditando.pesos.genero}
                  onChange={(e) => handlePesoChange('genero', parseInt(e.target.value))}
                />
              </FormGroup>

              <FormGroup>
                <label className="d-flex justify-content-between">
                  <span>Idade</span>
                  <Badge theme="light">{configuracaoEditando.pesos.idade}%</Badge>
                </label>
                <FormInput
                  type="range"
                  min="0"
                  max="100"
                  value={configuracaoEditando.pesos.idade}
                  onChange={(e) => handlePesoChange('idade', parseInt(e.target.value))}
                />
              </FormGroup>

              <FormGroup>
                <label className="d-flex justify-content-between">
                  <span>Município de Residência</span>
                  <Badge theme="light">{configuracaoEditando.pesos.municipioResidencia}%</Badge>
                </label>
                <FormInput
                  type="range"
                  min="0"
                  max="100"
                  value={configuracaoEditando.pesos.municipioResidencia}
                  onChange={(e) => handlePesoChange('municipioResidencia', parseInt(e.target.value))}
                />
              </FormGroup>
            </div>

            {/* Critérios Essenciais */}
            <div className="mb-4">
              <h6 className="mb-3 text-primary">Critérios Essenciais</h6>
              
              <FormGroup>
                <label className="d-flex justify-content-between">
                  <span>Transporte Próprio</span>
                  <Badge theme="light">{configuracaoEditando.pesos.transporteProprio}%</Badge>
                </label>
                <FormInput
                  type="range"
                  min="0"
                  max="100"
                  value={configuracaoEditando.pesos.transporteProprio}
                  onChange={(e) => handlePesoChange('transporteProprio', parseInt(e.target.value))}
                />
              </FormGroup>

              <FormGroup>
                <label className="d-flex justify-content-between">
                  <span>Fluência em Português</span>
                  <Badge theme="light">{configuracaoEditando.pesos.fluenciaPortugues}%</Badge>
                </label>
                <FormInput
                  type="range"
                  min="0"
                  max="100"
                  value={configuracaoEditando.pesos.fluenciaPortugues}
                  onChange={(e) => handlePesoChange('fluenciaPortugues', parseInt(e.target.value))}
                />
              </FormGroup>
            </div>

            {/* Critérios Profissionais */}
            <div className="mb-4">
              <h6 className="mb-3 text-primary">Critérios Profissionais</h6>
              
              <FormGroup>
                <label className="d-flex justify-content-between">
                  <span>Experiências Profissionais</span>
                  <Badge theme="light">{configuracaoEditando.pesos.experienciasProfissionais}%</Badge>
                </label>
                <FormInput
                  type="range"
                  min="0"
                  max="100"
                  value={configuracaoEditando.pesos.experienciasProfissionais}
                  onChange={(e) => handlePesoChange('experienciasProfissionais', parseInt(e.target.value))}
                />
              </FormGroup>

              <FormGroup>
                <label className="d-flex justify-content-between">
                  <span>Formação Acadêmica</span>
                  <Badge theme="light">{configuracaoEditando.pesos.formacaoAcademica}%</Badge>
                </label>
                <FormInput
                  type="range"
                  min="0"
                  max="100"
                  value={configuracaoEditando.pesos.formacaoAcademica}
                  onChange={(e) => handlePesoChange('formacaoAcademica', parseInt(e.target.value))}
                />
              </FormGroup>
            </div>

            {/* Critérios Complementares */}
            <div className="mb-4">
              <h6 className="mb-3 text-primary">Critérios Complementares</h6>
              
              <FormGroup>
                <label className="d-flex justify-content-between">
                  <span>Idiomas Adicionais</span>
                  <Badge theme="light">{configuracaoEditando.pesos.idiomasAdicionais}%</Badge>
                </label>
                <FormInput
                  type="range"
                  min="0"
                  max="100"
                  value={configuracaoEditando.pesos.idiomasAdicionais}
                  onChange={(e) => handlePesoChange('idiomasAdicionais', parseInt(e.target.value))}
                />
              </FormGroup>

              <FormGroup>
                <label className="d-flex justify-content-between">
                  <span>Habilidades Específicas</span>
                  <Badge theme="light">{configuracaoEditando.pesos.habilidadesEspecificas}%</Badge>
                </label>
                <FormInput
                  type="range"
                  min="0"
                  max="100"
                  value={configuracaoEditando.pesos.habilidadesEspecificas}
                  onChange={(e) => handlePesoChange('habilidadesEspecificas', parseInt(e.target.value))}
                />
              </FormGroup>

              <FormGroup>
                <label className="d-flex justify-content-between">
                  <span>Características Pessoais</span>
                  <Badge theme="light">{configuracaoEditando.pesos.caracteristicasPessoais}%</Badge>
                </label>
                <FormInput
                  type="range"
                  min="0"
                  max="100"
                  value={configuracaoEditando.pesos.caracteristicasPessoais}
                  onChange={(e) => handlePesoChange('caracteristicasPessoais', parseInt(e.target.value))}
                />
              </FormGroup>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Tab: Configuração de IA */}
      {activeTab === 'ia' && configuracaoEditando && (
        <Card>
          <CardHeader>🤖 Configuração de Inteligência Artificial</CardHeader>
          <CardBody>
            <Row>
              <Col md="6">
                <FormGroup>
                  <label>Habilitar Análise por IA</label>
                  <FormInput
                    type="select"
                    value={configuracaoEditando.iaConfig.habilitada ? 'true' : 'false'}
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
                    value={configuracaoEditando.iaConfig.modelo}
                    onChange={(e) => handleIAConfigChange('modelo', e.target.value)}
                    disabled={!configuracaoEditando.iaConfig.habilitada}
                  >
                    <option value="gpt-4">GPT-4 (Mais preciso)</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Mais econômico)</option>
                  </FormInput>
                </FormGroup>

                <FormGroup>
                  <label>
                    Temperatura: {configuracaoEditando.iaConfig.temperatura}
                  </label>
                  <FormInput
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={configuracaoEditando.iaConfig.temperatura}
                    onChange={(e) => handleIAConfigChange('temperatura', parseFloat(e.target.value))}
                    disabled={!configuracaoEditando.iaConfig.habilitada}
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
                    value={configuracaoEditando.iaConfig.maxTokens}
                    onChange={(e) => handleIAConfigChange('maxTokens', parseInt(e.target.value) || 1000)}
                    disabled={!configuracaoEditando.iaConfig.habilitada}
                  />
                </FormGroup>

                <FormGroup>
                  <label>
                    Threshold Mínimo: {configuracaoEditando.iaConfig.thresholdMinimo}%
                  </label>
                  <FormInput
                    type="range"
                    min="0"
                    max="100"
                    value={configuracaoEditando.iaConfig.thresholdMinimo}
                    onChange={(e) => handleIAConfigChange('thresholdMinimo', parseInt(e.target.value))}
                    disabled={!configuracaoEditando.iaConfig.habilitada}
                  />
                  <small className="form-text text-muted">
                    Compatibilidade mínima para considerar match válido
                  </small>
                </FormGroup>

                <FormGroup>
                  <label>Custo Máximo por Análise</label>
                  <InputGroup>
                    <InputGroupAddon type="prepend">
                      <InputGroupText>$</InputGroupText>
                    </InputGroupAddon>
                    <FormInput
                      type="number"
                      min="0.01"
                      max="1.00"
                      step="0.01"
                      value={configuracaoEditando.iaConfig.custoMaximoPorAnalise}
                      onChange={(e) => handleIAConfigChange('custoMaximoPorAnalise', parseFloat(e.target.value) || 0.10)}
                      disabled={!configuracaoEditando.iaConfig.habilitada}
                    />
                  </InputGroup>
                </FormGroup>
              </Col>
            </Row>

            {configuracaoEditando.iaConfig.habilitada && (
              <Alert theme="info" className="mt-3">
                <strong>Custo estimado por análise:</strong> ${
                  configuracaoEditando.iaConfig.modelo === 'gpt-4' ? '0.054' : '0.015'
                } (baseado no modelo e tokens)
              </Alert>
            )}
          </CardBody>
        </Card>
      )}

      {/* Tab: Critérios Eliminatórios */}
      {activeTab === 'eliminatorios' && configuracaoEditando && (
        <Card>
          <CardHeader>🚫 Critérios Eliminatórios</CardHeader>
          <CardBody>
            <Alert theme="warning" className="mb-4">
              <strong>Atenção:</strong> Critérios eliminatórios excluem candidatos automaticamente, 
              independente da pontuação em outros critérios.
            </Alert>

            {/* Gênero */}
            <div className="mb-4 p-3 border rounded">
              <h6>Gênero</h6>
              <FormGroup>
                <label>Status</label>
                <FormInput
                  type="select"
                  value={configuracaoEditando.eliminatorios.genero.ativo ? 'true' : 'false'}
                  onChange={(e) => handleEliminatorioChange('genero', 'ativo', e.target.value === 'true')}
                >
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </FormInput>
              </FormGroup>
              {configuracaoEditando.eliminatorios.genero.ativo && (
                <FormGroup>
                  <label>Condição</label>
                  <FormInput
                    type="select"
                    value={configuracaoEditando.eliminatorios.genero.condicao}
                    onChange={(e) => handleEliminatorioChange('genero', 'condicao', e.target.value)}
                  >
                    <option value="especifico">Gênero específico obrigatório</option>
                    <option value="obrigatorio">Qualquer gênero obrigatório</option>
                    <option value="sempre">Sempre eliminar se não corresponder</option>
                  </FormInput>
                </FormGroup>
              )}
            </div>

            {/* Transporte */}
            <div className="mb-4 p-3 border rounded">
              <h6>Transporte Próprio</h6>
              <FormGroup>
                <label>Status</label>
                <FormInput
                  type="select"
                  value={configuracaoEditando.eliminatorios.transporteProprio.ativo ? 'true' : 'false'}
                  onChange={(e) => handleEliminatorioChange('transporteProprio', 'ativo', e.target.value === 'true')}
                >
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </FormInput>
              </FormGroup>
              {configuracaoEditando.eliminatorios.transporteProprio.ativo && (
                <small className="text-muted">
                  Elimina candidatos sem transporte quando a vaga exige
                </small>
              )}
            </div>

            {/* Fluência */}
            <div className="mb-4 p-3 border rounded">
              <h6>Fluência em Português</h6>
              <FormGroup>
                <label>Status</label>
                <FormInput
                  type="select"
                  value={configuracaoEditando.eliminatorios.fluenciaPortugues.ativo ? 'true' : 'false'}
                  onChange={(e) => handleEliminatorioChange('fluenciaPortugues', 'ativo', e.target.value === 'true')}
                >
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </FormInput>
              </FormGroup>
              {configuracaoEditando.eliminatorios.fluenciaPortugues.ativo && (
                <FormGroup>
                  <label>Nível mínimo aceitável</label>
                  <FormInput
                    type="select"
                    value={configuracaoEditando.eliminatorios.fluenciaPortugues.nivelMinimo || 'basico'}
                    onChange={(e) => handleEliminatorioChange('fluenciaPortugues', 'nivelMinimo', e.target.value)}
                  >
                    <option value="nenhum">Nenhum (aceita todos)</option>
                    <option value="basico">Básico</option>
                    <option value="intermediario">Intermediário</option>
                    <option value="avancado">Avançado</option>
                    <option value="fluente">Fluente</option>
                  </FormInput>
                </FormGroup>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Tab: Simulação */}
      {activeTab === 'simulacao' && (
        <Card>
          <CardHeader>🧪 Simulação de Impacto</CardHeader>
          <CardBody>
            <p>
              Simule o impacto das configurações atuais no sistema de matching antes de salvar.
            </p>
            <Button theme="primary" onClick={handleSimular} disabled={!isDirty || isSaving}>
              Executar Simulação
            </Button>

            {simulationResult && (
              <div className="mt-4">
                <h6>Resultados da Simulação:</h6>
                <Alert theme={simulationResult.impacto === 'alto' ? 'warning' : 'info'}>
                  <strong>Impacto:</strong> {simulationResult.impacto}<br />
                  <strong>Matches afetados:</strong> {simulationResult.matchesAfetados}<br />
                  <strong>Taxa de aprovação estimada:</strong> {simulationResult.taxaAprovacao}%
                </Alert>
                {simulationResult.alertas && simulationResult.alertas.length > 0 && (
                  <div>
                    <h6>Alertas:</h6>
                    <ul>
                      {simulationResult.alertas.map((alerta: string, idx: number) => (
                        <li key={idx}>{alerta}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {/* Modal de confirmação */}
      {showSaveConfirm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar Salvamento</h5>
                <button 
                  type="button" 
                  className="close" 
                  onClick={() => setShowSaveConfirm(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Tem certeza que deseja salvar estas configurações?</p>
                <Alert theme="warning">
                  <strong>Atenção:</strong> Isso criará uma nova versão da configuração. 
                  A configuração atual continuará ativa até que você ative a nova versão.
                </Alert>
              </div>
              <div className="modal-footer">
                <Button theme="secondary" onClick={() => setShowSaveConfirm(false)}>
                  Cancelar
                </Button>
                <Button theme="primary" onClick={handleSalvar} disabled={isSaving}>
                  {isSaving ? 'Salvando...' : 'Confirmar'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SinergiaConfigAdmin;