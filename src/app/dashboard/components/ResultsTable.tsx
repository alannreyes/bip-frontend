"use client";
import { ProcessedResult } from "@/lib/validation";
import { getCodeColorClass, COLOR_LEGEND, cn } from "@/lib/utils";

interface ResultsTableProps {
  data: ProcessedResult[];
}

export default function ResultsTable({ data }: ResultsTableProps) {
  if (!data.length) return null;

  const columns = [
    { key: 'consulta', label: 'Consulta', isCode: false },
    { key: 'codigoRecomendado', label: 'Código Recomendado', isCode: true },
    { key: 'descripcionRecomendada', label: 'Descripción Recomendada', isCode: false },
    { key: 'codigo1', label: 'Código 1', isCode: true },
    { key: 'descripcion1', label: 'Descripción 1', isCode: false },
    { key: 'codigo2', label: 'Código 2', isCode: true },
    { key: 'descripcion2', label: 'Descripción 2', isCode: false },
    { key: 'codigo3', label: 'Código 3', isCode: true },
    { key: 'descripcion3', label: 'Descripción 3', isCode: false },
    { key: 'codigo4', label: 'Código 4', isCode: true },
    { key: 'descripcion4', label: 'Descripción 4', isCode: false },
    { key: 'codigo5', label: 'Código 5', isCode: true },
    { key: 'descripcion5', label: 'Descripción 5', isCode: false },
    { key: 'codigo6', label: 'Código 6', isCode: true },
    { key: 'descripcion6', label: 'Descripción 6', isCode: false },
    { key: 'codigo7', label: 'Código 7', isCode: true },
    { key: 'descripcion7', label: 'Descripción 7', isCode: false },
    { key: 'codigo8', label: 'Código 8', isCode: true },
    { key: 'descripcion8', label: 'Descripción 8', isCode: false },
    { key: 'codigo9', label: 'Código 9', isCode: true },
    { key: 'descripcion9', label: 'Descripción 9', isCode: false },
    { key: 'codigo10', label: 'Código 10', isCode: true },
    { key: 'descripcion10', label: 'Descripción 10', isCode: false },
  ];

  const getCellContent = (row: ProcessedResult, column: { key: string; label: string; isCode: boolean }) => {
    const value = row[column.key as keyof ProcessedResult];
    
    // Skip boostSummary as it's metadata, not displayable content
    if (column.key === 'boostSummary') {
      return null;
    }
    
    if (column.isCode && typeof value === 'string' && value) {
      const colorClass = getCodeColorClass(value, row.boostSummary);
      return (
        <span className={cn(
          "px-2 py-1 rounded border font-mono text-sm",
          colorClass
        )}>
          {value}
        </span>
      );
    }
    
    return <span className="text-gray-700">{String(value || '')}</span>;
  };

  return (
    <div className="space-y-4">
      {/* Leyenda de colores */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Leyenda de códigos:</h3>
        <div className="flex flex-wrap gap-4 text-xs">
          {COLOR_LEGEND.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className={cn("px-2 py-1 rounded border", item.color)}>
                Código
              </span>
              <span className="text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabla de resultados */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-sm">
          <thead>
            <tr className="bg-[#f4faef] text-[#8DC63F]">
              {columns.map((column) => (
                <th key={column.key} className="px-3 py-2 text-left font-semibold border-b border-gray-200 text-xs">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-[#f9fdf7]">
                {columns.map((column) => (
                  <td key={column.key} className="px-3 py-2 border-b border-gray-100 min-w-0">
                    <div className="truncate max-w-[200px]" title={String(row[column.key as keyof ProcessedResult] || '')}>
                      {getCellContent(row, column)}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}