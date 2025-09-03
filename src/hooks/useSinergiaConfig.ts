// Hook React para API de Configuração do SinergIA V2

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  ConfiguracaoCompleta,
  ConfiguracaoListItem,
  ImpactoSimulado,
  ValidationResult,
  StatusSistema,
  TemplateInfo,
  HistoricoItem
} from '../types/sinergia-config.types';

// Configuração da API
const API_BASE = '/api/sinergia-config';

// Função para fazer requests autenticados
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('authToken');
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(error.message || `Erro HTTP ${response.status}`);
  }

  return response.json();
};

// Hook principal para configuração do SinergIA
export const useSinergiaConfig = () => {
  const queryClient = useQueryClient();

  // 1. Status do Sistema
  const {
    data: statusSistema,
    isLoading: loadingStatus,
    error: statusError,
    refetch: refetchStatus
  } = useQuery({
    queryKey: ['sinergia-config', 'status'],
    queryFn: () => apiRequest('/status'),
    select: (data) => data.data as StatusSistema,
    staleTime: 30000, // 30 segundos
  });

  // 2. Configuração Ativa
  const {
    data: configuracaoAtiva,
    isLoading: loadingAtiva,
    error: ativaError,
    refetch: refetchAtiva
  } = useQuery({
    queryKey: ['sinergia-config', 'ativa'],
    queryFn: () => apiRequest('/ativa'),
    select: (data) => data.data as ConfiguracaoCompleta,
    staleTime: 60000, // 1 minuto
  });

  // 3. Lista de Configurações
  const {
    data: configuracoes,
    isLoading: loadingList,
    error: listError,
    refetch: refetchList
  } = useQuery({
    queryKey: ['sinergia-config', 'list'],
    queryFn: () => apiRequest('/'),
    select: (data) => data.data as ConfiguracaoListItem[],
    staleTime: 30000,
  });

  // 4. Templates Disponíveis
  const {
    data: templates,
    isLoading: loadingTemplates,
    error: templatesError
  } = useQuery({
    queryKey: ['sinergia-config', 'templates'],
    queryFn: () => apiRequest('/templates'),
    select: (data) => data.data as TemplateInfo[],
    staleTime: 300000, // 5 minutos
  });

  // 5. Criar Nova Configuração
  const criarConfiguracao = useMutation({
    mutationFn: async ({ 
      configuracao, 
      nome, 
      descricao, 
      ativar = false 
    }: {
      configuracao: ConfiguracaoCompleta;
      nome: string;
      descricao?: string;
      ativar?: boolean;
    }) => {
      return apiRequest('/', {
        method: 'POST',
        body: JSON.stringify({ configuracao, nome, descricao, ativar }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sinergia-config'] });
    },
  });

  // 6. Ativar Configuração
  const ativarConfiguracao = useMutation({
    mutationFn: async ({ 
      id, 
      motivo 
    }: { 
      id: string; 
      motivo?: string; 
    }) => {
      return apiRequest(`/${id}/ativar`, {
        method: 'PUT',
        body: JSON.stringify({ motivo }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sinergia-config'] });
    },
  });

  // 7. Aplicar Template
  const aplicarTemplate = useMutation({
    mutationFn: async ({ 
      templateNome, 
      ativar = false 
    }: { 
      templateNome: string; 
      ativar?: boolean; 
    }) => {
      return apiRequest(`/template/${templateNome}`, {
        method: 'POST',
        body: JSON.stringify({ ativar }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sinergia-config'] });
    },
  });

  // 8. Validar Configuração
  const validarConfiguracao = useMutation({
    mutationFn: async (configuracao: ConfiguracaoCompleta) => {
      return apiRequest('/validar', {
        method: 'POST',
        body: JSON.stringify({ configuracao }),
      });
    },
  });

  // 9. Simular Impacto
  const simularImpacto = useMutation({
    mutationFn: async ({ 
      configuracao, 
      amostraSize = 50 
    }: { 
      configuracao: ConfiguracaoCompleta; 
      amostraSize?: number; 
    }) => {
      return apiRequest('/simular', {
        method: 'POST',
        body: JSON.stringify({ configuracao, amostraSize }),
      });
    },
  });

  return {
    // Dados
    statusSistema,
    configuracaoAtiva,
    configuracoes,
    templates,
    
    // Estados de loading
    isLoading: loadingStatus || loadingAtiva || loadingList || loadingTemplates,
    loadingStatus,
    loadingAtiva,
    loadingList,
    loadingTemplates,
    
    // Erros
    errors: {
      status: statusError,
      ativa: ativaError,
      list: listError,
      templates: templatesError,
    },
    
    // Mutations
    criarConfiguracao,
    ativarConfiguracao,
    aplicarTemplate,
    validarConfiguracao,
    simularImpacto,
    
    // Helpers
    refetch: {
      status: refetchStatus,
      ativa: refetchAtiva,
      list: refetchList,
    },
    
    // Estados das mutations
    isCreating: criarConfiguracao.isPending,
    isActivating: ativarConfiguracao.isPending,
    isApplyingTemplate: aplicarTemplate.isPending,
    isValidating: validarConfiguracao.isPending,
    isSimulating: simularImpacto.isPending,
  };
};

// Hook para configuração específica
export const useConfiguracaoDetalhes = (id: string | undefined) => {
  return useQuery({
    queryKey: ['sinergia-config', 'detalhes', id],
    queryFn: () => apiRequest(`/${id}`),
    select: (data) => data.data as ConfiguracaoCompleta,
    enabled: !!id,
    staleTime: 60000,
  });
};

// Hook para histórico de configuração
export const useHistoricoConfiguracao = (id: string | undefined) => {
  return useQuery({
    queryKey: ['sinergia-config', 'historico', id],
    queryFn: () => apiRequest(`/${id}/historico`),
    select: (data) => data.data as HistoricoItem[],
    enabled: !!id,
    staleTime: 30000,
  });
};

// Hook para gerenciar estado do formulário
export const useConfigForm = (initialConfig?: ConfiguracaoCompleta) => {
  const [configuracao, setConfiguracao] = useState<ConfiguracaoCompleta>(
    initialConfig || {} as ConfiguracaoCompleta
  );
  const [isDirty, setIsDirty] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const { validarConfiguracao } = useSinergiaConfig();

  // Atualizar configuração
  const updateConfiguracao = useCallback((updates: Partial<ConfiguracaoCompleta>) => {
    setConfiguracao(prev => ({ ...prev, ...updates }));
    setIsDirty(true);
    setValidationResult(null);
  }, []);

  // Atualizar pesos
  const updatePesos = useCallback((pesos: Partial<ConfiguracaoCompleta['pesos']>) => {
    updateConfiguracao({ pesos: { ...configuracao.pesos, ...pesos } });
  }, [configuracao.pesos, updateConfiguracao]);

  // Atualizar eliminatórios
  const updateEliminatorios = useCallback((eliminatorios: Partial<ConfiguracaoCompleta['eliminatorios']>) => {
    updateConfiguracao({ eliminatorios: { ...configuracao.eliminatorios, ...eliminatorios } });
  }, [configuracao.eliminatorios, updateConfiguracao]);

  // Atualizar IA
  const updateIAConfig = useCallback((iaConfig: Partial<ConfiguracaoCompleta['iaConfig']>) => {
    updateConfiguracao({ iaConfig: { ...configuracao.iaConfig, ...iaConfig } });
  }, [configuracao.iaConfig, updateConfiguracao]);

  // Validar configuração atual
  const validate = useCallback(async () => {
    try {
      const result = await validarConfiguracao.mutateAsync(configuracao);
      setValidationResult(result.data);
      return result.data;
    } catch (error) {
      const errorResult: ValidationResult = {
        valido: false,
        erros: [error instanceof Error ? error.message : 'Erro de validação'],
        avisos: []
      };
      setValidationResult(errorResult);
      return errorResult;
    }
  }, [configuracao, validarConfiguracao]);

  // Reset para configuração inicial
  const reset = useCallback(() => {
    if (initialConfig) {
      setConfiguracao(initialConfig);
      setIsDirty(false);
      setValidationResult(null);
    }
  }, [initialConfig]);

  // Verificar se pesos somam 100
  const pesosValidos = useMemo(() => {
    if (!configuracao.pesos) return false;
    const soma = Object.values(configuracao.pesos).reduce((acc, val) => acc + val, 0);
    return Math.abs(soma - 100) < 0.01;
  }, [configuracao.pesos]);

  return {
    configuracao,
    isDirty,
    validationResult,
    pesosValidos,
    
    // Actions
    updateConfiguracao,
    updatePesos,
    updateEliminatorios,
    updateIAConfig,
    validate,
    reset,
    
    // Estados
    isValidating: validarConfiguracao.isPending,
  };
};

// Hook para simulação em tempo real
export const useSimulacaoTempReal = (configuracao: ConfiguracaoCompleta | undefined, delay = 2000) => {
  const [simulacaoData, setSimulacaoData] = useState<ImpactoSimulado | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const { simularImpacto } = useSinergiaConfig();

  const executarSimulacao = useCallback(async () => {
    if (!configuracao) return;

    setIsSimulating(true);
    try {
      const result = await simularImpacto.mutateAsync({ 
        configuracao, 
        amostraSize: 30 // Menor para tempo real
      });
      setSimulacaoData(result.data);
    } catch (error) {
      console.error('Erro na simulação:', error);
      setSimulacaoData(null);
    } finally {
      setIsSimulating(false);
    }
  }, [configuracao, simularImpacto]);

  // Debounce da simulação
  useEffect(() => {
    if (!configuracao) return;

    const timer = setTimeout(() => {
      executarSimulacao();
    }, delay);

    return () => clearTimeout(timer);
  }, [configuracao, delay, executarSimulacao]);

  return {
    simulacaoData,
    isSimulating,
    executarSimulacao,
  };
};
