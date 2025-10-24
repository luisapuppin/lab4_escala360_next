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
        { error: 'Invalid profissional ID' },
        { status: 400 }
      );
    }

    const profissional = await storageService.getProfissional(id);
    
    if (!profissional) {
      return NextResponse.json(
        { error: 'Profissional not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(profissional);
  } catch (error) {
    console.error('Error fetching profissional:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profissional' },
      { status: 500 }
    );
  }
}