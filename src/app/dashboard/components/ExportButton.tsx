import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";
import { ProcessedResult } from "@/lib/validation";
import { getCodeColorHex, getIndicatorText } from "@/lib/utils";

interface ExportButtonProps {
  data: ProcessedResult[];
}

export default function ExportButton({ data }: ExportButtonProps) {
  const exportToExcel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!data.length) return;

    // Preparar datos para Excel con indicadores de stock/pricing
    const excelData = data.map(row => {
      const boostSummary = row.boostSummary;
      
      return {
        'Consulta': row.consulta,
        'Código Recomendado': row.codigoRecomendado,
        'Descripción Recomendada': row.descripcionRecomendada,
        'Indicador Recomendado': row.codigoRecomendado ? getIndicatorText(row.codigoRecomendado, boostSummary) : '',
        'Código 1': row.codigo1,
        'Descripción 1': row.descripcion1,
        'Indicador 1': row.codigo1 ? getIndicatorText(row.codigo1, boostSummary) : '',
        'Código 2': row.codigo2,
        'Descripción 2': row.descripcion2,
        'Indicador 2': row.codigo2 ? getIndicatorText(row.codigo2, boostSummary) : '',
        'Código 3': row.codigo3,
        'Descripción 3': row.descripcion3,
        'Indicador 3': row.codigo3 ? getIndicatorText(row.codigo3, boostSummary) : '',
        'Código 4': row.codigo4,
        'Descripción 4': row.descripcion4,
        'Indicador 4': row.codigo4 ? getIndicatorText(row.codigo4, boostSummary) : '',
        'Código 5': row.codigo5,
        'Descripción 5': row.descripcion5,
        'Indicador 5': row.codigo5 ? getIndicatorText(row.codigo5, boostSummary) : '',
        'Código 6': row.codigo6,
        'Descripción 6': row.descripcion6,
        'Indicador 6': row.codigo6 ? getIndicatorText(row.codigo6, boostSummary) : '',
        'Código 7': row.codigo7,
        'Descripción 7': row.descripcion7,
        'Indicador 7': row.codigo7 ? getIndicatorText(row.codigo7, boostSummary) : '',
        'Código 8': row.codigo8,
        'Descripción 8': row.descripcion8,
        'Indicador 8': row.codigo8 ? getIndicatorText(row.codigo8, boostSummary) : '',
        'Código 9': row.codigo9,
        'Descripción 9': row.descripcion9,
        'Indicador 9': row.codigo9 ? getIndicatorText(row.codigo9, boostSummary) : '',
        'Código 10': row.codigo10,
        'Descripción 10': row.descripcion10,
        'Indicador 10': row.codigo10 ? getIndicatorText(row.codigo10, boostSummary) : '',
      };
    });

    // Crear workbook
    const wb = XLSX.utils.book_new();
    
    // Hoja 1: Resultados principales
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Aplicar colores a las celdas de códigos
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    for (let R = 1; R <= range.e.r; ++R) { // Empezar desde fila 1 (después de headers)
      const rowData = data[R - 1];
      if (!rowData) continue;
      
      // Colorear las columnas de códigos
      const codeColumns = [
        { col: 1, code: rowData.codigoRecomendado }, // B (Código Recomendado)
        { col: 4, code: rowData.codigo1 },           // E (Código 1)
        { col: 7, code: rowData.codigo2 },           // H (Código 2)
        { col: 10, code: rowData.codigo3 },          // K (Código 3)
        { col: 13, code: rowData.codigo4 },          // N (Código 4)
        { col: 16, code: rowData.codigo5 },          // Q (Código 5)
        { col: 19, code: rowData.codigo6 },          // T (Código 6)
        { col: 22, code: rowData.codigo7 },          // W (Código 7)
        { col: 25, code: rowData.codigo8 },          // Z (Código 8)
        { col: 28, code: rowData.codigo9 },          // AB (Código 9)
        { col: 31, code: rowData.codigo10 },         // AE (Código 10)
      ];
      
      codeColumns.forEach(({ col, code }) => {
        if (code) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: col });
          if (!ws[cellAddress]) return;
          
          const fillColor = getCodeColorHex(code, rowData.boostSummary);
          if (fillColor) {
            ws[cellAddress].s = {
              fill: {
                fgColor: { rgb: fillColor }
              }
            };
          }
        }
      });
    }
    
    XLSX.utils.book_append_sheet(wb, ws, "Resultados");
    
    // Hoja 2: Leyenda de colores
    const legendData = [
      { 'Color': 'Verde', 'Significado': 'Stock + Lista de costos', 'Código Hex': 'C6F6D5' },
      { 'Color': 'Azul', 'Significado': 'Solo con stock', 'Código Hex': 'DBEAFE' },
      { 'Color': 'Amarillo', 'Significado': 'Solo en lista de costos', 'Código Hex': 'FEF3C7' },
      { 'Color': 'Gris', 'Significado': 'Sin stock ni costos', 'Código Hex': 'F3F4F6' },
    ];
    
    const wsLegend = XLSX.utils.json_to_sheet(legendData);
    XLSX.utils.book_append_sheet(wb, wsLegend, "Leyenda");
    
    // Exportar archivo
    const filename = `resultados_${new Date().toISOString().slice(0,10)}.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  return (
    <Button
      type="button"
      onClick={exportToExcel}
      className="bg-gray-800 hover:bg-gray-700 text-white"
      disabled={!data.length}
    >
      Exportar a Excel ({data.length} resultados)
    </Button>
  );
}