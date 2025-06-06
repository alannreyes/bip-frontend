"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { searchSchema } from "../../../lib/validation";
import { useProductSearch } from "../../../hooks/useProductSearch";
import ResultsTable from "./ResultsTable";
import ExportButton from "./ExportButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";

export default function SearchForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: { limit: 5, segment: "standard" },
  });
  const { loading, results, error, search } = useProductSearch();

  return (
    <form
      onSubmit={handleSubmit(search)}
      className="bg-white shadow-sm rounded-xl p-8 max-w-xl mx-auto space-y-6 border border-gray-100"
    >
      <h2 className="text-2xl font-bold text-[#8DC63F] mb-4">Buscador de Productos</h2>
      
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
      {loading && <p className="text-[#8DC63F]">Cargando...</p>}
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