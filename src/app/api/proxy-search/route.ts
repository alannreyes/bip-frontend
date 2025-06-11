import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://axioma.efc.com.pe:4000';
    
    const response = await fetch(`${API_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error('Error en proxy:', error);
    return NextResponse.json(
      { error: 'Error al buscar productos' },
      { status: 500 }
    );
  }
}