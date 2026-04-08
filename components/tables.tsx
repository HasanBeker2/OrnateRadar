import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { currency, number, percent } from "@/lib/utils";

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (row: T) => React.ReactNode;
}

export function DataTable<T extends { id: string }>({ title, rows, columns, estimated = false }: { title: string; rows: T[]; columns: Column<T>[]; estimated?: boolean }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
        {estimated && <Badge>Estimated</Badge>}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              {columns.map((col) => (
                <th key={String(col.key)} className="px-4 py-2 text-left font-medium">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-center text-slate-500" colSpan={columns.length}>No data available for this selection.</td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-t border-slate-100 text-slate-700">
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-2">{col.render ? col.render(row) : String(row[col.key])}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export const formatters = { currency, number, percent };
