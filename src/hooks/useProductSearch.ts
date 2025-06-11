import { useState } from "react";

export function useProductSearch() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const search = async (params: any) => {
    setLoading(true);
    setError(null);
    try {
      // Cambiar a usar el proxy local
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

      const newResults = Array.isArray(data) ? data : [data];
      setResults(newResults);
      return newResults;
    } catch (e: any) {
      setError(e.message || "Error en la búsqueda");
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { loading, results, error, search, setResults };
}