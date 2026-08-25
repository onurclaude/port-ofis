import { cn } from "@/lib/utils";

export interface Column<T> {
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  className?: string;
}

export function DataTable<T>({ columns, rows, rowKey, className }: DataTableProps<T>) {
  return (
    <div className={cn("overflow-x-auto rounded-sm border border-hairline-soft", className)}>
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-hairline-soft bg-ink-soft">
            {columns.map((col) => (
              <th
                key={col.header}
                className={cn("px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted", col.className)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="border-b border-hairline-soft last:border-b-0 hover:bg-surface/50">
              {columns.map((col) => (
                <td key={col.header} className={cn("px-4 py-3.5 align-middle text-ivory/90", col.className)}>
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
