import type { ReactNode, HTMLAttributes } from 'react'

type TagProps = {
  children: ReactNode
} & HTMLAttributes<HTMLSpanElement>

export function Tag({ children, ...props }: TagProps) {
  return (
    <span className="px-3 py-1 text-xs font-medium rounded-full bg-surface border border-white/5 text-text/70">
      {children}
    </span>
  )
}
