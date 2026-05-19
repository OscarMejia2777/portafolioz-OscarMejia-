import { HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2'
import type { ReactNode } from 'react'

interface Column<T> {
  key: string
  label: string
  render?: (item: T) => ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  loading?: boolean
}

export default function DataTable<T extends { id: number | string }>({
  columns, data, onEdit, onDelete, loading,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="text-center py-12 text-text/40 text-sm">Loading...</div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/5">
            {columns.map((col) => (
              <th key={col.key} className="text-left py-3 px-3 text-text/40 font-medium">
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="text-right py-3 px-3 text-text/40 font-medium w-20">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-b border-white/5 hover:bg-surface/10 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="py-3 px-3 text-white">
                  {col.render ? col.render(item) : String((item as any)[col.key] ?? '')}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="py-3 px-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {onEdit && (
                      <button onClick={() => onEdit(item)} className="p-2 rounded-lg text-text/40 hover:text-white hover:bg-surface/20 transition-all">
                        <HiOutlinePencilSquare size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(item)} className="p-2 rounded-lg text-text/40 hover:text-red-400 hover:bg-red-500/10 transition-all">
                        <HiOutlineTrash size={16} />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
