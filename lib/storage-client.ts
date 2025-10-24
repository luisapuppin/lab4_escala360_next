import { Profissional, Plantao, Escala, Substituicao, Auditoria } from '@/types';

// Client-side only storage - seguro para usar em componentes React
export const clientStorage = {
  // Profissionais
  getProfissionais: async (): Promise<Profissional[]> => {
    if (typeof window === 'undefined') return [];
    
    try {
      const response = await fetch('/api/profissionais');
      if (!response.ok) throw new Error('Failed to fetch profissionais');
      return await response.json();
    } catch (error) {
      console.error('Error fetching profissionais:', error);
      return [];
    }
  },

  getProfissional: async (id: number): Promise<Profissional | null> => {
    if (typeof window === 'undefined') return null;
    
    try {
      const response = await fetch(`/api/profissionais/${id}`);
      if (!response.ok) throw new Error('Failed to fetch profissional');
      return await response.json();
    } catch (error) {
      console.error('Error fetching profissional:', error);
      return null;
    }
  },

  createProfissional: async (profissional: Omit<Profissional, 'id'>): Promise<Profissional | null> => {
    if (typeof window === 'undefined') return null;
    
    try {
      const response = await fetch('/api/profissionais', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profissional),
      });
      if (!response.ok) throw new Error('Failed to create profissional');
      return await response.json();
    } catch (error) {
      console.error('Error creating profissional:', error);
      return null;
    }
  },

  // Plantões
  getPlantoes: async (): Promise<Plantao[]> => {
    if (typeof window === 'undefined') return [];
    
    try {
      const response = await fetch('/api/plantoes');
      if (!response.ok) throw new Error('Failed to fetch plantoes');
      return await response.json();
    } catch (error) {
      console.error('Error fetching plantoes:', error);
      return [];
    }
  },

  createPlantao: async (plantao: Omit<Plantao, 'id'>): Promise<Plantao | null> => {
    if (typeof window === 'undefined') return null;
    
    try {
      const response = await fetch('/api/plantoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plantao),
      });
      if (!response.ok) throw new Error('Failed to create plantao');
      return await response.json();
    } catch (error) {
      console.error('Error creating plantao:', error);
      return null;
    }
  },

  // Escalas
  getEscalas: async (): Promise<Escala[]> => {
    if (typeof window === 'undefined') return [];
    
    try {
      const response = await fetch('/api/escalas');
      if (!response.ok) throw new Error('Failed to fetch escalas');
      return await response.json();
    } catch (error) {
      console.error('Error fetching escalas:', error);
      return [];
    }
  },

  getEscalasProcessadas: async (): Promise<any[]> => {
    if (typeof window === 'undefined') return [];
    
    try {
      const response = await fetch('/api/escalas/processadas');
      if (!response.ok) throw new Error('Failed to fetch escalas processadas');
      return await response.json();
    } catch (error) {
      console.error('Error fetching escalas processadas:', error);
      return [];
    }
  },

  createEscala: async (escala: Omit<Escala, 'id' | 'data_alocacao'>): Promise<Escala | null> => {
    if (typeof window === 'undefined') return null;
    
    try {
      const response = await fetch('/api/escalas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(escala),
      });
      if (!response.ok) throw new Error('Failed to create escala');
      return await response.json();
    } catch (error) {
      console.error('Error creating escala:', error);
      return null;
    }
  },

  // Substituições
  getSubstituicoes: async (): Promise<Substituicao[]> => {
    if (typeof window === 'undefined') return [];
    
    try {
      const response = await fetch('/api/substituicoes');
      if (!response.ok) throw new Error('Failed to fetch substituicoes');
      return await response.json();
    } catch (error) {
      console.error('Error fetching substituicoes:', error);
      return [];
    }
  },

  getSubstituicoesPendentes: async (): Promise<Substituicao[]> => {
    if (typeof window === 'undefined') return [];
    
    try {
      const response = await fetch('/api/substituicoes?status=pendente');
      if (!response.ok) throw new Error('Failed to fetch substituicoes pendentes');
      return await response.json();
    } catch (error) {
      console.error('Error fetching substituicoes pendentes:', error);
      return [];
    }
  },

  createSubstituicao: async (
    substituicao: Omit<Substituicao, 'id' | 'data_solicitacao'>
  ): Promise<Substituicao | null> => {
    if (typeof window === 'undefined') return null;
    
    try {
      const response = await fetch('/api/substituicoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(substituicao),
      });
      if (!response.ok) throw new Error('Failed to create substituicao');
      return await response.json();
    } catch (error) {
      console.error('Error creating substituicao:', error);
      return null;
    }
  },

  aprovarSubstituicao: async (id: number): Promise<Substituicao | null> => {
    if (typeof window === 'undefined') return null;
    
    try {
      const response = await fetch(`/api/substituicoes/${id}/aprovar`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to approve substituicao');
      return await response.json();
    } catch (error) {
      console.error('Error approving substituicao:', error);
      return null;
    }
  },

  rejeitarSubstituicao: async (id: number): Promise<Substituicao | null> => {
    if (typeof window === 'undefined') return null;
    
    try {
      const response = await fetch(`/api/substituicoes/${id}/rejeitar`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to reject substituicao');
      return await response.json();
    } catch (error) {
      console.error('Error rejecting substituicao:', error);
      return null;
    }
  },

  // Dashboard Stats
  getDashboardStats: async (): Promise<{
    total_profissionais: number;
    total_plantoes: number;
    escalas_ativas: number;
    substituicoes_pendentes: number;
    proximos_plantoes: any[];
  }> => {
    if (typeof window === 'undefined') {
      return {
        total_profissionais: 0,
        total_plantoes: 0,
        escalas_ativas: 0,
        substituicoes_pendentes: 0,
        proximos_plantoes: [],
      };
    }
    
    try {
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) throw new Error('Failed to fetch dashboard stats');
      return await response.json();
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        total_profissionais: 0,
        total_plantoes: 0,
        escalas_ativas: 0,
        substituicoes_pendentes: 0,
        proximos_plantoes: [],
      };
    }
  },

  // Carga Horária
  getProfissionaisCargaExcedida: async (dataReferencia?: string): Promise<any[]> => {
    if (typeof window === 'undefined') return [];
    
    try {
      const url = dataReferencia 
        ? `/api/profissionais/carga-excedida?data_referencia=${dataReferencia}`
        : '/api/profissionais/carga-excedida';
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch carga excedida');
      return await response.json();
    } catch (error) {
      console.error('Error fetching carga excedida:', error);
      return [];
    }
  },
};

// Hook para uso em componentes React
export const useClientStorage = () => {
  // Em uma implementação real, isso seria um React Hook
  // Por enquanto, retornamos o objeto diretamente
  return clientStorage;
};

// Helper para verificar se estamos no client
export const isClient = () => typeof window !== 'undefined';