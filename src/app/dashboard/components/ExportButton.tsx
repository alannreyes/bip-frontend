// ExportButton.tsx
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";

export default function ExportButton({ data }: { data: any[] }) {
  const exportToExcel = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevenir el submit del formulario
    e.stopPropagation(); // Detener la propagación del evento
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Resultados");
    XLSX.writeFile(wb, `resultados_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  return (
    <Button
      type="button" // IMPORTANTE: Especificar que NO es submit
      onClick={exportToExcel}
      className="bg-gray-800 hover:bg-gray-700 text-white"
    >
      Exportar a Excel
    </Button>
  );
}