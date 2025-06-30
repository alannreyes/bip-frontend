"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bulkSchema } from "../../../lib/validation";
import { useProductSearch } from "../../../hooks/useProductSearch";
import ResultsTable from "./ResultsTable";
import ExportButton from "./ExportButton";
import ProgressBar from "./ProgressBar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ProcessedResult } from "@/lib/validation";

// Inferir el tipo del schema de Zod
import { z } from "zod";
type BulkFormData = z.infer<typeof bulkSchema>;

export default function BulkSearchForm() {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<BulkFormData>({
    resolver: zodResolver(bulkSchema),
    defaultValues: { 
      queries: "",
      limit: 10,
      segment: "standard" 
    },
  });
  
  const { results, error, search, setResults } = useProductSearch();
  const [progress, setProgress] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  
  // Watch para contar líneas
  const queries = watch("queries");
  const lineCount = queries ? queries.split("\n").filter(Boolean).length : 0;

  const onSubmit = async (data: BulkFormData) => {
    setResults([]);
    setProgress(0);
    setIsSearching(true);
    
    const lines = data.queries.split("\n").filter(Boolean).slice(0, 500);
    let allResults: ProcessedResult[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      try {
        const searchResults = await search({ 
          query: lines[i], 
          limit: data.limit, 
          segment: data.segment 
        });
        
        // searchResults ya viene como ProcessedResult[] del hook
        allResults = [...allResults, ...searchResults];
        
      } catch (error) {
        console.error(`Error buscando: ${lines[i]}`, error);
      }
      
      setProgress(Math.round(((i + 1) / lines.length) * 100));
    }
    
    setResults(allResults);
    setIsSearching(false);
  };

  const handleClear = () => {
    setValue("queries", "");
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-sm rounded-xl p-8 w-full space-y-6 border border-gray-100"
      >
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-semibold text-gray-700" htmlFor="queries">
              Términos de búsqueda (máx 500 líneas)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {lineCount} {lineCount === 1 ? 'producto' : 'productos'} ingresados
              </span>
              {lineCount > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-red-600 hover:text-red-700 underline"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>
          <div className="relative">
            <Textarea
              id="queries"
              className="rounded-lg border-gray-300 focus:border-[#8DC63F] focus:ring-[#8DC63F] resize-none overflow-y-auto font-mono text-sm"
              style={{ maxHeight: '300px', minHeight: '150px' }}
              {...register("queries")}
            />
            {/* Texto de ejemplo cuando el campo está vacío */}
            {!queries && (
              <div className="absolute top-3 left-3 text-gray-400 text-sm font-mono pointer-events-none">
                <div>Ingrese un producto por línea:</div>
                <div className="mt-2 text-gray-300">
                  <div>pilas alcalinas AA</div>
                  <div>pilas recargables AAA</div>
                  <div>cable hdmi 2 metros</div>
                  <div>martillo carpintero stanley</div>
                </div>
              </div>
            )}
            {/* Tooltip informativo */}
            <div className="absolute top-2 right-2 group">
              <svg 
                className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div className="absolute right-0 w-64 p-2 mt-1 text-xs text-gray-700 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <p className="font-semibold mb-1">Formato de entrada:</p>
                <ul className="space-y-1 text-gray-600">
                  <li>• Un producto por línea</li>
                  <li>• Máximo 500 productos</li>
                  <li>• Puede copiar y pegar desde Excel</li>
                  <li>• Se ignorarán líneas vacías</li>
                </ul>
              </div>
            </div>
          </div>
          {errors.queries && <p className="text-red-500 text-xs mt-1">{errors.queries.message}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
        
        {/* Sección de botones sticky */}
        <div className="sticky bottom-0 bg-white pt-4 pb-2 -mx-8 px-8 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <Button
              type="submit"
              disabled={isSearching || lineCount === 0}
              className="bg-[#8DC63F] hover:bg-[#6fa52e] text-white font-semibold rounded-lg px-6 py-2"
            >
              {isSearching ? "Buscando..." : `Buscar ${lineCount > 0 ? `(${lineCount})` : ''}`}
            </Button>
            
            {results.length > 0 && !isSearching && (
              <>
                <ExportButton data={results} />
                <span className="text-sm text-gray-600">
                  Total de resultados: {results.length}
                </span>
              </>
            )}
          </div>
        </div>
        
        {isSearching && <ProgressBar progress={progress} />}
        {error && <p className="text-red-500">{error}</p>}
      </form>
      
      {results.length > 0 && !isSearching && (
        <div className="mt-6">
          <ResultsTable data={results} />
        </div>
      )}
    </>
  );
}