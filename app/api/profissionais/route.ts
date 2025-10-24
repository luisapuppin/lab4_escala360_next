import { NextRequest, NextResponse } from 'next/server';
import { storageService } from '@/lib/storage';
import { Profissional } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const profissionais = await storageService.getProfissionais();
    return NextResponse.json(profissionais);
  } catch (error) {
    console.error('Error fetching profissionais:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profissionais' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validação básica dos campos obrigatórios
    const requiredFields = ['nome', 'cargo', 'email', 'carga_horaria_maxima_semanal'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const novoProfissional: Omit<Profissional, 'id'> = {
      nome: body.nome,
      cargo: body.cargo,
      email: body.email,
      telefone: body.telefone || '',
      ativo: body.ativo !== undefined ? body.ativo : true,
      carga_horaria_maxima_semanal: body.carga_horaria_maxima_semanal,
    };

    const profissional = await storageService.createProfissional(novoProfissional);
    
    // Log de auditoria
    await storageService.logAuditoria(
      'profissional',
      profissional.id,
      'criado',
      'sistema'
    );

    return NextResponse.json(profissional, { status: 201 });
  } catch (error) {
    console.error('Error creating profissional:', error);
    return NextResponse.json(
      { error: 'Failed to create profissional' },
      { status: 500 }
    );
  }
}