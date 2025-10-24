import { AppState, Profissional, Plantao, Escala, Substituicao, Auditoria, Funcao, Local } from '@/types';
import { profissionaisIniciais, funcoesIniciais, locaisIniciais } from '@/data/initialData';

// Simulação de dados iniciais baseados nos scripts Django
const plantoesIniciais: Plantao[] = [
  {
    id: 1,
    data: '2025-07-01',
    hora_inicio: '08:00',
    hora_fim: '14:00',
    funcao: funcoesIniciais[1], // Enfermeiro
    local: locaisIniciais[0], // Pronto Socorro
  },
  {
    id: 2,
    data: '2025-07-01',
    hora_inicio: '14:00',
    hora_fim: '20:00',
    funcao: funcoesIniciais[1], // Enfermeiro
    local: locaisIniciais[0], // Pronto Socorro
  },
  // ... mais plantões baseados no importar_dados_sql.py
];

const escalasIniciais: Escala[] = [
  {
    id: 1,
    id_plantao: plantoesIniciais[0],
    id_profissional: profissionaisIniciais[0], // Ana Souza
    status: 'ativo',
    data_alocacao: new Date().toISOString(),
  },
  {
    id: 2,
    id_plantao: plantoesIniciais[1],
    id_profissional: profissionaisIniciais[1], // Carlos Lima
    status: 'ativo',
    data_alocacao: new Date().toISOString(),
  },
  // ... mais escalas
];

const substituicoesIniciais: Substituicao[] = [
  {
    id: 1,
    id_escala_original: escalasIniciais[1],
    id_profissional_solicitante: profissionaisIniciais[1], // Carlos Lima
    id_profissional_substituto: profissionaisIniciais[2], // Beatriz Santos
    data_solicitacao: new Date().toISOString(),
    status: 'pendente',
  },
  // ... mais substituições
];

const auditoriaInicial: Auditoria[] = [
  {
    id: 1,
    entidade: 'substituicao',
    id_entidade: 1,
    acao: 'criado',
    usuario: 'sistema',
    data_hora: new Date().toISOString(),
  },
  // ... mais registros de auditoria
];

// Estado global da aplicação (simulando "banco de dados" em memória)
let appState: AppState = {
  profissionais: profissionaisIniciais,
  funcoes: funcoesIniciais,
  locais: locaisIniciais,
  plantoes: plantoesIniciais,
  escalas: escalasIniciais,
  substituicoes: substituicoesIniciais,
  auditoria: auditoriaInicial,
};

// Funções para persistência no Vercel KV (se disponível) ou fallback para localStorage
class StorageService {
  private async getFromKV<T>(key: string): Promise<T | null> {
    if (typeof window !== 'undefined') {
      // Client-side: usa localStorage como fallback
      try {
        const item = localStorage.getItem(`escala360_${key}`);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.warn('LocalStorage não disponível, usando estado em memória');
        return null;
      }
    } else {
      // Server-side: tenta usar Vercel KV se disponível
      try {
        // @ts-ignore - Vercel KV será injetado no ambiente
        const { kv } = await import('@vercel/kv');
        return await kv.get(key);
      } catch (error) {
        console.warn('Vercel KV não disponível, usando estado em memória');
        return null;
      }
    }
  }

  private async setToKV(key: string, value: any): Promise<void> {
    if (typeof window !== 'undefined') {
      // Client-side: usa localStorage
      try {
        localStorage.setItem(`escala360_${key}`, JSON.stringify(value));
      } catch (error) {
        console.warn('LocalStorage não disponível, dados não persistidos');
      }
    } else {
      // Server-side: tenta usar Vercel KV
      try {
        // @ts-ignore - Vercel KV será injetado no ambiente
        const { kv } = await import('@vercel/kv');
        await kv.set(key, value);
      } catch (error) {
        console.warn('Vercel KV não disponível, dados não persistidos');
      }
    }
  }

  // Carrega estado persistido ou retorna estado inicial
  async loadAppState(): Promise<AppState> {
    try {
      const persistedState = await this.getFromKV<AppState>('app_state');
      if (persistedState) {
        appState = persistedState;
      }
    } catch (error) {
      console.warn('Erro ao carregar estado persistido, usando estado inicial');
    }
    return appState;
  }

  // Salva estado atual
  async saveAppState(): Promise<void> {
    await this.setToKV('app_state', appState);
  }

  // Operações para Profissionais
  async getProfissionais(): Promise<Profissional[]> {
    const state = await this.loadAppState();
    return state.profissionais;
  }

  async getProfissional(id: number): Promise<Profissional | undefined> {
    const profissionais = await this.getProfissionais();
    return profissionais.find(p => p.id === id);
  }

