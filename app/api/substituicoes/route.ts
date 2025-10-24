import { NextRequest, NextResponse } from 'next/server';
import { storageService } from '@/lib/storage';
import { Substituicao } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    
    const substituicoes = await storageService.getSubstituicoes();
    
    if (status) {
      const filtered = substituicoes.filter(s => s.status === status);
      return NextResponse.json(filtered);
    }
    
    return NextResponse.json(substituicoes);
  } catch (error) {
    console.error('Error fetching substituicoes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch substituicoes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validação dos campos obrigatórios
    const requiredFields = ['id_escala_original', 'id_profissional_substituto'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Buscar a escala original
    const escalas = await storageService.getEscalas();
    const escalaOriginal = escalas.find(e => e.id === body.id_escala_original);
    if (!escalaOriginal) {
      return NextResponse.json(
        { error: 'Escala original not found' },
        { status: 404 }
      );
    }

    // Buscar o profissional substituto
    const profissionais = await storageService.getProfissionais();
    const profissionalSubstituto = profissionais.find(p => p.id === body.id_profissional_substituto);
    if (!profissionalSubstituto) {
      return NextResponse.json(
        { error: 'Profissional substituto not found' },
        { status: 404 }
      );
    }

    // Verificar se não está tentando substituir por si mesmo
    if (escalaOriginal.id_profissional.id === body.id_profissional_substituto) {
      return NextResponse.json(
        { error: 'Não é possível solicitar substituição para si mesmo' },
        { status: 400 }
      );
    }

    // Verificar conflito de horário do substituto
    const plantao = escalaOriginal.id_plantao;
    const escalasSubstituto = escalas.filter(escala => 
      escala.id_profissional.id === body.id_profissional_substituto &&
      escala.status === 'ativo' &&
      escala.id_plantao.data === plantao.data
    );

    const conflito = escalasSubstituto.find(escala => 
      (escala.id_plantao.hora_inicio < plantao.hora_fim && 
       escala.id_plantao.hora_fim > plantao.hora_inicio)
    );

    if (conflito) {
      return NextResponse.json(
        { error: 'O profissional substituto já tem um plantão no mesmo horário!' },
        { status: 409 }
      );
    }

    const novaSubstituicao: Omit<Substituicao, 'id' | 'data_solicitacao'> = {
      id_escala_original: escalaOriginal,
      id_profissional_solicitante: escalaOriginal.id_profissional,
      id_profissional_substituto: profissionalSubstituto,
      status: 'pendente',
    };

    const substituicao = await storageService.createSubstituicao(novaSubstituicao);
    
    // Log de auditoria
    await storageService.logAuditoria(
      'substituicao',
      substituicao.id,
      'solicitado',
      'sistema'
    );

    return NextResponse.json(substituicao, { status: 201 });
  } catch (error) {
    console.error('Error creating substituicao:', error);
    return NextResponse.json(
      { error: 'Failed to create substituicao' },
      { status: 500 }
    );
  }
}