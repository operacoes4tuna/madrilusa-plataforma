// API Client para Sistema de Configuração Parametrizável do SinergIA V2

import type { 
  ConfiguracaoCompleta,
  StatusSistema,
  ImpactoSimulado,
  ValidationResult,
  ApiResponse
} from '../types/backend-compat.types';

const BASE_URL = '/api/sinergia-config';

export const configuracaoSinergiaApi = {
  /**
   * Status do sistema
   */
  async getStatus(): Promise<StatusSistema> {
    const token = this.getAuthToken();
    
    const response = await fetch(`${BASE_URL}/status`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`Erro ao buscar status: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  },

  /**
   * Configuração ativa atual
   */
  async getConfiguracaoAtiva(): Promise<ConfiguracaoCompleta> {
    const token = this.getAuthToken();
    
    const response = await fetch(`${BASE_URL}/ativa`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`Erro ao buscar configuração ativa: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  },

  /**
   * Listar todas as configurações
   */
  async listarConfiguracoes(): Promise<any[]> {
    const token = this.getAuthToken();
    
    const response = await fetch(`${BASE_URL}/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`Erro ao listar configurações: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  },

  /**
   * Buscar configuração específica por ID
   */
  async getConfiguracao(id: string): Promise<ConfiguracaoCompleta> {
    const token = this.getAuthToken();
    
    const response = await fetch(`${BASE_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`Erro ao buscar configuração: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  },

  /**
   * Criar nova configuração
   */
  async criarConfiguracao(
    configuracao: ConfiguracaoCompleta,
    nome: string,
    descricao?: string,
    ativar: boolean = false
  ): Promise<string> {
    const token = this.getAuthToken();
    
    const response = await fetch(`${BASE_URL}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        configuracao,
        nome,
        descricao,
        ativar
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao criar configuração');
    }
    
    const data = await response.json();
    return data.data.id;
  },

  /**
   * Atualizar configuração existente
   */
  async atualizarConfiguracao(
    id: string,
    configuracao: ConfiguracaoCompleta,
    motivo?: string
  ): Promise<void> {
    const token = this.getAuthToken();
    
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        configuracao,
        motivo
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao atualizar configuração');
    }
  },

  /**
   * Ativar configuração específica
   */
  async ativarConfiguracao(id: string, motivo?: string): Promise<void> {
    const token = this.getAuthToken();
    
    const response = await fetch(`${BASE_URL}/${id}/ativar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ motivo })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao ativar configuração');
    }
  },

  /**
   * Desativar configuração (definir como inativa)
   */
  async desativarConfiguracao(id: string, motivo?: string): Promise<void> {
    const token = this.getAuthToken();
    
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ motivo })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao desativar configuração');
    }
  },

  /**
   * Simular impacto de configuração
   */
  async simularImpacto(
    configuracao: ConfiguracaoCompleta,
    amostraSize: number = 50
  ): Promise<ImpactoSimulado> {
    const token = this.getAuthToken();
    
    const response = await fetch(`${BASE_URL}/simular`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        configuracao,
        amostraSize
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao simular impacto');
    }
    
    const data = await response.json();
    return data.data;
  },

  /**
   * Obter templates disponíveis
   */
  async getTemplates(): Promise<any[]> {
    const token = this.getAuthToken();
    
    const response = await fetch(`${BASE_URL}/templates`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`Erro ao buscar templates: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  },

  /**
   * Aplicar template
   */
  async aplicarTemplate(
    templateNome: string,
    ativar: boolean = false
  ): Promise<string> {
    const token = this.getAuthToken();
    
    const response = await fetch(`${BASE_URL}/template/${templateNome}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ ativar })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao aplicar template');
    }
    
    const data = await response.json();
    return data.data.id;
  },

  /**
   * Buscar histórico de uma configuração
   */
  async getHistorico(id: string): Promise<HistoricoItem[]> {
    const response = await fetch(`${BASE_URL}/${id}/historico`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar histórico: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  },

  /**
   * Validar configuração
   */
  async validarConfiguracao(configuracao: ConfiguracaoCompleta): Promise<ValidationResult> {
    const token = this.getAuthToken();
    
    const response = await fetch(`${BASE_URL}/validar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ configuracao })
    });

    if (!response.ok) {
      throw new Error(`Erro ao validar configuração: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  },

  /**
   * Helper para obter token de autenticação
   */
  getAuthToken(): string {
    const user = localStorage.getItem('madrilusa_user');
    if (!user) {
      // Para desenvolvimento, retornar token fictício
      console.warn('⚠️  Usuário não autenticado, usando token de desenvolvimento');
      return 'development-token';
    }
    
    try {
      const userData = JSON.parse(user);
      return userData.token || 'development-token';
    } catch {
      return 'development-token';
    }
  },

  /**
   * Testar conectividade com backend
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch('/api/system/health');
      return response.ok;
    } catch {
      return false;
    }
  }
};
