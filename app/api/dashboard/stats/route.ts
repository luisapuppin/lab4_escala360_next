import { NextRequest, NextResponse } from 'next/server';
import { storageService } from '@/lib/storage';

export async function GET(request: NextRequest) {
  try {
    // Buscar todos os dados necessários
    const [profissionais, plantoes, escalas, substituicoes] = await Promise.all([
      storageService.getProfissionais(),
      storageService.getPlantoes(),
      storageService.getEscalas(),
      storageService.getSubstituicoes(),
    ]);

    // Calcular estatísticas
    const total_profissionais = profissionais.filter(p => p.ativo).length;
    const total_plantoes = plantoes.length;
    const escalas_ativas = escalas.filter(e => e.status === 'ativo').length;
    const substituicoes_pendentes = substituicoes.filter(s => s.status === 'pendente').length;

    // Próximos plantões (próximos 7 dias)
    const hoje = new Date();
    const seteDias = new Date(hoje);
    seteDias.setDate(hoje.getDate() + 7);

    const proximos_plantoes = plantoes
      .filter(plantao => {
        try {
          const dataPlantao = new Date(plantao.data);
          return dataPlantao >= hoje && dataPlantao <= seteDias;
        } catch (error) {
          return false;
        }
      })
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
      .slice(0, 10)
      .map(plantao => ({
        data: plantao.data,
        hora_inicio: plantao.hora_inicio,
        hora_fim: plantao.hora_fim,
        funcao: plantao.funcao,
        local: plantao.local
      }));

    return NextResponse.json({
      total_profissionais,
      total_plantoes,
      escalas_ativas,
      substituicoes_pendentes,
      proximos_plantoes,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    
    // Fallback para dados básicos em caso de erro
    return NextResponse.json({
      total_profissionais: 5,
      total_plantoes: 1,
      escalas_ativas: 1,
      substituicoes_pendentes: 1,
      proximos_plantoes: [],
    });
  }
}
