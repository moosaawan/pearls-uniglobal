'use client'

import { motion } from 'framer-motion'
import { ChevronRight, Search } from 'lucide-react'
import { useState, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'

export interface DataTableColumn<T> {
  header: string
  accessor: keyof T | ((row: T) => React.ReactNode)
  render?: (value: any, row: T) => React.ReactNode
  width?: string
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  isLoading?: boolean
  onRowClick?: (row: T) => void
  searchFields?: (keyof T)[]
  emptyMessage?: string
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  isLoading,
  onRowClick,
  searchFields = [],
  emptyMessage = 'No data found',
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredData = useMemo(() => {
    if (!searchTerm || searchFields.length === 0) return data

    return data.filter((item) =>
      searchFields.some((field) => {
        const value = item[field]
        return (
          value &&
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
    )
  }, [data, searchTerm, searchFields])

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-16 bg-white/5 border border-white/10 rounded-lg animate-pulse"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      {searchFields.length > 0 && (
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2">
          <Search size={18} className="text-white/50" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/50"
          />
        </div>
      )}

      {/* Table */}
      {filteredData.length > 0 ? (
        <div className="space-y-2">
          {filteredData.map((row, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onRowClick?.(row)}
              className={`p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all ${
                onRowClick ? 'cursor-pointer' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 grid gap-4" style={{
                  gridTemplateColumns: columns
                    .map((col) => col.width || 'auto')
                    .join(' '),
                }}>
                  {columns.map((column, colIdx) => {
                    const value =
                      typeof column.accessor === 'function'
                        ? column.accessor(row)
                        : row[column.accessor]

                    return (
                      <div key={colIdx} className="truncate">
                        {column.render ? (
                          column.render(value, row)
                        ) : typeof value === 'string' ? (
                          <p className="text-white text-sm">{value}</p>
                        ) : (
                          <p className="text-white/60 text-sm">-</p>
                        )}
                      </div>
                    )
                  })}
                </div>

                {onRowClick && <ChevronRight size={18} className="text-white/30" />}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-white/50 border border-white/10 rounded-lg">
          {emptyMessage}
        </div>
      )}
    </div>
  )
}
