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
      setResults(Array.isArray(data) ? data : [data]);
    } catch (e: any) {
      setError("Error en la búsqueda");
    }
    setLoading(false);
  };

  return { loading, results, error, search, setResults };
} 