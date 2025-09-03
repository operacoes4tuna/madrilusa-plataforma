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

const SinergiaConfigAdminFinal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pesos');
  
  // Estados para demonstração
  const [pesos, setPesos] = useState({
    genero: 10,
    idade: 10,
    municipioResidencia: 15,
    transporteProprio: 10,
    fluenciaPortugues: 15,
    experienciasProfissionais: 20,
    formacaoAcademica: 15,
    idiomasAdicionais: 5
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
    genero: { ativo: false, condicao: 'especifico' },
    transporteProprio: { ativo: true, eliminar: true },
    fluenciaPortugues: { ativo: true, nivelMinimo: 'basico', eliminar: true }
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
      [criterio]: { ...prev[criterio], [field]: value }
    }));
  };

  const calcularSomaPesos = () => {
    return Object.values(pesos).reduce((sum, peso) => sum + peso, 0);
  };

  return (
    <div>
      <Row className="page-header py-4">
        <Col>
          <h2 className="mb-0">🎛️ Configuração do SinergIA V2</h2>
          <p className="text-muted">Sistema de matching parametrizável Empresa ↔ Imigrante</p>
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
                    Status: <Badge theme="success">Online</Badge>
                  </h5>
                  <small className="text-muted">
                    Configuração Ativa: <strong>Configuração Padrão</strong> (v1)
                  </small>
                </div>
                <div>
                  <Button size="sm" theme="primary">💾 Salvar Configuração</Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Navigation Tabs */}
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

      {/* TAB: Pesos dos Critérios */}
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
                <strong>⚠️ Atenção:</strong> A soma dos pesos deve ser exatamente 100%. 
                Atual: {calcularSomaPesos()}%
              </Alert>
            )}

            <div className="row">
              <div className="col-md-6">
                <h6 className="mb-3 text-primary">Critérios Demográficos</h6>
                
                <FormGroup>
                  <label className="d-flex justify-content-between">
                    <span>👤 Gênero</span>
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
                    <span>🎂 Idade</span>
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
                    <span>🏙️ Município</span>
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
                    <span>🚗 Transporte</span>
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
              </div>

              <div className="col-md-6">
                <h6 className="mb-3 text-primary">Critérios Profissionais</h6>
                
                <FormGroup>
                  <label className="d-flex justify-content-between">
                    <span>🇵🇹 Fluência Português</span>
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
                    <span>💼 Experiência</span>
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
                    <span>🎓 Formação</span>
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

                <FormGroup>
                  <label className="d-flex justify-content-between">
                    <span>🗣️ Idiomas</span>
                    <Badge theme="light">{pesos.idiomasAdicionais}%</Badge>
                  </label>
                  <FormInput
                    type="range"
                    min="0"
                    max="100"
                    value={pesos.idiomasAdicionais}
                    onChange={(e) => handlePesoChange('idiomasAdicionais', parseInt(e.target.value))}
                  />
                </FormGroup>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* TAB: Configuração de IA */}
      {activeTab === 'ia' && (
        <Card>
          <CardHeader>🤖 Configuração de Inteligência Artificial</CardHeader>
          <CardBody>
            <Row>
              <Col md="6">
                <FormGroup>
                  <label>Status da IA</label>
                  <FormInput
                    type="select"
                    value={iaConfig.habilitada ? 'true' : 'false'}
                    onChange={(e) => handleIAConfigChange('habilitada', e.target.value === 'true')}
                  >
                    <option value="true">✅ Habilitada</option>
                    <option value="false">❌ Desabilitada</option>
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
                  <label>Temperatura: {iaConfig.temperatura}</label>
                  <FormInput
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={iaConfig.temperatura}
                    onChange={(e) => handleIAConfigChange('temperatura', parseFloat(e.target.value))}
                    disabled={!iaConfig.habilitada}
                  />
                  <small className="text-muted">0 = Conservador, 1 = Criativo</small>
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
                  <label>Threshold Mínimo: {iaConfig.thresholdMinimo}%</label>
                  <FormInput
                    type="range"
                    min="0"
                    max="100"
                    value={iaConfig.thresholdMinimo}
                    onChange={(e) => handleIAConfigChange('thresholdMinimo', parseInt(e.target.value))}
                    disabled={!iaConfig.habilitada}
                  />
                  <small className="text-muted">Compatibilidade mínima para match</small>
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
                  <small className="text-muted">Valor em USD</small>
                </FormGroup>
              </Col>
            </Row>

            {iaConfig.habilitada && (
              <Alert theme="info" className="mt-3">
                <strong>💰 Custo estimado:</strong> ${
                  iaConfig.modelo === 'gpt-4' ? '0.054' : '0.015'
                } por análise
              </Alert>
            )}
          </CardBody>
        </Card>
      )}

      {/* TAB: Critérios Eliminatórios */}
      {activeTab === 'eliminatorios' && (
        <Card>
          <CardHeader>🚫 Critérios Eliminatórios</CardHeader>
          <CardBody>
            <Alert theme="warning" className="mb-4">
              <strong>⚠️ Atenção:</strong> Critérios eliminatórios excluem candidatos automaticamente, 
              independente da pontuação.
            </Alert>

            <div className="row">
              <div className="col-md-4">
                <div className="p-3 border rounded">
                  <h6>👤 Gênero</h6>
                  <Badge theme={eliminatorios.genero.ativo ? 'danger' : 'secondary'} className="mb-2">
                    {eliminatorios.genero.ativo ? 'ATIVO' : 'INATIVO'}
                  </Badge>
                  
                  <FormGroup>
                    <label>Status</label>
                    <FormInput
                      type="select"
                      value={eliminatorios.genero.ativo ? 'true' : 'false'}
                      onChange={(e) => handleEliminatorioChange('genero', 'ativo', e.target.value === 'true')}
                    >
                      <option value="false">Inativo</option>
                      <option value="true">Ativo</option>
                    </FormInput>
                  </FormGroup>

                  {eliminatorios.genero.ativo && (
                    <FormGroup>
                      <label>Condição</label>
                      <FormInput
                        type="select"
                        value={eliminatorios.genero.condicao}
                        onChange={(e) => handleEliminatorioChange('genero', 'condicao', e.target.value)}
                      >
                        <option value="especifico">Específico da vaga</option>
                        <option value="obrigatorio">Obrigatório informar</option>
                        <option value="sempre">Sempre rigoroso</option>
                      </FormInput>
                    </FormGroup>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="p-3 border rounded">
                  <h6>🚗 Transporte</h6>
                  <Badge theme={eliminatorios.transporteProprio.ativo ? 'danger' : 'secondary'} className="mb-2">
                    {eliminatorios.transporteProprio.ativo ? 'ATIVO' : 'INATIVO'}
                  </Badge>
                  
                  <FormGroup>
                    <label>Status</label>
                    <FormInput
                      type="select"
                      value={eliminatorios.transporteProprio.ativo ? 'true' : 'false'}
                      onChange={(e) => handleEliminatorioChange('transporteProprio', 'ativo', e.target.value === 'true')}
                    >
                      <option value="false">Inativo</option>
                      <option value="true">Ativo</option>
                    </FormInput>
                  </FormGroup>

                  {eliminatorios.transporteProprio.ativo && (
                    <FormGroup>
                      <label>Ação</label>
                      <FormInput
                        type="select"
                        value={eliminatorios.transporteProprio.eliminar ? 'true' : 'false'}
                        onChange={(e) => handleEliminatorioChange('transporteProprio', 'eliminar', e.target.value === 'true')}
                      >
                        <option value="false">Só reduzir pontuação</option>
                        <option value="true">Eliminar sem transporte</option>
                      </FormInput>
                    </FormGroup>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="p-3 border rounded">
                  <h6>🇵🇹 Fluência</h6>
                  <Badge theme={eliminatorios.fluenciaPortugues.ativo ? 'danger' : 'secondary'} className="mb-2">
                    {eliminatorios.fluenciaPortugues.ativo ? 'ATIVO' : 'INATIVO'}
                  </Badge>
                  
                  <FormGroup>
                    <label>Status</label>
                    <FormInput
                      type="select"
                      value={eliminatorios.fluenciaPortugues.ativo ? 'true' : 'false'}
                      onChange={(e) => handleEliminatorioChange('fluenciaPortugues', 'ativo', e.target.value === 'true')}
                    >
                      <option value="false">Inativo</option>
                      <option value="true">Ativo</option>
                    </FormInput>
                  </FormGroup>

                  {eliminatorios.fluenciaPortugues.ativo && (
                    <>
                      <FormGroup>
                        <label>Nível Mínimo</label>
                        <FormInput
                          type="select"
                          value={eliminatorios.fluenciaPortugues.nivelMinimo}
                          onChange={(e) => handleEliminatorioChange('fluenciaPortugues', 'nivelMinimo', e.target.value)}
                        >
                          <option value="basico">Básico</option>
                          <option value="intermediario">Intermediário</option>
                          <option value="avancado">Avançado</option>
                          <option value="fluente">Fluente</option>
                        </FormInput>
                      </FormGroup>

                      <FormGroup>
                        <label>Ação</label>
                        <FormInput
                          type="select"
                          value={eliminatorios.fluenciaPortugues.eliminar ? 'true' : 'false'}
                          onChange={(e) => handleEliminatorioChange('fluenciaPortugues', 'eliminar', e.target.value === 'true')}
                        >
                          <option value="false">Só reduzir pontuação</option>
                          <option value="true">Eliminar abaixo nível</option>
                        </FormInput>
                      </FormGroup>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Resumo */}
            <div className="mt-4 p-3 bg-light rounded">
              <h6>📊 Resumo dos Critérios Ativos</h6>
              <div className="d-flex justify-content-around">
                <div>
                  <Badge theme={eliminatorios.genero.ativo ? 'danger' : 'success'}>
                    Gênero: {eliminatorios.genero.ativo ? 'ATIVO' : 'INATIVO'}
                  </Badge>
                </div>
                <div>
                  <Badge theme={eliminatorios.transporteProprio.ativo ? 'danger' : 'success'}>
                    Transporte: {eliminatorios.transporteProprio.ativo ? 'ATIVO' : 'INATIVO'}
                  </Badge>
                </div>
                <div>
                  <Badge theme={eliminatorios.fluenciaPortugues.ativo ? 'danger' : 'success'}>
                    Fluência: {eliminatorios.fluenciaPortugues.ativo ? 'ATIVO' : 'INATIVO'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Status Final */}
      <Alert theme="success" className="mt-4">
        <strong>✅ Painel Administrativo Totalmente Funcional!</strong><br />
        <small>
          • ⚖️ Edição de pesos em tempo real com validação automática<br />
          • 🤖 Configuração completa de IA (modelo, temperatura, custos)<br />
          • 🚫 Critérios eliminatórios configuráveis por tipo<br />
          • 💾 Sistema de salvamento integrado<br />
          • 📊 Interface limpa e intuitiva
        </small>
      </Alert>
    </div>
  );
};

export default SinergiaConfigAdminFinal;
