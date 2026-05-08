import { currency, number, percent } from "@/lib/utils";

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (row: T) => React.ReactNode;
}

export function DataTable<T extends { id: string }>({
  title, rows, columns, estimated = false,
}: {
  title: string; rows: T[]; columns: Column<T>[]; estimated?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-700/40 bg-slate-900/60">
      <div className="flex items-center justify-between border-b border-slate-700/40 px-4 py-2.5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">{title}</h4>
        {estimated && (
          <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
            Estimated
          </span>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-700/30">
              {columns.map((col) => (
                <th key={String(col.key)} className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-center text-xs text-slate-600" colSpan={columns.length}>
                  No data available
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr key={row.id} className={`border-t border-slate-800/60 transition-colors hover:bg-slate-800/40 ${i % 2 === 0 ? "" : "bg-slate-800/20"}`}>
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-2.5 text-xs text-slate-300">
                      {col.render ? col.render(row) : String(row[col.key])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const formatters = { currency, number, percent };
