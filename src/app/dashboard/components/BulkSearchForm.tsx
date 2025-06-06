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
import { z } from "zod";
import { useState } from "react";

export default function BulkSearchForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof bulkSchema>>({
    resolver: zodResolver(bulkSchema),
    defaultValues: { limit: 5, segment: "standard" },
  });
  const { loading, results, error, search, setResults } = useProductSearch();
  const [progress, setProgress] = useState(0);

  const onSubmit = async (data: any) => {
    setResults([]);
    setProgress(0);
    const lines = data.queries.split("\n").filter(Boolean).slice(0, 500);
    let allResults: any[] = [];
    for (let i = 0; i < lines.length; i++) {
      await search({ query: lines[i], limit: data.limit, segment: data.segment });
      setProgress(Math.round(((i + 1) / lines.length) * 100));
      // Aquí deberías acumular los resultados de cada búsqueda
      // allResults = [...allResults, ...resultadosDeEstaBusqueda]
    }
    // setResults(allResults);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white shadow-sm rounded-xl p-8 max-w-xl mx-auto space-y-6 border border-gray-100"
    >
      <h2 className="text-2xl font-bold text-[#8DC63F] mb-4">Búsqueda masiva de productos</h2>
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="queries">
          Términos de búsqueda (máx 500 líneas)
        </label>
        <Textarea
          id="queries"
          placeholder="Ejemplo:\npilas alcalinas AA\npilas recargables AAA"
          rows={8}
          className="rounded-lg border-gray-300 focus:border-[#8DC63F] focus:ring-[#8DC63F]"
          {...register("queries")}
        />
        {errors.queries && <p className="text-red-500 text-xs mt-1">{errors.queries.message}</p>}
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
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="segment">
          Segmento
        </label>
        <select
          id="segment"
          className="rounded-lg border-gray-300 focus:border-[#8DC63F] focus:ring-[#8DC63F] w-full px-3 py-2"
          {...register("segment")}
          defaultValue="standard"
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
      {loading && <ProgressBar progress={progress} />}
      {error && <p className="text-red-500">{error}</p>}
      {results.length > 0 && (
        <>
          <ExportButton data={results} />
          <ResultsTable data={results} />
        </>
      )}
    </form>
  );
}