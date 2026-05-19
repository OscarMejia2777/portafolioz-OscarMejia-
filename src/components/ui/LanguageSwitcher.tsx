import { useLanguage } from '@/context/LanguageContext'

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()

  return (
    <div className="flex items-center gap-1.5 border border-white/10 rounded-lg p-1 bg-surface/20">
      <button
        onClick={() => setLang('en')}
        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
          lang === 'en'
            ? 'bg-primary text-bg shadow-sm shadow-primary/20'
            : 'text-text/40 hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang('es')}
        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
          lang === 'es'
            ? 'bg-primary text-bg shadow-sm shadow-primary/20'
            : 'text-text/40 hover:text-white'
        }`}
      >
        ES
      </button>
    </div>
  )
}
