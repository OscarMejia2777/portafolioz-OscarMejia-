interface TagProps {
  children: string
}

export function Tag({ children }: TagProps) {
  return (
    <span className="px-3 py-1 text-xs font-medium rounded-full bg-surface border border-white/5 text-text/70">
      {children}
    </span>
  )
}
