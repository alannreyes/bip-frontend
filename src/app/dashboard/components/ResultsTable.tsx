"use client";
import { Table } from "@/components/ui/table";

export default function ResultsTable({ data }: { data: any[] }) {
  if (!data.length) return null;
  const keys = Object.keys(data[0]).filter(k => k !== "timings");

  return (
    <div className="overflow-x-auto mt-8">
      <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-sm">
        <thead>
          <tr className="bg-[#f4faef] text-[#8DC63F]">
            {keys.map(key => (
              <th key={key} className="px-4 py-2 text-left font-semibold border-b border-gray-200">
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-[#f9fdf7]">
              {keys.map(key => (
                <td key={key} className="px-4 py-2 border-b border-gray-100 text-gray-700">
                  {Array.isArray(row[key]) ? row[key].join(", ") : row[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}