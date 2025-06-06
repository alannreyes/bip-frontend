"use client";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";

export default function ExportButton({ data }: { data: any[] }) {
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Resultados");
    XLSX.writeFile(wb, "resultados.xlsx");
  };

  return (
    <Button onClick={handleExport} className="mb-2">Exportar a Excel</Button>
  );
} 