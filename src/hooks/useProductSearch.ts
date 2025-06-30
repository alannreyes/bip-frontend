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

      // Procesar la nueva respuesta enriquecida
      const processedResult = processApiResponse(data as ApiResponse, params.query);
      setResults([processedResult]);
      return [processedResult];
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error en la búsqueda");
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