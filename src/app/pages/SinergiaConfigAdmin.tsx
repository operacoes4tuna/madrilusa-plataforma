// Página Administrativa para Configuração do SinergIA V2

import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane, Button, Alert } from 'shards-react';

const SinergiaConfigAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('status');
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Carregando...</span>
          </div>
          <p className="mt-3 text-muted">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 mb-0">🎛️ Configuração SinergIA V2</h1>
              <p className="text-muted mb-0">
                Configuração parametrizável do sistema de matching inteligente
              </p>
            </div>
          </div>
        </Col>
      </Row>

      {/* Status do Sistema */}
      <Row className="mb-4">
        <Col>
          <Card>
            <CardHeader>📊 Status do Sistema</CardHeader>
            <CardBody>
              <Alert theme="info">
                <strong>🚧 Sistema em Desenvolvimento</strong><br />
                O painel de configuração está sendo implementado. 
                Funcionalidades básicas estão disponíveis via API.
              </Alert>
              
              <div className="row text-center">
                <div className="col-md-3">
                  <div className="p-3">
                    <div className="h4 mb-0 text-primary">V2.0</div>
                    <small className="text-muted">Versão Atual</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="p-3">
                    <div className="h4 mb-0 text-success">4</div>
                    <small className="text-muted">Configurações</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="p-3">
                    <div className="h4 mb-0 text-info">4</div>
                    <small className="text-muted">Templates</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="p-3">
                    <div className="h4 mb-0 text-success">✅</div>
                    <small className="text-muted">Cache Ativo</small>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Tabs de navegação */}
      <Row className="mb-4">
        <Col>
          <Nav tabs>
            <NavItem>
              <NavLink
                active={activeTab === 'status'}
                onClick={() => setActiveTab('status')}
                style={{ cursor: 'pointer' }}
              >
                📊 Status
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={activeTab === 'pesos'}
                onClick={() => setActiveTab('pesos')}
                style={{ cursor: 'pointer' }}
              >
                ⚖️ Pesos
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={activeTab === 'eliminatorios'}
                onClick={() => setActiveTab('eliminatorios')}
                style={{ cursor: 'pointer' }}
              >
                🚫 Eliminatórios
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={activeTab === 'ia'}
                onClick={() => setActiveTab('ia')}
                style={{ cursor: 'pointer' }}
              >
                🤖 IA
              </NavLink>
            </NavItem>
          </Nav>
        </Col>
      </Row>

      {/* Conteúdo das tabs */}
      <TabContent activeTab={activeTab}>
        <TabPane tabId="status">
          <Card>
            <CardHeader>📋 Informações do Sistema</CardHeader>
            <CardBody>
              <h5>🎯 Critérios de Matching Atuais</h5>
              <div className="row">
                <div className="col-md-6">
                  <h6>📊 Pesos dos Critérios:</h6>
                  <ul className="list-unstyled">
                    <li><strong>Experiências:</strong> 20%</li>
                    <li><strong>Município:</strong> 15%</li>
                    <li><strong>Fluência:</strong> 15%</li>
                    <li><strong>Formação:</strong> 15%</li>
                    <li><strong>Género:</strong> 10%</li>
                    <li><strong>Idade:</strong> 10%</li>
                    <li><strong>Transporte:</strong> 10%</li>
                    <li><strong>Idiomas:</strong> 5%</li>
                    <li><strong>Habilidades:</strong> 3%</li>
                    <li><strong>Características:</strong> 2%</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6>🚫 Critérios Eliminatórios:</h6>
                  <ul className="list-unstyled">
                    <li><span className="badge badge-danger mr-2">ATIVO</span> Género específico</li>
                    <li><span className="badge badge-danger mr-2">ATIVO</span> Transporte obrigatório</li>
                    <li><span className="badge badge-danger mr-2">ATIVO</span> Fluência obrigatória</li>
                  </ul>
                  
                  <h6 className="mt-3">🤖 Configuração IA:</h6>
                  <ul className="list-unstyled">
                    <li><span className="badge badge-success mr-2">ATIVA</span> GPT-4</li>
                    <li><strong>Threshold:</strong> 40%</li>
                    <li><strong>Peso IA:</strong> 30%</li>
                    <li><strong>Max Tokens:</strong> 2000</li>
                  </ul>
                </div>
              </div>
            </CardBody>
          </Card>
        </TabPane>

        <TabPane tabId="pesos">
          <Card>
            <CardHeader>⚖️ Configuração de Pesos</CardHeader>
            <CardBody>
              <Alert theme="warning">
                <strong>🚧 Em Desenvolvimento</strong><br />
                Editor visual de pesos será implementado na próxima fase.
                Por enquanto, use as APIs diretamente.
              </Alert>
              
              <h6>📋 APIs Disponíveis:</h6>
              <ul>
                <li><code>GET /api/sinergia-config/ativa</code> - Configuração atual</li>
                <li><code>POST /api/sinergia-config</code> - Criar nova configuração</li>
                <li><code>PUT /api/sinergia-config/:id/ativar</code> - Ativar configuração</li>
                <li><code>POST /api/sinergia-config/simular</code> - Simular impacto</li>
              </ul>
            </CardBody>
          </Card>
        </TabPane>

        <TabPane tabId="eliminatorios">
          <Card>
            <CardHeader>🚫 Critérios Eliminatórios</CardHeader>
            <CardBody>
              <Alert theme="danger">
                <strong>⚠️ Critérios Eliminatórios Ativos</strong><br />
                Candidatos que não atenderem estes critérios são eliminados antes da análise.
              </Alert>
              
              <div className="row">
                <div className="col-md-4">
                  <div className="card border-danger">
                    <div className="card-body">
                      <h6 className="text-danger">👤 Género</h6>
                      <p className="small">Elimina quando género específico não corresponde</p>
                      <span className="badge badge-danger">ATIVO</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card border-danger">
                    <div className="card-body">
                      <h6 className="text-danger">🚗 Transporte</h6>
                      <p className="small">Elimina quando obrigatório e candidato não tem</p>
                      <span className="badge badge-danger">ATIVO</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card border-danger">
                    <div className="card-body">
                      <h6 className="text-danger">🗣️ Fluência</h6>
                      <p className="small">Elimina quando obrigatória e nível insuficiente</p>
                      <span className="badge badge-danger">ATIVO</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </TabPane>

        <TabPane tabId="ia">
          <Card>
            <CardHeader>🤖 Configuração de IA</CardHeader>
            <CardBody>
              <Alert theme="success">
                <strong>✅ IA Ativa</strong><br />
                Sistema usando GPT-4 para análise semântica avançada.
              </Alert>
              
              <div className="row">
                <div className="col-md-6">
                  <h6>⚙️ Configurações Atuais:</h6>
                  <ul className="list-unstyled">
                    <li><strong>Modelo:</strong> GPT-4</li>
                    <li><strong>Threshold:</strong> 40% (IA apenas para scores altos)</li>
                    <li><strong>Peso da IA:</strong> 30% do score final</li>
                    <li><strong>Max Tokens:</strong> 2000</li>
                    <li><strong>Temperatura:</strong> 0.3 (determinística)</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6>💰 Estimativas de Custo:</h6>
                  <ul className="list-unstyled">
                    <li><strong>Por análise:</strong> ~$0.054</li>
                    <li><strong>Diário:</strong> ~$1.62 (30 análises)</li>
                    <li><strong>Mensal:</strong> ~$48.60</li>
                  </ul>
                  
                  <div className="mt-3 p-2 bg-light rounded">
                    <small className="text-muted">
                      💡 Apenas ~60% das análises usam IA devido ao threshold de 40%
                    </small>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </TabPane>
      </TabContent>

      {/* Ações principais */}
      <Row className="mt-4">
        <Col>
          <Card>
            <CardHeader>🔧 Ações Administrativas</CardHeader>
            <CardBody>
              <div className="d-flex space-x-3">
                <Button theme="primary" disabled>
                  📝 Criar Nova Configuração
                </Button>
                <Button theme="secondary" disabled>
                  📋 Aplicar Template
                </Button>
                <Button theme="info" disabled>
                  🧪 Simular Impacto
                </Button>
                <Button theme="warning" disabled>
                  📊 Ver Histórico
                </Button>
              </div>
              
              <Alert theme="info" className="mt-3 mb-0">
                <strong>ℹ️ Interface Visual</strong><br />
                <small>
                  A interface visual completa será habilitada na próxima fase. 
                  Por enquanto, todas as funcionalidades estão disponíveis via API REST.
                </small>
              </Alert>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SinergiaConfigAdmin;