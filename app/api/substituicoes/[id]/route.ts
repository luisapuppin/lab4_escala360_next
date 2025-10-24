import { NextRequest, NextResponse } from 'next/server';
import { storageService } from '@/lib/storage';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid substituicao ID' },
        { status: 400 }
      );
    }

    const substituicoes = await storageService.getSubstituicoes();
    const substituicao = substituicoes.find(s => s.id === id);
    
    if (!substituicao) {
      return NextResponse.json(
        { error: 'Substituição not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(substituicao);
  } catch (error) {
    console.error('Error fetching substituicao:', error);
    return NextResponse.json(
      { error: 'Failed to fetch substituicao' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid substituicao ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !['pendente', 'aprovado', 'rejeitado'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const substituicaoAtualizada = await storageService.updateSubstituicaoStatus(id, status);
    
    if (!substituicaoAtualizada) {
      return NextResponse.json(
        { error: 'Substituição not found' },
        { status: 404 }
      );
    }

    // Log de auditoria
    await storageService.logAuditoria(
      'substituicao',
      substituicaoAtualizada.id,
      'atualizado',
      'sistema'
    );

    return NextResponse.json(substituicaoAtualizada);
  } catch (error) {
    console.error('Error updating substituicao:', error);
    return NextResponse.json(
      { error: 'Failed to update substituicao' },
      { status: 500 }
    );
  }
}