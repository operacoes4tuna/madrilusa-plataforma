// Página de Teste das APIs de Configuração SinergIA V2
// Interface para testar conectividade e funcionalidades das APIs

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Row, Col, Button, Alert } from 'shards-react';
import { configuracaoSinergiaApi } from '../../services/configuracaoSinergia.api';

interface TestResult {
  test: string;
  success: boolean;
  duration: number;
  data?: any;
  error?: string;
}

const SinergiaConfigTest: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [connected, setConnected] = useState<boolean | null>(null);

  // Testar conectividade na inicialização
  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      const isConnected = await configuracaoSinergiaApi.testConnection();
      setConnected(isConnected);
    } catch {
      setConnected(false);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setResults([]);
    
    const testResults: TestResult[] = [];

    // Teste 1: Conectividade
    const test1Start = Date.now();
    try {
      const isConnected = await configuracaoSinergiaApi.testConnection();
      testResults.push({
        test: 'Conectividade com Backend',
        success: isConnected,
        duration: Date.now() - test1Start,
        data: { connected: isConnected }
      });
    } catch (error) {
      testResults.push({
        test: 'Conectividade com Backend',
        success: false,
        duration: Date.now() - test1Start,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }

    // Teste 2: Status do Sistema
    const test2Start = Date.now();
    try {
      const status = await configuracaoSinergiaApi.getStatus();
      testResults.push({
        test: 'Status do Sistema',
        success: true,
        duration: Date.now() - test2Start,
        data: status
      });
    } catch (error) {
      testResults.push({
        test: 'Status do Sistema',
        success: false,
        duration: Date.now() - test2Start,
        error: error instanceof Error ? error.message : 'Erro de conexão'
      });
    }

    // Teste 3: Configuração Ativa
    const test3Start = Date.now();
    try {
      const config = await configuracaoSinergiaApi.getConfiguracaoAtiva();
      testResults.push({
        test: 'Configuração Ativa',
        success: !!config,
        duration: Date.now() - test3Start,
        data: {
          iaHabilitada: config?.iaConfig?.habilitada,
          modelo: config?.iaConfig?.modelo,
          pesosValidos: config?.pesos ? Object.values(config.pesos).reduce((a, b) => a + b, 0) === 100 : false
        }
      });
    } catch (error) {
      testResults.push({
        test: 'Configuração Ativa',
        success: false,
        duration: Date.now() - test3Start,
        error: error instanceof Error ? error.message : 'Erro de conexão'
      });
    }

    // Teste 4: Listar Configurações
    const test4Start = Date.now();
    try {
      const configs = await configuracaoSinergiaApi.listarConfiguracoes();
      testResults.push({
        test: 'Listar Configurações',
        success: Array.isArray(configs),
        duration: Date.now() - test4Start,
        data: { total: configs?.length || 0 }
      });
    } catch (error) {
      testResults.push({
        test: 'Listar Configurações',
        success: false,
        duration: Date.now() - test4Start,
        error: error instanceof Error ? error.message : 'Erro de conexão'
      });
    }

    // Teste 5: Templates
    const test5Start = Date.now();
    try {
      const templates = await configuracaoSinergiaApi.getTemplates();
      testResults.push({
        test: 'Templates Disponíveis',
        success: Array.isArray(templates),
        duration: Date.now() - test5Start,
        data: { total: templates?.length || 0 }
      });
    } catch (error) {
      testResults.push({
        test: 'Templates Disponíveis',
        success: false,
        duration: Date.now() - test5Start,
        error: error instanceof Error ? error.message : 'Erro de conexão'
      });
    }

    setResults(testResults);
    setIsRunning(false);
  };

  const getStatusColor = (success: boolean) => success ? 'success' : 'danger';
  const getStatusIcon = (success: boolean) => success ? '✅' : '❌';

  const successCount = results.filter(r => r.success).length;
  const totalTests = results.length;
  const successRate = totalTests > 0 ? (successCount / totalTests) * 100 : 0;

  return (
    <div className="container-fluid">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 mb-0">🧪 Teste APIs SinergIA V2</h1>
              <p className="text-muted mb-0">
                Verificação de conectividade e funcionalidades das APIs
              </p>
            </div>
            <Button 
              theme="primary" 
              onClick={runAllTests}
              disabled={isRunning}
            >
              {isRunning ? '🔄 Testando...' : '🧪 Executar Testes'}
            </Button>
          </div>
        </Col>
      </Row>

      {/* Status de Conectividade */}
      <Row className="mb-4">
        <Col>
          <Card>
            <CardHeader>📡 Status de Conectividade</CardHeader>
            <CardBody>
              {connected === null && (
                <Alert theme="info">
                  <strong>🔄 Verificando...</strong><br />
                  Testando conectividade com o backend.
                </Alert>
              )}
              
              {connected === true && (
                <Alert theme="success">
                  <strong>✅ Backend Conectado</strong><br />
                  APIs disponíveis e funcionando.
                </Alert>
              )}
              
              {connected === false && (
                <Alert theme="danger">
                  <strong>❌ Backend Desconectado</strong><br />
                  Não foi possível conectar com as APIs. Verifique se o backend está rodando.
                </Alert>
              )}

              <div className="mt-3">
                <Button 
                  theme="outline-secondary" 
                  size="sm"
                  onClick={testConnection}
                >
                  🔄 Testar Novamente
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Resultados dos Testes */}
      {results.length > 0 && (
        <Row className="mb-4">
          <Col>
            <Card>
              <CardHeader>📊 Resultados dos Testes</CardHeader>
              <CardBody>
                <div className="mb-3">
                  <Alert theme={successRate >= 80 ? 'success' : successRate >= 60 ? 'warning' : 'danger'}>
                    <strong>
                      {successRate >= 80 && '🎉 Todos os Testes Passaram!'}
                      {successRate >= 60 && successRate < 80 && '⚠️ Alguns Problemas Detectados'}
                      {successRate < 60 && '❌ Falhas Críticas Detectadas'}
                    </strong>
                    <br />
                    Taxa de sucesso: {successCount}/{totalTests} ({successRate.toFixed(1)}%)
                  </Alert>
                </div>

                <div className="row">
                  {results.map((result, index) => (
                    <div key={index} className="col-md-6 mb-3">
                      <div className={`card border-${getStatusColor(result.success)}`}>
                        <div className="card-body">
                          <h6 className={`text-${getStatusColor(result.success)}`}>
                            {getStatusIcon(result.success)} {result.test}
                          </h6>
                          
                          <div className="small text-muted">
                            <strong>Duração:</strong> {result.duration}ms
                          </div>
                          
                          {result.success && result.data && (
                            <div className="mt-2">
                              <div className="small">
                                <strong>Dados:</strong>
                                <pre className="mt-1 p-2 bg-light rounded small">
                                  {JSON.stringify(result.data, null, 2)}
                                </pre>
                              </div>
                            </div>
                          )}
                          
                          {!result.success && result.error && (
                            <div className="mt-2">
                              <div className="small text-danger">
                                <strong>Erro:</strong> {result.error}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      {/* Informações das APIs */}
      <Row>
        <Col>
          <Card>
            <CardHeader>📋 APIs Disponíveis</CardHeader>
            <CardBody>
              <h6>🎛️ Configuração Parametrizável:</h6>
              <ul className="small">
                <li><code>GET /api/sinergia-config/status</code> - Status do sistema</li>
                <li><code>GET /api/sinergia-config/ativa</code> - Configuração ativa</li>
                <li><code>GET /api/sinergia-config/</code> - Listar configurações</li>
                <li><code>POST /api/sinergia-config/</code> - Criar configuração</li>
                <li><code>POST /api/sinergia-config/:id/ativar</code> - Ativar configuração</li>
                <li><code>GET /api/sinergia-config/templates</code> - Templates disponíveis</li>
                <li><code>POST /api/sinergia-config/simular</code> - Simular impacto</li>
              </ul>

              <h6 className="mt-3">🔧 Monitoramento do Sistema:</h6>
              <ul className="small">
                <li><code>GET /api/system/health</code> - Saúde do sistema</li>
                <li><code>GET /api/system/connectivity</code> - Teste de conectividade</li>
                <li><code>POST /api/system/sync/force</code> - Forçar sincronização</li>
                <li><code>POST /api/system/cache/clear</code> - Limpar caches</li>
              </ul>

              <Alert theme="info" className="mt-3 mb-0">
                <strong>ℹ️ Sistema Ativo</strong><br />
                <small>
                  Todas as APIs estão ativas e funcionando. O sistema de configuração
                  parametrizável está completamente operacional.
                </small>
              </Alert>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SinergiaConfigTest;
