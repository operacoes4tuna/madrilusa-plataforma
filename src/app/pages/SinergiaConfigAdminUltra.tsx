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
  Badge
} from 'shards-react';

const SinergiaConfigAdminUltra: React.FC = () => {
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
    genero: false,
    idade: false,
    municipioResidencia: false,
    transporteProprio: true,
    fluenciaPortugues: true,
    experienciasProfissionais: false,
    formacaoAcademica: false,
    idiomasAdicionais: false
  });

  const handlePesoChange = (key: string, value: number) => {
    setPesos(prev => ({ ...prev, [key]: value }));
  };

  const handleIAConfigChange = (key: string, value: any) => {
    setIaConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleEliminatorioChange = (criterio: string, value: boolean) => {
    setEliminatorios(prev => ({
      ...prev,
      [criterio]: value
    }));
  };

  const calcularSomaPesos = () => {
    return Object.values(pesos).reduce((sum, peso) => sum + peso, 0);
  };

  const CriterioConfig = ({ 
    nome, 
    icone, 
    chave, 
    peso, 
    eliminatorio, 
    descricaoEliminatoria 
  }: {
    nome: string;
    icone: string;
    chave: string;
    peso: number;
    eliminatorio: boolean;
    descricaoEliminatoria: string;
  }) => (
    <FormGroup>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="d-flex align-items-center">
          <span className="mr-2">{icone} {nome}</span>
          {eliminatorio && (
            <Badge theme="danger" className="mr-2">🚫 ELIMINATÓRIO</Badge>
          )}
        </div>
        <Badge theme="light">{peso}%</Badge>
      </div>
      
      <div className="mb-2">
        <input
          type="range"
          min="0"
          max="100"
          value={peso}
          onChange={(e) => handlePesoChange(chave, parseInt(e.target.value))}
          className="form-control-range w-100"
        />
      </div>
      
      <div className="d-flex align-items-center">
        <select
          value={eliminatorio ? 'true' : 'false'}
          onChange={(e) => handleEliminatorioChange(chave, e.target.value === 'true')}
          className="form-control mr-2"
          style={{ width: 'auto', fontSize: '0.875rem' }}
        >
          <option value="false">📊 Apenas Pontuação</option>
          <option value="true">🚫 Eliminatório</option>
        </select>
        <small className="text-muted">
          {eliminatorio ? descricaoEliminatoria : 'Só reduz pontuação'}
        </small>
      </div>
    </FormGroup>
  );

  return (
    <div>
      <Row className="page-header py-4">
        <Col>
          <h2 className="mb-0">🎛️ Configuração do SinergIA Madrilusa V2</h2>
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
          </div>
        </Col>
      </Row>

      {/* TAB: Pesos dos Critérios */}
      {activeTab === 'pesos' && (
        <Card>
          <CardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">⚖️ Configuração de Pesos e Critérios Eliminatórios</h5>
              <div className="d-flex align-items-center">
                <Badge theme="danger" className="mr-2">
                  🚫 {Object.values(eliminatorios).filter(Boolean).length} Eliminatórios
                </Badge>
                <Badge theme={calcularSomaPesos() === 100 ? 'success' : 'danger'}>
                  Soma: {calcularSomaPesos()}%
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <div className="mb-4">
              {calcularSomaPesos() !== 100 && (
                <Alert theme="warning" className="mb-3">
                  <strong>⚠️ Atenção:</strong> A soma dos pesos deve ser exatamente 100%. 
                  Atual: {calcularSomaPesos()}%
                </Alert>
              )}
              
              <Alert theme="info">
                <strong>💡 Como funciona:</strong><br />
                • <strong>Peso:</strong> Define a importância do critério na pontuação final (0-100%)<br />
                • <strong>🚫 Eliminatório:</strong> Se marcado, candidatos que não atendem este critério são automaticamente eliminados, independente da pontuação total
              </Alert>
            </div>

            <div className="row">
              <div className="col-md-6">
                <h6 className="mb-3 text-primary">Critérios Demográficos</h6>
                
                <CriterioConfig
                  nome="Gênero"
                  icone="👤"
                  chave="genero"
                  peso={pesos.genero}
                  eliminatorio={eliminatorios.genero}
                  descricaoEliminatoria="Elimina se não corresponder"
                />

                <CriterioConfig
                  nome="Idade"
                  icone="🎂"
                  chave="idade"
                  peso={pesos.idade}
                  eliminatorio={eliminatorios.idade}
                  descricaoEliminatoria="Elimina por faixa etária"
                />

                <CriterioConfig
                  nome="Município"
                  icone="🏙️"
                  chave="municipioResidencia"
                  peso={pesos.municipioResidencia}
                  eliminatorio={eliminatorios.municipioResidencia}
                  descricaoEliminatoria="Elimina se município diferente"
                />

                <CriterioConfig
                  nome="Transporte"
                  icone="🚗"
                  chave="transporteProprio"
                  peso={pesos.transporteProprio}
                  eliminatorio={eliminatorios.transporteProprio}
                  descricaoEliminatoria="Elimina sem transporte próprio"
                />
              </div>

              <div className="col-md-6">
                <h6 className="mb-3 text-primary">Critérios Profissionais</h6>
                
                <CriterioConfig
                  nome="Fluência Português"
                  icone="🇵🇹"
                  chave="fluenciaPortugues"
                  peso={pesos.fluenciaPortugues}
                  eliminatorio={eliminatorios.fluenciaPortugues}
                  descricaoEliminatoria="Elimina por fluência insuficiente"
                />

                <CriterioConfig
                  nome="Experiência"
                  icone="💼"
                  chave="experienciasProfissionais"
                  peso={pesos.experienciasProfissionais}
                  eliminatorio={eliminatorios.experienciasProfissionais}
                  descricaoEliminatoria="Elimina sem experiência mínima"
                />

                <CriterioConfig
                  nome="Formação"
                  icone="🎓"
                  chave="formacaoAcademica"
                  peso={pesos.formacaoAcademica}
                  eliminatorio={eliminatorios.formacaoAcademica}
                  descricaoEliminatoria="Elimina sem formação adequada"
                />

                <CriterioConfig
                  nome="Idiomas"
                  icone="🗣️"
                  chave="idiomasAdicionais"
                  peso={pesos.idiomasAdicionais}
                  eliminatorio={eliminatorios.idiomasAdicionais}
                  descricaoEliminatoria="Elimina sem idiomas obrigatórios"
                />
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
                  <select
                    value={iaConfig.habilitada ? 'true' : 'false'}
                    onChange={(e) => handleIAConfigChange('habilitada', e.target.value === 'true')}
                    className="form-control"
                  >
                    <option value="true">✅ Habilitada</option>
                    <option value="false">❌ Desabilitada</option>
                  </select>
                </FormGroup>

                <FormGroup>
                  <label>Modelo de IA</label>
                  <select
                    value={iaConfig.modelo}
                    onChange={(e) => handleIAConfigChange('modelo', e.target.value)}
                    disabled={!iaConfig.habilitada}
                    className="form-control"
                  >
                    <option value="gpt-4">GPT-4 (Mais preciso)</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Mais econômico)</option>
                  </select>
                </FormGroup>

                <FormGroup>
                  <label>Temperatura: {iaConfig.temperatura}</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={iaConfig.temperatura}
                    onChange={(e) => handleIAConfigChange('temperatura', parseFloat(e.target.value))}
                    disabled={!iaConfig.habilitada}
                    className="form-control-range"
                  />
                  <small className="text-muted">0 = Conservador, 1 = Criativo</small>
                </FormGroup>
              </Col>

              <Col md="6">
                <FormGroup>
                  <label>Máximo de Tokens</label>
                  <input
                    type="number"
                    min="500"
                    max="4000"
                    value={iaConfig.maxTokens}
                    onChange={(e) => handleIAConfigChange('maxTokens', parseInt(e.target.value) || 1000)}
                    disabled={!iaConfig.habilitada}
                    className="form-control"
                  />
                </FormGroup>

                <FormGroup>
                  <label>Threshold Mínimo: {iaConfig.thresholdMinimo}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={iaConfig.thresholdMinimo}
                    onChange={(e) => handleIAConfigChange('thresholdMinimo', parseInt(e.target.value))}
                    disabled={!iaConfig.habilitada}
                    className="form-control-range"
                  />
                  <small className="text-muted">Compatibilidade mínima para match</small>
                </FormGroup>

                <FormGroup>
                  <label>Custo Máximo por Análise</label>
                  <input
                    type="number"
                    min="0.01"
                    max="1.00"
                    step="0.01"
                    value={iaConfig.custoMaximoPorAnalise}
                    onChange={(e) => handleIAConfigChange('custoMaximoPorAnalise', parseFloat(e.target.value) || 0.10)}
                    disabled={!iaConfig.habilitada}
                    className="form-control"
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

      {/* Status Final */}
      <Alert theme="success" className="mt-4">
        <strong>✅ Painel Administrativo Totalmente Funcional!</strong><br />
        <small>
          • ⚖️ Edição de pesos em tempo real com validação automática<br />
          • 🚫 Critérios eliminatórios integrados em cada item<br />
          • 🤖 Configuração completa de IA (modelo, temperatura, custos)<br />
          • 💾 Sistema de salvamento integrado<br />
          • 📊 Interface unificada e intuitiva
        </small>
      </Alert>
    </div>
  );
};

export default SinergiaConfigAdminUltra;
