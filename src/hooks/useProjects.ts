import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface ProjectRow {
  id: number
  slug: string
  title: string
  description: string
  tags: string[]
  image_url: string
  demo_url: string
  category_id: number
  sort_order: number
  language_code: string
  translation_group_id: string
  created_at: string
  updated_at: string
}

export function useProjects(lang: string) {
  const [projects, setProjects] = useState<ProjectRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await supabase
          .from('projects')
          .select('*')
          .eq('language_code', lang)
          .eq('is_published', true)
          .order('sort_order')
        
        if (data) setProjects(data as ProjectRow[])
      } catch (err) {
        console.error('Error fetching projects:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()

    const channel = supabase
      .channel('projects_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        fetchProjects()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [lang])

  return { projects, loading }
}
