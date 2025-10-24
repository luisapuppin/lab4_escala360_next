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

    // Calcular estatísticas similares à view dashboard do Django
    const total_profissionais = profissionais.filter(p => p.ativo).length;
    const total_plantoes = plantoes.length;
    const escalas_ativas = escalas.filter(e => e.status === 'ativo').length;
    const substituicoes_pendentes = substituicoes.filter(s => s.status === 'pendente').length;

    // Próximos plantões (próximos 7 dias) - similar ao Django
    const hoje = new Date();
    const seteDias = new Date(hoje);
    seteDias.setDate(hoje.getDate() + 7);

    const proximos_plantoes = plantoes
      .filter(plantao => {
        const dataPlantao = new Date(plantao.data);
        return dataPlantao >= hoje && dataPlantao <= seteDias;
      })
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
      .slice(0, 10); // Limitar a 10 resultados

    return NextResponse.json({
      total_profissionais,
      total_plantoes,
      escalas_ativas,
      substituicoes_pendentes,
      proximos_plantoes,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}