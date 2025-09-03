// Hook para gerenciar configurações do SinergIA V2

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { configuracaoSinergiaApi } from '../services/configuracaoSinergia.api';
import type { 
  ConfiguracaoCompleta,
  StatusSistema,
  ImpactoSimulado,
  ValidationResult
} from '../types/backend-compat.types';

export const useConfiguracaoSinergia = () => {
  // Estados principais
  const [configuracaoAtiva, setConfiguracaoAtiva] = useState<ConfiguracaoCompleta | null>(null);
  const [configuracoes, setConfiguracoes] = useState<any[]>([]);
  const [statusSistema, setStatusSistema] = useState<StatusSistema | null>(null);
  
  // Estados de UI
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados do editor
  const [configuracaoEditando, setConfiguracaoEditando] = useState<ConfiguracaoCompleta | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const { toast } = useToast();

  /**
   * Carregar dados iniciais
   */
  const carregarDados = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [status, configAtiva, listaConfigs] = await Promise.all([
        configuracaoSinergiaApi.getStatus(),
        configuracaoSinergiaApi.getConfiguracaoAtiva(),
        configuracaoSinergiaApi.listarConfiguracoes()
      ]);

      setStatusSistema(status);
      setConfiguracaoAtiva(configAtiva);
      setConfiguracoes(listaConfigs);
      setConfiguracaoEditando(configAtiva);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao carregar dados:', errorMessage);
      
      toast({
        title: "Erro ao carregar configurações",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Salvar configuração atual
   */
  const salvarConfiguracao = async (
    nome?: string, 
    descricao?: string, 
    ativar: boolean = false
  ) => {
    if (!configuracaoEditando) return;

    setIsSaving(true);
    setError(null);

    try {
      // Validar antes de salvar
      const validation = await configuracaoSinergiaApi.validarConfiguracao(configuracaoEditando);
      
      if (!validation.valido) {
        throw new Error(`Configuração inválida: ${validation.erros.join(', ')}`);
      }

      let configId: string;

      // Verificar se é nova configuração ou atualização
      if (nome) {
        // Nova configuração
        configId = await configuracaoSinergiaApi.criarConfiguracao(
          configuracaoEditando,
          nome,
          descricao,
          ativar
        );
        
        toast({
          title: "Configuração criada!",
          description: `Nova configuração "${nome}" criada com sucesso`,
        });
      } else if (configuracaoAtiva && statusSistema?.configuracaoAtiva?.id) {
        // Atualizar configuração existente
        await configuracaoSinergiaApi.atualizarConfiguracao(
          statusSistema.configuracaoAtiva.id,
          configuracaoEditando,
          'Atualização via interface'
        );
        
        configId = statusSistema.configuracaoAtiva.id;
        
        toast({
          title: "Configuração atualizada!",
          description: "Alterações salvas com sucesso",
        });
      } else {
        throw new Error('Não é possível determinar se é nova configuração ou atualização');
      }

      // Ativar se solicitado
      if (ativar && nome) { // Apenas para novas configurações
        await configuracaoSinergiaApi.ativarConfiguracao(configId, 'Ativação via interface');
      }

      // Recarregar dados
      await carregarDados();
      setIsDirty(false);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      
      toast({
        title: "Erro ao salvar",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Aplicar template
   */
  const aplicarTemplate = async (templateNome: string, ativar: boolean = false) => {
    setIsSaving(true);
    setError(null);

    try {
      await configuracaoSinergiaApi.aplicarTemplate(templateNome, ativar);
      
      toast({
        title: "Template aplicado!",
        description: `Template "${templateNome}" aplicado com sucesso`,
      });

      // Recarregar dados
      await carregarDados();
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      
      toast({
        title: "Erro ao aplicar template",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Simular impacto da configuração
   */
  const simularImpacto = async (amostraSize: number = 50): Promise<ImpactoSimulado | null> => {
    if (!configuracaoEditando) return null;

    setIsSimulating(true);
    setError(null);

    try {
      const impacto = await configuracaoSinergiaApi.simularImpacto(configuracaoEditando, amostraSize);
      
      toast({
        title: "Simulação concluída",
        description: `Analisados ${impacto.totalAfetados} casos`,
      });

      return impacto;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      
      toast({
        title: "Erro na simulação",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsSimulating(false);
    }
  };

  /**
   * Atualizar configuração sendo editada
   */
  const atualizarConfiguracaoEditando = (novaConfiguracao: Partial<ConfiguracaoCompleta>) => {
    if (!configuracaoEditando) return;

    const configAtualizada = {
      ...configuracaoEditando,
      ...novaConfiguracao
    };

    setConfiguracaoEditando(configAtualizada);
    setIsDirty(true);
    
    // Validar em tempo real
    configuracaoSinergiaApi.validarConfiguracao(configAtualizada)
      .then(setValidationResult)
      .catch(console.error);
  };

  /**
   * Resetar para configuração ativa
   */
  const resetarParaAtiva = () => {
    if (configuracaoAtiva) {
      setConfiguracaoEditando(configuracaoAtiva);
      setIsDirty(false);
      setValidationResult(null);
    }
  };

  // Carregar dados na inicialização
  useEffect(() => {
    carregarDados();
  }, []);

  return {
    // Estados de dados
    configuracaoAtiva,
    configuracoes,
    statusSistema,
    configuracaoEditando,
    validationResult,
    
    // Estados de UI
    isLoading,
    isSaving,
    isSimulating,
    isDirty,
    error,
    
    // Ações
    carregarDados,
    salvarConfiguracao,
    aplicarTemplate,
    simularImpacto,
    atualizarConfiguracaoEditando,
    resetarParaAtiva,
    
    // Helpers
    isValid: validationResult?.valido ?? true,
    hasError: !!error,
    canSave: !!configuracaoEditando && isDirty
  };
};
