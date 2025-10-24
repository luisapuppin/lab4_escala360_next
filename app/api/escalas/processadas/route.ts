import { NextRequest, NextResponse } from 'next/server';
import { storageService } from '@/lib/storage';

export async function GET(request: NextRequest) {
  try {
    const escalasProcessadas = await storageService.getEscalasProcessadas();
    return NextResponse.json(escalasProcessadas);
  } catch (error) {
    console.error('Error fetching escalas processadas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch escalas processadas' },
      { status: 500 }
    );
  }
}