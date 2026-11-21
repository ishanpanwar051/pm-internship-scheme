import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, Loader2 } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchKey?: keyof T;
  pageSize?: number;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchPlaceholder = 'Search records...',
  searchKey,
  pageSize = 10,
  isLoading = false,
  emptyMessage = 'No records found matching criteria',
  className = '',
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  // Filtered data
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((item) => {
      if (searchKey) {
        const val = String(item[searchKey] || '').toLowerCase();
        return val.includes(searchTerm.toLowerCase());
      }
      return Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [data, searchTerm, searchKey]);

  // Sorted data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key!];
      const bVal = b[sortConfig.key!];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginated data
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key?: keyof T) => {
    if (!key) return;
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <div className={`bg-saas-card border border-saas-border rounded-lg overflow-hidden ${className}`}>
      {/* Search Header */}
      <div className="p-3.5 border-b border-saas-border flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-saas-dim" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-saas-border bg-saas-surface text-saas-primary placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all"
          />
        </div>
        <div className="text-xs text-saas-dim">
          Showing <span className="font-mono text-saas-primary">{sortedData.length}</span> records
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-saas-surface/50 border-b border-saas-border text-saas-dim uppercase tracking-wider text-[10px] font-semibold">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="py-2.5 px-4 select-none"
                  onClick={() => col.sortable && handleSort(col.accessorKey)}
                >
                  <div className="flex items-center space-x-1 cursor-pointer hover:text-saas-primary transition-colors">
                    <span>{col.header}</span>
                    {col.sortable && <ArrowUpDown className="w-3 h-3 text-zinc-500" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-saas-border-subtle">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-10 text-center text-saas-dim">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-brand-indigo" />
                  <span>Loading records...</span>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-10 text-center text-saas-dim">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((item, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="hover:bg-saas-surface/60 transition-colors"
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="py-3 px-4 text-saas-primary">
                      {col.cell
                        ? col.cell(item)
                        : col.accessorKey
                        ? String(item[col.accessorKey] ?? '')
                        : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 border-t border-saas-border flex items-center justify-between text-xs">
        <div className="text-saas-dim">
          Page <span className="font-mono text-saas-primary">{currentPage}</span> of{' '}
          <span className="font-mono text-saas-primary">{totalPages}</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="p-1.5 rounded-md border border-saas-border disabled:opacity-30 disabled:cursor-not-allowed hover:bg-saas-surface text-saas-muted hover:text-saas-primary transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            className="p-1.5 rounded-md border border-saas-border disabled:opacity-30 disabled:cursor-not-allowed hover:bg-saas-surface text-saas-muted hover:text-saas-primary transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
