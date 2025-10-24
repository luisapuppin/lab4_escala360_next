import { NextRequest, NextResponse } from 'next/server';
import { storageService } from '@/lib/storage';
import { Escala } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const processadas = url.searchParams.get('processadas');
    
    if (processadas === 'true') {
      const escalasProcessadas = await storageService.getEscalasProcessadas();
      return NextResponse.json(escalasProcessadas);
    }
    
    const escalas = await storageService.getEscalas();
    return NextResponse.json(escalas);
  } catch (error) {
    console.error('Error fetching escalas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch escalas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validação dos campos obrigatórios
    const requiredFields = ['id_plantao', 'id_profissional'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Verificar se o plantão existe
    const plantoes = await storageService.getPlantoes();
    const plantao = plantoes.find(p => p.id === body.id_plantao);
    if (!plantao) {
      return NextResponse.json(
        { error: 'Plantão not found' },
        { status: 404 }
      );
    }

    // Verificar se o profissional existe
    const profissionais = await storageService.getProfissionais();
    const profissional = profissionais.find(p => p.id === body.id_profissional);
    if (!profissional) {
      return NextResponse.json(
        { error: 'Profissional not found' },
        { status: 404 }
      );
    }

    // Verificar conflito de horário (similar à função do Django)
    const escalasExistentes = await storageService.getEscalas();
    const conflito = escalasExistentes.find(escala => 
      escala.id_profissional.id === body.id_profissional &&
      escala.id_plantao.data === plantao.data &&
      escala.status === 'ativo' &&
      (
        (escala.id_plantao.hora_inicio < plantao.hora_fim && 
         escala.id_plantao.hora_fim > plantao.hora_inicio)
      )
    );

    if (conflito) {
      return NextResponse.json(
        { error: 'Profissional já tem um plantão no mesmo horário' },
        { status: 409 }
      );
    }

    const novaEscala: Omit<Escala, 'id' | 'data_alocacao'> = {
      id_plantao: plantao,
      id_profissional: profissional,
      status: body.status || 'ativo',
    };

    const escala = await storageService.createEscala(novaEscala);
    
    // Log de auditoria
    await storageService.logAuditoria(
      'escala',
      escala.id,
      'criado',
      'sistema'
    );

    return NextResponse.json(escala, { status: 201 });
  } catch (error) {
    console.error('Error creating escala:', error);
    return NextResponse.json(
      { error: 'Failed to create escala' },
      { status: 500 }
    );
  }
}