"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { searchSchema } from "../../../lib/validation";
import { useProductSearch } from "../../../hooks/useProductSearch";
import ResultsTable from "./ResultsTable";
import ExportButton from "./ExportButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Define el tipo manualmente
interface SearchFormData {
  query: string;
  limit: number;
  segment: "premium" | "economy" | "standard";
}

export default function SearchForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema) as any, // Forzar el tipo
    defaultValues: { 
      query: "",
      limit: 10, // Cambiado de 5 a 10 para coincidir con el schema
      segment: "standard" 
    },
  });
  
  const { loading, results, error, search, setResults } = useProductSearch();
  
  const handleSearch = async (data: SearchFormData) => {
    const searchResults = await search(data);
    
    // Agregar la consulta a cada resultado
    const resultsWithQuery = searchResults.map((result: any) => ({
      consulta: data.query,
      ...result
    }));
    
    setResults(resultsWithQuery);
  };
  
  return (
    <>
      <form
        onSubmit={handleSubmit(handleSearch)}
        className="bg-white shadow-sm rounded-xl p-8 w-full space-y-6 border border-gray-100"
      >
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="query">
            Término de búsqueda
          </label>
          <Input
            id="query"
            placeholder="Ej: pilas alcalinas AA"
            className="rounded-lg border-gray-300 focus:border-[#8DC63F] focus:ring-[#8DC63F]"
            {...register("query")}
          />
          {errors.query && <p className="text-red-500 text-xs mt-1">{errors.query.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="limit">
            Cantidad de alternativas
          </label>
          <Input
            id="limit"
            type="number"
            min={1}
            max={100}
            className="rounded-lg border-gray-300 focus:border-[#8DC63F] focus:ring-[#8DC63F]"
            {...register("limit", { valueAsNumber: true })}
          />
          {errors.limit && <p className="text-red-500 text-xs mt-1">{errors.limit.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="segment">
            Segmento
          </label>
          <select
            id="segment"
            className="rounded-lg border-gray-300 focus:border-[#8DC63F] focus:ring-[#8DC63F] w-full px-3 py-2"
            {...register("segment")}
          >
            <option value="premium">Premium</option>
            <option value="economy">Economy</option>
            <option value="standard">Standard</option>
          </select>
        </div>
        
        <Button
          type="submit"
          disabled={loading}
          className="bg-[#8DC63F] hover:bg-[#6fa52e] text-white font-semibold rounded-lg px-6 py-2"
        >
          Buscar
        </Button>
        
        {loading && <p className="text-[#8DC63F]">Cargando...</p>}
        {error && <p className="text-red-500">{error}</p>}
      </form>
      
      {results.length > 0 && (
        <div className="mt-6 bg-white shadow-sm rounded-xl p-8 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              Total de resultados: {results.length}
            </div>
            <ExportButton data={results} />
          </div>
          <ResultsTable data={results} />
        </div>
      )}
    </>
  );
}