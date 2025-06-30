import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.2.6:4000';
    
    // Si la URL ya incluye /search, no agregarlo de nuevo
    const searchUrl = API_URL.endsWith('/search') ? API_URL : `${API_URL}/search`;
    
    console.log('🔍 API Request:', { searchUrl, body });
    
    const response = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ API Error:', response.status, data);
      throw new Error(`API Error: ${response.status}`);
    }

    console.log('✅ API Response sample:', { 
      hasQueryInfo: !!data.query_info,
      hasSelectedProduct: !!data.selected_product,
      alternativesCount: data.alternatives?.length || 0,
      hasBoostSummary: !!data.boost_summary
    });

    return NextResponse.json(data);
    
  } catch (error: unknown) {
    console.error('Error en proxy:', error);
    return NextResponse.json(
      { error: 'Error al buscar productos' },
      { status: 500 }
    );
  }
}