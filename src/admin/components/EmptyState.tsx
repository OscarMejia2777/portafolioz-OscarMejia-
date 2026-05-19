import { HiOutlinePlus } from 'react-icons/hi2'

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <p className="text-lg font-medium text-text/40">{title}</p>
      <p className="text-sm text-text/30 mt-1">{description}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-bg rounded-lg text-sm font-medium hover:brightness-110 transition-all">
          <HiOutlinePlus className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  )
}
