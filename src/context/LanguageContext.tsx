import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { translations, type Language } from '@/data/translations'

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lang')
      if (saved === 'es' || saved === 'en') return saved
    }
    return 'en'
  })

  useEffect(() => {
    localStorage.setItem('lang', language)
  }, [language])

  const toggleLanguage = () => setLanguage(prev => prev === 'en' ? 'es' : 'en')

  const t = (key: string) => translations[language][key] ?? key

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
