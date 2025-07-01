import { useState } from "react";
import { ApiResponse, ProcessedResult } from "@/lib/validation";

export function useProductSearch() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ProcessedResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const search = async (params: { query: string; limit: number; segment: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/proxy-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error en la búsqueda');
      }

      console.log('🔍 Hook received data:', data);

      // Verificar si es la nueva API enriquecida o la anterior
      if (data.query_info && data.alternatives && data.boost_summary) {
        console.log('✅ Processing enriched API response');
        const processedResult = processApiResponse(data as ApiResponse, params.query);
        setResults([processedResult]);
        return [processedResult];
      } else {
        console.log('⚠️ Falling back to legacy API format');
        // Fallback para API anterior (formato array)
        const legacyResults = Array.isArray(data) ? data : [data];
        const processedResults = legacyResults.map((result: any) => ({
          consulta: params.query,
          codigoRecomendado: '',
          descripcionRecomendada: '',
          codigo1: result.codigo || '',
          descripcion1: result.descripcion || '',
          codigo2: '', descripcion2: '', codigo3: '', descripcion3: '',
          codigo4: '', descripcion4: '', codigo5: '', descripcion5: '',
          codigo6: '', descripcion6: '', codigo7: '', descripcion7: '',
          codigo8: '', descripcion8: '', codigo9: '', descripcion9: '',
          codigo10: '', descripcion10: '',
          boostSummary: { 
            products_with_stock: [], 
            products_with_pricing: [], 
            segment_matches: [], 
            boost_weights_used: {
              segmentPreferred: 1, segmentCompatible: 1, stock: 1, 
              costAgreement: 1, brandExact: 1, modelExact: 1, sizeExact: 1
            }
          }
        }));
        setResults(processedResults);
        return processedResults;
      }
    } catch (e: unknown) {
      console.error('❌ Search error:', e);
      const errorMessage = e instanceof Error ? e.message : "Error en la búsqueda";
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const processApiResponse = (apiResponse: ApiResponse, consulta: string): ProcessedResult => {
    const { selected_product, alternatives, boost_summary } = apiResponse;
    
    // Ordenar alternativas por rank
    const sortedAlternatives = alternatives.sort((a, b) => (a.rank || 0) - (b.rank || 0));
    
    return {
      consulta,
      // Producto recomendado (puede ser null)
      codigoRecomendado: selected_product?.codigo || '',
      descripcionRecomendada: selected_product?.descripcion || '',
      
      // 10 alternativas (rellenar con vacío si no hay suficientes)
      codigo1: sortedAlternatives[0]?.codigo || '',
      descripcion1: sortedAlternatives[0]?.descripcion || '',
      codigo2: sortedAlternatives[1]?.codigo || '',
      descripcion2: sortedAlternatives[1]?.descripcion || '',
      codigo3: sortedAlternatives[2]?.codigo || '',
      descripcion3: sortedAlternatives[2]?.descripcion || '',
      codigo4: sortedAlternatives[3]?.codigo || '',
      descripcion4: sortedAlternatives[3]?.descripcion || '',
      codigo5: sortedAlternatives[4]?.codigo || '',
      descripcion5: sortedAlternatives[4]?.descripcion || '',
      codigo6: sortedAlternatives[5]?.codigo || '',
      descripcion6: sortedAlternatives[5]?.descripcion || '',
      codigo7: sortedAlternatives[6]?.codigo || '',
      descripcion7: sortedAlternatives[6]?.descripcion || '',
      codigo8: sortedAlternatives[7]?.codigo || '',
      descripcion8: sortedAlternatives[7]?.descripcion || '',
      codigo9: sortedAlternatives[8]?.codigo || '',
      descripcion9: sortedAlternatives[8]?.descripcion || '',
      codigo10: sortedAlternatives[9]?.codigo || '',
      descripcion10: sortedAlternatives[9]?.descripcion || '',
      
      // Metadata para colores
      boostSummary: boost_summary,
    };
  };

  return { loading, results, error, search, setResults };
}