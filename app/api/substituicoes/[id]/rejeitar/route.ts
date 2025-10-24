import { NextRequest, NextResponse } from 'next/server';
import { storageService } from '@/lib/storage';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid substituicao ID' },
        { status: 400 }
      );
    }

    // Buscar a substituição
    const substituicoes = await storageService.getSubstituicoes();
    const substituicao = substituicoes.find(s => s.id === id);
    
    if (!substituicao) {
      return NextResponse.json(
        { error: 'Substituição not found' },
        { status: 404 }
      );
    }

    // Verificar se a substituição ainda está pendente
    if (substituicao.status !== 'pendente') {
      return NextResponse.json(
        { error: 'Esta substituição já foi processada' },
        { status: 400 }
      );
    }

    // Rejeitar a substituição
    const substituicaoAtualizada = await storageService.updateSubstituicaoStatus(id, 'rejeitado');
    
    if (!substituicaoAtualizada) {
      return NextResponse.json(
        { error: 'Failed to update substituicao' },
        { status: 500 }
      );
    }

    // Log de auditoria
    await storageService.logAuditoria(
      'substituicao',
      substituicaoAtualizada.id,
      'rejeitado',
      'supervisor'
    );

    return NextResponse.json({
      success: true,
      message: `Substituição rejeitada. ${substituicao.id_profissional_solicitante.nome} permanece no plantão.`,
      substituicao: substituicaoAtualizada
    });
    
  } catch (error) {
    console.error('Error rejecting substituicao:', error);
    return NextResponse.json(
      { error: 'Failed to reject substituicao' },
      { status: 500 }
    );
  }
}