import { useState } from "react";
import { api } from "../lib/api";

export function useProductSearch() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const search = async (params: any) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/search", params);
      const newResults = Array.isArray(data) ? data : [data];
      setResults(newResults);
      return newResults; // IMPORTANTE: Retornar los resultados
    } catch (e: any) {
      setError("Error en la búsqueda");
      return []; // Retornar array vacío si hay error
    } finally {
      setLoading(false);
    }
  };

  return { loading, results, error, search, setResults };
}