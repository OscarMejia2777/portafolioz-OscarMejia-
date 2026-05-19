import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export type TranslationMap = Record<string, string>
export type AllTranslations = Record<string, TranslationMap>

export function useTranslations() {
  const [all, setAll] = useState<AllTranslations>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const { data } = await supabase.from('translations').select('key, value, language_code')
        if (data) {
          const grouped: AllTranslations = {}
          for (const row of data as { key: string; value: string; language_code: string }[]) {
            if (!grouped[row.language_code]) grouped[row.language_code] = {}
            grouped[row.language_code][row.key] = row.value
          }
          setAll(grouped)
        }
      } catch (err) {
        console.error('Error fetching translations:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTranslations()

    const channel = supabase
      .channel('translations_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'translations' }, () => {
        fetchTranslations()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { all, loading }
}
