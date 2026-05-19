import type { ReactNode, ButtonHTMLAttributes } from 'react'
import { motion } from 'framer-motion'

type ButtonProps = {
  children: ReactNode
  variant?: 'primary' | 'outline' | 'ghost'
  href?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ children, variant = 'primary', href, className = '', ...props }: ButtonProps) {
  const base = 'inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 cursor-pointer'
  const variants = {
    primary: 'bg-primary text-bg hover:opacity-90 hover:scale-[1.02] active:scale-95',
    outline: 'border border-primary/40 text-primary hover:bg-primary/10 hover:border-primary',
    ghost: 'text-text/70 hover:text-primary',
  }

  const cls = `${base} ${variants[variant]} ${className}`

  if (href) {
    const isExternal = href.startsWith('http') || href.startsWith('mailto')
    return (
      <motion.a
        href={href}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className={cls}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button className={cls} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} {...props}>
      {children}
    </motion.button>
  )
}
