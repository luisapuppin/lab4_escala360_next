import { Funcao, Local, Profissional, Plantao, Escala, Substituicao, Auditoria } from '@/types';

// Dados iniciais baseados nos scripts Django originais

export const funcoesIniciais: Funcao[] = [
  {
    id: 1,
    nome: 'Médico',
    descricao: 'Profissional médico responsável por atendimentos'
  },
  {
    id: 2,
    nome: 'Enfermeiro', 
    descricao: 'Profissional de enfermagem de nível superior'
  },
  {
    id: 3,
    nome: 'Técnico de Enfermagem',
    descricao: 'Profissional de enfermagem de nível técnico'
  },
  {
    id: 4,
    nome: 'Recepcionista',
    descricao: 'Profissional de atendimento ao público'
  }
];

export const locaisIniciais: Local[] = [
  {
    id: 1,
    nome: 'Pronto Socorro',
    endereco: 'Av. Principal, 123 - Centro',
    ativo: true
  },
  {
    id: 2,
    nome: 'UTI',
    endereco: 'Av. Principal, 123 - 2º andar', 
    ativo: true
  },
  {
    id: 3,
    nome: 'Enfermaria A',
    endereco: 'Av. Principal, 123 - Ala A',
    ativo: true
  },
  {
    id: 4,
    nome: 'Enfermaria B',
    endereco: 'Av. Principal, 123 - Ala B',
    ativo: true
  },
  {
    id: 5, 
    nome: 'Ambulatório',
    endereco: 'Av. Principal, 123 - Térreo',
    ativo: true
  }
];

export const profissionaisIniciais: Profissional[] = [
  {
    id: 1,
    nome: 'Ana Souza',
    cargo: 'Enfermeira',
    email: 'ana.souza@example.com',
    telefone: '11999990001',
    ativo: true,
    carga_horaria_maxima_semanal: 40
  },
  {
    id: 2,
    nome: 'Carlos Lima',
    cargo: 'Médico',
    email: 'carlos.lima@example.com', 
    telefone: '11999990002',
    ativo: true,
    carga_horaria_maxima_semanal: 40
  },
  {
    id: 3,
    nome: 'Beatriz Santos',
    cargo: 'Técnico de Enfermagem',
    email: 'beatriz.santos@example.com',
    telefone: '11999990003',
    ativo: true, 
    carga_horaria_maxima_semanal: 40
  },
  {
    id: 4,
    nome: 'Daniel Oliveira',
    cargo: 'Médico',
    email: 'daniel.oliveira@example.com',
    telefone: '11999990004',
    ativo: true,
    carga_horaria_maxima_semanal: 40
  },
  {
    id: 5,
    nome: 'Fernanda Costa',
    cargo: 'Enfermeira',
    email: 'fernanda.costa@example.com',
    telefone: '11999990005',
    ativo: true,
    carga_horaria_maxima_semanal: 40
  }
];

// Dados mínimos para fazer o build passar - AGORA EXPORTADOS
export const plantoesIniciais: Plantao[] = [
  {
    id: 1,
    data: '2025-07-01',
    hora_inicio: '08:00',
    hora_fim: '14:00',
    funcao: funcoesIniciais[1], // Enfermeiro
    local: locaisIniciais[0], // Pronto Socorro
  }
];

export const escalasIniciais: Escala[] = [
  {
    id: 1,
    id_plantao: plantoesIniciais[0],
    id_profissional: profissionaisIniciais[0], // Ana Souza
    status: 'ativo',
    data_alocacao: new Date().toISOString(),
  }
];

export const substituicoesIniciais: Substituicao[] = [
  {
    id: 1,
    id_escala_original: escalasIniciais[0],
    id_profissional_solicitante: profissionaisIniciais[1], // Carlos Lima
    id_profissional_substituto: profissionaisIniciais[2], // Beatriz Santos
    data_solicitacao: new Date().toISOString(),
    status: 'pendente',
  }
];

export const auditoriaInicial: Auditoria[] = [
  {
    id: 1,
    entidade: 'substituicao',
    id_entidade: 1,
    acao: 'criado',
    usuario: 'sistema',
    data_hora: new Date().toISOString(),
  }
];

// Funções placeholder - serão implementadas depois
export const calcularHorasTrabalhadasSemana = (
  profissional: Profissional,
  escalas: Escala[],
  dataReferencia?: string
): number => {
  return 0;
};

export const calcularDuracaoPlantao = (plantao: Plantao): number => {
  return 6; // 14:00 - 08:00 = 6 horas
};
