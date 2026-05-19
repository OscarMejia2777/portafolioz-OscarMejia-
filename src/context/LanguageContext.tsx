import { createContext, useContext, useState, type ReactNode } from 'react'
import { useTranslations } from '@/hooks/useTranslations'

type Language = 'en' | 'es'

interface LangContextValue {
  lang: Language
  t: (key: string) => string
  setLang: (l: Language) => void
  transLoading: boolean
}

const LangContext = createContext<LangContextValue>({
  lang: 'en',
  t: () => '',
  setLang: () => {},
  transLoading: true,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('en')
  const { all, loading } = useTranslations()

  const t = (key: string) => {
    if (loading) return ''
    return all[lang]?.[key] ?? key
  }

  return (
    <LangContext.Provider value={{ lang, t, setLang, transLoading: loading }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLanguage = () => useContext(LangContext)
