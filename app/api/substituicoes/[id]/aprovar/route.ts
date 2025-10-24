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

    // Verificar conflitos de horário do substituto
    const plantaoOriginal = substituicao.id_escala_original.id_plantao;
    const escalas = await storageService.getEscalas();
    
    const conflito = escalas.find(escala => 
      escala.id_profissional.id === substituicao.id_profissional_substituto.id &&
      escala.status === 'ativo' &&
      escala.id_plantao.data === plantaoOriginal.data &&
      escala.id !== substituicao.id_escala_original.id && // Excluir a escala original
      (
        escala.id_plantao.hora_inicio < plantaoOriginal.hora_fim && 
        escala.id_plantao.hora_fim > plantaoOriginal.hora_inicio
      )
    );

    if (conflito) {
      return NextResponse.json(
        { 
          error: `O profissional ${substituicao.id_profissional_substituto.nome} já tem um plantão no mesmo horário!` 
        },
        { status: 409 }
      );
    }

    // Verificar carga horária do substituto (implementação simplificada)
    // Em uma versão completa, calcularíamos as horas trabalhadas na semana
    const horasTrabalhadasSubstituto = 0; // Placeholder - será implementado depois
    const cargaMaxima = substituicao.id_profissional_substituto.carga_horaria_maxima_semanal;
    
    if (horasTrabalhadasSubstituto >= cargaMaxima) {
      return NextResponse.json(
        {
          warning: `Atenção: O profissional ${substituicao.id_profissional_substituto.nome} pode exceder a carga horária semanal.`
        },
        { status: 200 } // Ainda aprova, mas com aviso
      );
    }

    // Aprovar a substituição
    const substituicaoAtualizada = await storageService.updateSubstituicaoStatus(id, 'aprovado');
    
    if (!substituicaoAtualizada) {
      return NextResponse.json(
        { error: 'Failed to update substituicao' },
        { status: 500 }
      );
    }

    // Atualizar a escala original para refletir a substituição
    await storageService.updateEscalaStatus(
      substituicao.id_escala_original.id, 
      'substituido'
    );

    // Log de auditoria
    await storageService.logAuditoria(
      'substituicao',
      substituicaoAtualizada.id,
      'aprovado',
      'supervisor'
    );

    return NextResponse.json({
      success: true,
      message: `Substituição aprovada com sucesso! ${substituicao.id_profissional_solicitante.nome} → ${substituicao.id_profissional_substituto.nome}`,
      substituicao: substituicaoAtualizada
    });
    
  } catch (error) {
    console.error('Error approving substituicao:', error);
    return NextResponse.json(
      { error: 'Failed to approve substituicao' },
      { status: 500 }
    );
  }
}