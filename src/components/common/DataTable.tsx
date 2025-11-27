import React from "react";

interface Column<T> {
  key: keyof T | string;
  label: string;
  align?: "left" | "center" | "right";
  width?: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: readonly Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  emptyText?: string;
}

export default function DataTable<T>({
  columns,
  data,
  onRowClick,
  emptyText = "데이터가 없습니다.",
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-xl border border-gray-100">
      <table className="min-w-full text-sm text-gray-700 table-fixed">
        <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs tracking-wide">
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className={`py-3.5 px-6 font-semibold ${
                  col.align === "right"
                    ? "text-right"
                    : col.align === "center"
                    ? "text-center"
                    : "text-left"
                } ${col.width || ""}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length > 0 ? (
            data.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(item)}
                className={`hover:bg-blue-50/50 transition-all duration-150 ${
                  onRowClick ? "cursor-pointer hover:shadow-sm" : ""
                }`}
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={`py-3.5 px-6 truncate ${
                      col.align === "right"
                        ? "text-right"
                        : col.align === "center"
                        ? "text-center"
                        : "text-left"
                    }`}
                  >
                    {col.render ? col.render(item) : (item[col.key as keyof T] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="py-6 text-center text-gray-400 text-sm"
              >
                💡 {emptyText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
