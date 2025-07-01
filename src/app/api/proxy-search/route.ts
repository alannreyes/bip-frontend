import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.2.6:4000';
    
    // Si la URL ya incluye /search, no agregarlo de nuevo
    const searchUrl = API_URL.endsWith('/search') ? API_URL : `${API_URL}/search`;
    
    console.log('🔍 API Request:', { 
      searchUrl, 
      body,
      headers: Object.fromEntries(request.headers.entries()),
      env_API_URL: process.env.NEXT_PUBLIC_API_URL
    });
    
    // Asegurar que limit sea string para el backend
    const requestBody = {
      ...body,
      limit: String(body.limit)
    };
    
    console.log('📤 Sending to backend:', requestBody);
    
    const response = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📥 Backend response status:', response.status);
    console.log('📥 Backend response headers:', Object.fromEntries(response.headers.entries()));

    let data;
    const responseText = await response.text();
    console.log('📥 Raw backend response:', responseText);
    
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse JSON response:', parseError);
      throw new Error(`Invalid JSON response: ${responseText}`);
    }

    if (!response.ok) {
      console.error('❌ API Error:', {
        status: response.status, 
        statusText: response.statusText,
        data,
        url: searchUrl
      });
      
      // Retornar el error del backend directamente
      return NextResponse.json(
        { error: `Backend error: ${response.status} - ${JSON.stringify(data)}` },
        { status: response.status }
      );
    }

    console.log('✅ API Response sample:', { 
      hasQueryInfo: !!data.query_info,
      hasSelectedProduct: !!data.selected_product,
      alternativesCount: data.alternatives?.length || 0,
      hasBoostSummary: !!data.boost_summary,
      dataKeys: Object.keys(data || {})
    });

    return NextResponse.json(data);
    
  } catch (error: unknown) {
    console.error('❌ Proxy error details:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      { 
        error: 'Error al buscar productos',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}