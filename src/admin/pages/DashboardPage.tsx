import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { HiOutlineBriefcase, HiOutlineCodeBracketSquare, HiOutlineAcademicCap, HiOutlineLanguage } from 'react-icons/hi2'

interface Stats {
  projects: number
  skills: number
  experiences: number
  translations: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ projects: 0, skills: 0, experiences: 0, translations: 0 })

  useEffect(() => {
    Promise.all([
      supabase.from('projects').select('translation_group_id'),
      supabase.from('skills').select('translation_group_id'),
      supabase.from('experiences').select('translation_group_id'),
      supabase.from('translations').select('id', { count: 'exact', head: true }),
    ]).then(([p, s, e, t]) => {
      const unique = (data: { translation_group_id: string }[] | null) =>
        new Set(data?.map(r => r.translation_group_id)).size
      setStats({
        projects: unique(p.data as any),
        skills: unique(s.data as any),
        experiences: unique(e.data as any),
        translations: t.count ?? 0,
      })
    })
  }, [])

  const cards = [
    { label: 'Projects', value: stats.projects, icon: HiOutlineBriefcase, color: 'text-blue-400 bg-blue-500/10' },
    { label: 'Skills', value: stats.skills, icon: HiOutlineCodeBracketSquare, color: 'text-green-400 bg-green-500/10' },
    { label: 'Experiences', value: stats.experiences, icon: HiOutlineAcademicCap, color: 'text-purple-400 bg-purple-500/10' },
    { label: 'Translations', value: stats.translations, icon: HiOutlineLanguage, color: 'text-amber-400 bg-amber-500/10' },
  ]

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-surface/20 rounded-xl p-5 border border-white/5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-text/40">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
