import { RegisterRequest, LoginRequest, ApiResponse } from '../../../../shared-types/api.types.ts';

export const authApi = {
  register: async (data: RegisterRequest): Promise<ApiResponse> => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro no servidor');
    }
    
    return response.json();
  },

  login: async (data: LoginRequest): Promise<ApiResponse> => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro no servidor');
    }
    
    return response.json();
  }
}; 