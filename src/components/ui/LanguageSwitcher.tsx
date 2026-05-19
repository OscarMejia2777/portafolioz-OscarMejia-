import { useLanguage } from '@/context/LanguageContext'

export function LanguageSwitcher() {
  const { language, toggleLanguage, t } = useLanguage()

  return (
    <div className="flex items-center gap-1.5 border border-white/10 rounded-lg p-1">
      <button
        onClick={() => language !== 'en' && toggleLanguage()}
        className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
          language === 'en'
            ? 'bg-primary/20 text-primary'
            : 'text-text/40 hover:text-text/60'
        }`}
        aria-label={t('lang.en')}
      >
        EN
      </button>
      <button
        onClick={() => language !== 'es' && toggleLanguage()}
        className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
          language === 'es'
            ? 'bg-primary/20 text-primary'
            : 'text-text/40 hover:text-text/60'
        }`}
        aria-label={t('lang.es')}
      >
        ES
      </button>
    </div>
  )
}
