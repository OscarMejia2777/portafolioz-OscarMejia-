import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface SkillRow {
  id: number
  name: string
  level: string
  experience: string
  icon: string
  description: string
  sort_order: number
  language_code: string
  translation_group_id: string
}

export function useSkills(lang: string) {
  const [skills, setSkills] = useState<SkillRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data } = await supabase
          .from('skills')
          .select('*')
          .eq('language_code', lang)
          .eq('is_published', true)
          .order('sort_order')
        
        if (data) setSkills(data as SkillRow[])
      } catch (err) {
        console.error('Error fetching skills:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSkills()

    const channel = supabase
      .channel('skills_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'skills' }, () => {
        fetchSkills()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [lang])

  return { skills, loading }
}
