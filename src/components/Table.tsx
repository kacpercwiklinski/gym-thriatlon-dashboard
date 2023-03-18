import { useState } from "react";

type TableColumn<T> = {
  label: string;
  key?: keyof T;
  content?: (item: any) => void
};


type TableProps<T> = {
  data: T[];
  columns: TableColumn<T>[];
};

function Table<T>({ data, columns }: TableProps<T>) {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const sortedData = [...data].sort((a, b) => {
    if (sortColumn == null) {
      return 0;
    }

    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (aValue < bValue) {
      return sortDirection === "asc" ? -1 : 1;
    } else if (aValue > bValue) {
      return sortDirection === "asc" ? 1 : -1;
    } else {
      return 0;
    }
  });

  const handleColumnClick = (columnKey: keyof T | any) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const renderHeaderCell = (column: TableColumn<T>, index: number) => {
    const isSortable = column.key !== undefined;

    return (
      <th
        key={column.label}
        onClick={isSortable ? () => handleColumnClick(column.key) : undefined}
        style={{ cursor: isSortable ? "pointer" : undefined }}
      >
        <div>
          {column.label}
          {isSortable && sortColumn === column.key && (
            <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
          )}
        </div>
      </th>
    );
  };

  const renderDataRow = (row: T, rowIndex: number) => {
    return (
      <tr key={rowIndex}>
        {columns.map((column, columnIndex) => {
          if (column.content) {
            // @ts-ignore
            return <td key={`${rowIndex}-${columnIndex}`}>{column.content(row[column.key])}</td>
          } else {
            // @ts-ignore
            return <td key={`${rowIndex}-${columnIndex}`}>{row[column.key]}</td>;
          }
        })}
      </tr>
    );
  };

  return (
    <table className="table table-fixed	 max-w-8xl w-full table-zebra">
      <thead>
        <tr>{columns.map(renderHeaderCell)}</tr>
      </thead>
      <tbody>{sortedData.map(renderDataRow)}</tbody>
    </table>
  );
}

export default Table