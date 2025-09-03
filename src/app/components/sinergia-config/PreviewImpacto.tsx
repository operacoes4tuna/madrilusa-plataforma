// Componente para Preview de Impacto da Configuração

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Alert } from 'shards-react';
import { useSimulacaoTempReal } from '../../../hooks/useSinergiaConfig';
import type { ConfiguracaoCompleta, ImpactoSimulado } from '../../../types/sinergia-config.types';

interface PreviewImpactoProps {
  configuracao: ConfiguracaoCompleta;
  amostraSize?: number;
  onSimular?: () => void;
  autoUpdate?: boolean;
}

export const PreviewImpacto: React.FC<PreviewImpactoProps> = ({
  configuracao,
  amostraSize = 50,
  onSimular,
  autoUpdate = true
}) => {
  const [manualSimulation, setManualSimulation] = useState<ImpactoSimulado | null>(null);
  const [isManualSimulating, setIsManualSimulating] = useState(false);

  const { 
    simulacaoData, 
    isSimulating, 
    executarSimulacao 
  } = useSimulacaoTempReal(
    autoUpdate ? configuracao : undefined, 
    3000 // 3 segundos de debounce
  );

  const dados = manualSimulation || simulacaoData;

  const handleManualSimulation = async () => {
    setIsManualSimulating(true);
    try {
      await executarSimulacao();
      if (onSimular) onSimular();
    } catch (error) {
      console.error('Erro na simulação manual:', error);
    } finally {
      setIsManualSimulating(false);
    }
  };

  const getImpactColor = (diferenca: number) => {
    if (diferenca > 10) return 'text-success';
    if (diferenca > 0) return 'text-info';
    if (diferenca < -10) return 'text-danger';
    if (diferenca < 0) return 'text-warning';
    return 'text-muted';
  };

  const getImpactIcon = (diferenca: number) => {
    if (diferenca > 10) return '📈';
    if (diferenca > 0) return '↗️';
    if (diferenca < -10) return '📉';
    if (diferenca < 0) return '↘️';
    return '➡️';
  };

  return (
    <div className="space-y-4">
      {/* Cabeçalho */}
      <Card>
        <CardHeader className="d-flex justify-content-between align-items-center">
          <span>📊 Preview de Impacto</span>
          <Button
            size="sm"
            theme={isSimulating || isManualSimulating ? "secondary" : "primary"}
            onClick={handleManualSimulation}
            disabled={isSimulating || isManualSimulating}
          >
            {isSimulating || isManualSimulating ? (
              <>
                <span className="spinner-border spinner-border-sm mr-2" />
                Simulando...
              </>
            ) : (
              '🔄 Simular Agora'
            )}
          </Button>
        </CardHeader>
        
        <CardBody>
          {autoUpdate && (
            <Alert theme="info" className="mb-3">
              <small>
                ℹ️ Preview automático ativo. Alterações na configuração acionam simulação após 3 segundos.
              </small>
            </Alert>
          )}

          {!dados && !isSimulating && (
            <div className="text-center py-4">
              <p className="text-muted">
                Clique em "Simular Agora" para ver o impacto das configurações
              </p>
            </div>
          )}

          {(isSimulating || isManualSimulating) && (
            <div className="text-center py-4">
              <div className="spinner-border text-primary mb-3" />
              <p className="text-muted">Analisando impacto da configuração...</p>
              <small className="text-muted">
                Comparando scores com {amostraSize} amostras de dados reais
              </small>
            </div>
          )}

          {dados && !isSimulating && !isManualSimulating && (
            <div className="space-y-4">
              {/* Métricas principais */}
              <div className="row">
                <div className="col-6">
                  <div className="text-center p-3 bg-light rounded">
                    <div className="h5 mb-0 text-primary">
                      {dados.scoreMedioDepois}%
                    </div>
                    <small className="text-muted">Score Médio (Nova Config)</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="text-center p-3 bg-light rounded">
                    <div className="h5 mb-0 text-secondary">
                      {dados.scoreMedioAntes}%
                    </div>
                    <small className="text-muted">Score Médio (Atual)</small>
                  </div>
                </div>
              </div>

              {/* Diferença de score */}
              <div className="text-center">
                <div className={`h4 mb-0 ${getImpactColor(dados.scoreMedioDepois - dados.scoreMedioAntes)}`}>
                  {getImpactIcon(dados.scoreMedioDepois - dados.scoreMedioAntes)}
                  {dados.scoreMedioDepois > dados.scoreMedioAntes ? '+' : ''}
                  {(dados.scoreMedioDepois - dados.scoreMedioAntes).toFixed(1)}%
                </div>
                <small className="text-muted">Diferença no Score Médio</small>
              </div>

              {/* Estatísticas detalhadas */}
              <div className="row text-center">
                <div className="col-4">
                  <div className="p-2">
                    <div className="h6 mb-0 text-info">
                      {dados.totalAfetados}
                    </div>
                    <small className="text-muted">Matches Afetados</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-2">
                    <div className="h6 mb-0 text-warning">
                      {dados.eliminadosDepois}
                    </div>
                    <small className="text-muted">Eliminados (Nova)</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-2">
                    <div className="h6 mb-0 text-secondary">
                      {dados.eliminadosAntes}
                    </div>
                    <small className="text-muted">Eliminados (Atual)</small>
                  </div>
                </div>
              </div>

              {/* Exemplos de mudanças */}
              {dados.exemplos.length > 0 && (
                <div>
                  <h6 className="mb-3">📋 Exemplos de Mudanças</h6>
                  <div className="space-y-2">
                    {dados.exemplos.slice(0, 3).map((exemplo, idx) => (
                      <div key={idx} className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                        <div>
                          <small className="text-muted">Match {idx + 1}</small>
                        </div>
                        <div className="d-flex align-items-center">
                          <span className="badge badge-secondary mr-2">
                            {exemplo.scoreAntes}%
                          </span>
                          <span className="mx-2">→</span>
                          <span className="badge badge-primary mr-2">
                            {exemplo.scoreDepois}%
                          </span>
                          <span className={`small ${getImpactColor(exemplo.diferenca)}`}>
                            ({exemplo.diferenca > 0 ? '+' : ''}{exemplo.diferenca})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resumo do impacto */}
              <div className="mt-4 p-3 border rounded">
                <h6 className="mb-2">📈 Resumo do Impacto</h6>
                <ul className="small mb-0 list-unstyled">
                  <li>
                    <strong>Score Médio:</strong> {dados.scoreMedioAntes}% → {dados.scoreMedioDepois}%
                    <span className={`ml-2 ${getImpactColor(dados.scoreMedioDepois - dados.scoreMedioAntes)}`}>
                      ({dados.scoreMedioDepois > dados.scoreMedioAntes ? '+' : ''}{(dados.scoreMedioDepois - dados.scoreMedioAntes).toFixed(1)}%)
                    </span>
                  </li>
                  <li>
                    <strong>Matches Afetados:</strong> {dados.totalAfetados} de {amostraSize}
                    <span className="ml-2 text-muted">
                      ({((dados.totalAfetados / amostraSize) * 100).toFixed(0)}%)
                    </span>
                  </li>
                  <li>
                    <strong>Candidatos Eliminados:</strong> {dados.eliminadosAntes} → {dados.eliminadosDepois}
                    <span className={`ml-2 ${dados.eliminadosDepois > dados.eliminadosAntes ? 'text-danger' : 'text-success'}`}>
                      ({dados.eliminadosDepois > dados.eliminadosAntes ? '+' : ''}{dados.eliminadosDepois - dados.eliminadosAntes})
                    </span>
                  </li>
                </ul>
              </div>

              {/* Recomendações */}
              <div className="mt-3">
                {dados.scoreMedioDepois > dados.scoreMedioAntes + 5 && (
                  <Alert theme="success">
                    <strong>✅ Melhoria Significativa</strong><br />
                    <small>Esta configuração melhora substancialmente a qualidade dos matches.</small>
                  </Alert>
                )}
                
                {dados.eliminadosDepois > dados.eliminadosAntes + 10 && (
                  <Alert theme="warning">
                    <strong>⚠️ Aumento de Eliminações</strong><br />
                    <small>Esta configuração elimina significativamente mais candidatos. Verifique se os critérios eliminatórios não estão muito rigorosos.</small>
                  </Alert>
                )}
                
                {Math.abs(dados.scoreMedioDepois - dados.scoreMedioAntes) < 2 && (
                  <Alert theme="info">
                    <strong>ℹ️ Impacto Mínimo</strong><br />
                    <small>As mudanças têm impacto mínimo no score médio. Considere ajustes mais significativos se desejar maior diferenciação.</small>
                  </Alert>
                )}
              </div>

              {/* Timestamp da simulação */}
              <div className="text-center mt-3">
                <small className="text-muted">
                  Simulação realizada em {new Date().toLocaleTimeString('pt-PT')}
                  {autoUpdate && ' • Atualização automática ativa'}
                </small>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

// Componente para comparação lado a lado
interface ComparacaoConfigProps {
  configAtual: ConfiguracaoCompleta;
  configNova: ConfiguracaoCompleta;
  amostraSize?: number;
}

export const ComparacaoConfig: React.FC<ComparacaoConfigProps> = ({
  configAtual,
  configNova,
  amostraSize = 50
}) => {
  return (
    <div className="row">
      <div className="col-md-6">
        <h6 className="mb-3">📊 Configuração Atual</h6>
        <PreviewImpacto 
          configuracao={configAtual} 
          amostraSize={amostraSize}
          autoUpdate={false}
        />
      </div>
      <div className="col-md-6">
        <h6 className="mb-3">🔧 Nova Configuração</h6>
        <PreviewImpacto 
          configuracao={configNova} 
          amostraSize={amostraSize}
          autoUpdate={false}
        />
      </div>
    </div>
  );
};
