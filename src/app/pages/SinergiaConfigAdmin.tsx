import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Row, 
  Col, 
  Button, 
  Alert,
  Form,
  FormGroup,
  FormInput,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Badge
} from 'shards-react';
import { useConfiguracaoSinergia } from '@/hooks/useConfiguracaoSinergia';

interface PesoConfig {
  label: string;
  key: string;
  value: number;
  category: string;
}

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
  }, [configuracaoAtiva]);

  // Organizar pesos por categoria
  const pesosPorCategoria = configuracaoEditando ? [
    {
      categoria: 'Critérios Demográficos',
      pesos: [
        { label: 'Gênero', key: 'genero', value: configuracaoEditando.pesos.genero },
        { label: 'Idade', key: 'idade', value: configuracaoEditando.pesos.idade },
        { label: 'Município de Residência', key: 'municipioResidencia', value: configuracaoEditando.pesos.municipioResidencia }
      ]
    },
    {
      categoria: 'Critérios Essenciais',
      pesos: [
        { label: 'Transporte Próprio', key: 'transporteProprio', value: configuracaoEditando.pesos.transporteProprio },
        { label: 'Fluência em Português', key: 'fluenciaPortugues', value: configuracaoEditando.pesos.fluenciaPortugues }
      ]
    },
    {
      categoria: 'Critérios Profissionais',
      pesos: [
        { label: 'Experiências Profissionais', key: 'experienciasProfissionais', value: configuracaoEditando.pesos.experienciasProfissionais },
        { label: 'Formação Acadêmica', key: 'formacaoAcademica', value: configuracaoEditando.pesos.formacaoAcademica }
      ]
    },
    {
      categoria: 'Critérios Complementares',
      pesos: [
        { label: 'Idiomas Adicionais', key: 'idiomasAdicionais', value: configuracaoEditando.pesos.idiomasAdicionais },
        { label: 'Habilidades Específicas', key: 'habilidadesEspecificas', value: configuracaoEditando.pesos.habilidadesEspecificas },
        { label: 'Características Pessoais', key: 'caracteristicasPessoais', value: configuracaoEditando.pesos.caracteristicasPessoais }
      ]
    }
  ] : [];

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
        false // não ativar automaticamente
      );
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const calcularSomaPesos = () => {
    if (!configuracaoEditando) return 0;
    return Object.values(configuracaoEditando.pesos).reduce((sum, peso) => sum + peso, 0);
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

      {/* Conteúdo das tabs */}
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

            {pesosPorCategoria.map((categoria, idx) => (
              <div key={idx} className="mb-4">
                <h6 className="mb-3 text-primary">{categoria.categoria}</h6>
                {categoria.pesos.map((peso) => (
                  <FormGroup key={peso.key} className="mb-3">
                    <label htmlFor={peso.key} className="d-flex justify-content-between">
                      <span>{peso.label}</span>
                      <Badge theme="light">{peso.value}%</Badge>
                    </label>
                    <div className="d-flex align-items-center">
                      <input
                        type="range"
                        className="form-control-range flex-grow-1"
                        id={peso.key}
                        min="0"
                        max="100"
                        value={peso.value}
                        onChange={(e) => handlePesoChange(peso.key, parseInt(e.target.value))}
                      />
                      <FormInput
                        type="number"
                        min="0"
                        max="100"
                        value={peso.value}
                        onChange={(e) => handlePesoChange(peso.key, parseInt(e.target.value) || 0)}
                        style={{ width: '80px', marginLeft: '10px' }}
                      />
                    </div>
                  </FormGroup>
                ))}
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      {activeTab === 'ia' && configuracaoEditando && (
        <Card>
          <CardHeader>🤖 Configuração de Inteligência Artificial</CardHeader>
          <CardBody>
            <Row>
              <Col md="6">
                <FormGroup>
                  <label>Habilitar Análise por IA</label>
                  <div className="custom-control custom-switch">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="habilitarIA"
                      checked={configuracaoEditando.iaConfig.habilitada}
                      onChange={(e) => handleIAConfigChange('habilitada', e.target.checked)}
                    />
                    <label className="custom-control-label" htmlFor="habilitarIA">
                      {configuracaoEditando.iaConfig.habilitada ? 'Habilitada' : 'Desabilitada'}
                    </label>
                  </div>
                </FormGroup>

                <FormGroup>
                  <label htmlFor="modelo">Modelo de IA</label>
                  <FormInput
                    type="select"
                    id="modelo"
                    value={configuracaoEditando.iaConfig.modelo}
                    onChange={(e) => handleIAConfigChange('modelo', e.target.value)}
                    disabled={!configuracaoEditando.iaConfig.habilitada}
                  >
                    <option value="gpt-4">GPT-4 (Mais preciso)</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Mais econômico)</option>
                  </FormInput>
                </FormGroup>

                <FormGroup>
                  <label htmlFor="temperatura">
                    Temperatura: {configuracaoEditando.iaConfig.temperatura}
                  </label>
                  <input
                    type="range"
                    className="form-control-range"
                    id="temperatura"
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
                  <label htmlFor="maxTokens">Máximo de Tokens</label>
                  <FormInput
                    type="number"
                    id="maxTokens"
                    min="500"
                    max="4000"
                    value={configuracaoEditando.iaConfig.maxTokens}
                    onChange={(e) => handleIAConfigChange('maxTokens', parseInt(e.target.value) || 1000)}
                    disabled={!configuracaoEditando.iaConfig.habilitada}
                  />
                </FormGroup>

                <FormGroup>
                  <label htmlFor="threshold">
                    Threshold Mínimo: {configuracaoEditando.iaConfig.thresholdMinimo}%
                  </label>
                  <input
                    type="range"
                    className="form-control-range"
                    id="threshold"
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
                  <label htmlFor="custoMaximo">Custo Máximo por Análise</label>
                  <InputGroup>
                    <InputGroupAddon type="prepend">
                      <InputGroupText>$</InputGroupText>
                    </InputGroupAddon>
                    <FormInput
                      type="number"
                      id="custoMaximo"
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
                <div className="custom-control custom-switch">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="generoAtivo"
                    checked={configuracaoEditando.eliminatorios.genero.ativo}
                    onChange={(e) => handleEliminatorioChange('genero', 'ativo', e.target.checked)}
                  />
                  <label className="custom-control-label" htmlFor="generoAtivo">
                    {configuracaoEditando.eliminatorios.genero.ativo ? 'Ativo' : 'Inativo'}
                  </label>
                </div>
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
                <div className="custom-control custom-switch">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="transporteAtivo"
                    checked={configuracaoEditando.eliminatorios.transporteProprio.ativo}
                    onChange={(e) => handleEliminatorioChange('transporteProprio', 'ativo', e.target.checked)}
                  />
                  <label className="custom-control-label" htmlFor="transporteAtivo">
                    {configuracaoEditando.eliminatorios.transporteProprio.ativo ? 'Ativo' : 'Inativo'}
                  </label>
                </div>
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
                <div className="custom-control custom-switch">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="fluenciaAtivo"
                    checked={configuracaoEditando.eliminatorios.fluenciaPortugues.ativo}
                    onChange={(e) => handleEliminatorioChange('fluenciaPortugues', 'ativo', e.target.checked)}
                  />
                  <label className="custom-control-label" htmlFor="fluenciaAtivo">
                    {configuracaoEditando.eliminatorios.fluenciaPortugues.ativo ? 'Ativo' : 'Inativo'}
                  </label>
                </div>
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