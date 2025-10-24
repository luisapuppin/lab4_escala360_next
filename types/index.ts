// Tipos baseados nos models Django originais

export interface Funcao {
  id: number;
  nome: string;
  descricao: string;
}

export interface Local {
  id: number;
  nome: string;
  endereco: string;
  ativo: boolean;
}

export interface Profissional {
  id: number;
  nome: string;
  cargo: string;
  email: string;
  telefone?: string;
  ativo: boolean;
  carga_horaria_maxima_semanal: number;
  horas_trabalhadas_semana?: (dataReferencia?: string) => number; // Método convertido para função
}

export interface Plantao {
  id: number;
  data: string; // ISO date string
  hora_inicio: string; // HH:MM format
  hora_fim: string; // HH:MM format
  funcao: Funcao;
  local: Local;
  duracao_horas?: () => number; // Método convertido para função
}

export type EscalaStatus = 'ativo' | 'inativo' | 'substituido';

export interface Escala {
  id: number;
  id_plantao: Plantao;
  id_profissional: Profissional;
  status: EscalaStatus;
  data_alocacao: string; // ISO datetime string
  
  // Métodos convertidos para funções auxiliares
  tem_substituicao_aprovada?: () => boolean;
  tem_substituicao_pendente?: () => boolean;
  get_profissional_atual?: () => Profissional;
}

export type SubstituicaoStatus = 'pendente' | 'aprovado' | 'rejeitado';

export interface Substituicao {
  id: number;
  id_escala_original: Escala;
  id_profissional_solicitante: Profissional;
  id_profissional_substituto: Profissional;
  data_solicitacao: string; // ISO datetime string
  status: SubstituicaoStatus;
}

export interface Auditoria {
  id: number;
  entidade: string;
  id_entidade: number;
  acao: string;
  usuario: string;
  data_hora: string; // ISO datetime string
}

// Tipos para o estado da aplicação
export interface AppState {
  profissionais: Profissional[];
  funcoes: Funcao[];
  locais: Local[];
  plantoes: Plantao[];
  escalas: Escala[];
  substituicoes: Substituicao[];
  auditoria: Auditoria[];
}

// Tipos para forms e operações
export interface PlantaoFormData {
  data: string;
  hora_inicio: string;
  hora_fim: string;
  funcao_id: number;
  local_id: number;
}

export interface EscalaFormData {
  id_profissional: number;
}

export interface SubstituicaoFormData {
  id_escala_original: number;
  id_profissional_substituto: number;
}

// Helper types para cálculos
export interface ProfissionalCargaHoraria {
  profissional: Profissional;
  horas_trabalhadas: number;
  carga_maxima: number;
  percentual: number;
  plantoes_semana: Array<{
    data: string;
    horario: string;
    horas: number;
  }>;
  diferenca: number;
}

export interface EscalaProcessada {
  id: number;
  id_plantao: Plantao;
  id_profissional: Profissional;
  status: EscalaStatus;
  data_alocacao: string;
  substituicao_aprovada: boolean;
  substituicao_pendente: boolean;
  profissional_atual: Profissional;
  substituicao_info?: Substituicao;
}

// Tipo para agrupar escalas por data
export interface EscalasPorData {
  [data: string]: EscalaProcessada[];
}