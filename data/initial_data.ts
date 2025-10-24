import { Funcao, Local, Profissional, Plantao, Escala, Substituicao, Auditoria } from '@/types';

// Dados iniciais baseados no arquivo criar_funcoes_locais.py e importar_dados_sql.py

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
  }
  // ... outros profissionais do importar_dados_sql.py
];

// Funções auxiliares que substituem os métodos dos models
export const calcularHorasTrabalhadasSemana = (
  profissional: Profissional,
  escalas: Escala[],
  dataReferencia?: string
): number => {
  // Implementação similar ao método horas_trabalhadas_semana do Django
  // Será implementada posteriormente
  return 0;
};

export const calcularDuracaoPlantao = (plantao: Plantao): number => {
  // Implementação similar ao método duracao_horas do Django
  // Será implementada posteriormente  
  return 0;
};