  async createProfissional(profissional: Omit<Profissional, 'id'>): Promise<Profissional> {
    const newId = Math.max(0, ...appState.profissionais.map(p => p.id)) + 1;
    const newProfissional: Profissional = {
      ...profissional,
      id: newId,
    };
    
    appState.profissionais.push(newProfissional);
    await this.saveAppState();
    return newProfissional;
  }

  // Operações para Plantões
  async getPlantoes(): Promise<Plantao[]> {
    const state = await this.loadAppState();
    return state.plantoes;
  }

  async createPlantao(plantao: Omit<Plantao, 'id'>): Promise<Plantao> {
    const newId = Math.max(0, ...appState.plantoes.map(p => p.id)) + 1;
    const newPlantao: Plantao = {
      ...plantao,
      id: newId,
    };
    
    appState.plantoes.push(newPlantao);
    await this.saveAppState();
    return newPlantao;
  }

  // Operações para Escalas
  async getEscalas(): Promise<Escala[]> {
    const state = await this.loadAppState();
    return state.escalas;
  }

  async createEscala(escala: Omit<Escala, 'id' | 'data_alocacao'>): Promise<Escala> {
    const newId = Math.max(0, ...appState.escalas.map(e => e.id)) + 1;
    const newEscala: Escala = {
      ...escala,
      id: newId,
      data_alocacao: new Date().toISOString(),
    };
    
    appState.escalas.push(newEscala);
    await this.saveAppState();
    return newEscala;
  }

  async updateEscalaStatus(id: number, status: Escala['status']): Promise<Escala | undefined> {
    const escala = appState.escalas.find(e => e.id === id);
    if (escala) {
      escala.status = status;
      await this.saveAppState();
    }
    return escala;
  }

  // Operações para Substituições
  async getSubstituicoes(): Promise<Substituicao[]> {
    const state = await this.loadAppState();
    return state.substituicoes;
  }

  async createSubstituicao(
    substituicao: Omit<Substituicao, 'id' | 'data_solicitacao'>
  ): Promise<Substituicao> {
    const newId = Math.max(0, ...appState.substituicoes.map(s => s.id)) + 1;
    const newSubstituicao: Substituicao = {
      ...substituicao,
      id: newId,
      data_solicitacao: new Date().toISOString(),
    };
    
    appState.substituicoes.push(newSubstituicao);
    await this.saveAppState();
    return newSubstituicao;
  }

  async updateSubstituicaoStatus(
    id: number, 
    status: Substituicao['status']
  ): Promise<Substituicao | undefined> {
    const substituicao = appState.substituicoes.find(s => s.id === id);
    if (substituicao) {
      substituicao.status = status;
      await this.saveAppState();
    }
    return substituicao;
  }

  // Operações para Auditoria
  async getAuditoria(): Promise<Auditoria[]> {
    const state = await this.loadAppState();
    return state.auditoria;
  }

  async logAuditoria(
    entidade: string,
    id_entidade: number,
    acao: string,
    usuario: string = 'sistema'
  ): Promise<Auditoria> {
    const newId = Math.max(0, ...appState.auditoria.map(a => a.id)) + 1;
    const newAuditoria: Auditoria = {
      id: newId,
      entidade,
      id_entidade,
      acao,
      usuario,
      data_hora: new Date().toISOString(),
    };
    
    appState.auditoria.push(newAuditoria);
    await this.saveAppState();
    return newAuditoria;
  }

  // Funções auxiliares baseadas nas views Django
  async getEscalasProcessadas(): Promise<any[]> {
    const escalas = await this.getEscalas();
    const substituicoes = await this.getSubstituicoes();
    
    // Implementação similar à view visualizar_escalas do Django
    return escalas.map(escala => {
      const substituicaoAprovada = substituicoes.find(
        s => s.id_escala_original.id === escala.id && s.status === 'aprovado'
      );
      const substituicaoPendente = substituicoes.find(
        s => s.id_escala_original.id === escala.id && s.status === 'pendente'
      );

      return {
        ...escala,
        substituicao_aprovada: !!substituicaoAprovada,
        substituicao_pendente: !!substituicaoPendente,
        profissional_atual: substituicaoAprovada 
          ? substituicaoAprovada.id_profissional_substituto
          : escala.id_profissional,
        substituicao_info: substituicaoAprovada || substituicaoPendente,
      };
    });
  }

  // Reset para dados iniciais (útil para desenvolvimento)
  async resetToInitialState(): Promise<void> {
    appState = {
      profissionais: profissionaisIniciais,
      funcoes: funcoesIniciais,
      locais: locaisIniciais,
      plantoes: plantoesIniciais,
      escalas: escalasIniciais,
      substituicoes: substituicoesIniciais,
      auditoria: auditoriaInicial,
    };
    await this.saveAppState();
  }
}

// Singleton instance
export const storageService = new StorageService();

// Helper para inicialização
export async function initializeStorage(): Promise<void> {
  await storageService.loadAppState();
}