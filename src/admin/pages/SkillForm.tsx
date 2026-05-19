import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useForm } from 'react-hook-form'

interface FormData {
  name: string
  level: string
  experience: string
  icon: string
  description: string
  sort_order: number
}

export default function SkillForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const [lang, setLang] = useState<'en' | 'es'>('en')
  const [groupId, setGroupId] = useState<string | null>(null)
  const [currentId, setCurrentId] = useState<string | null>(id || null)

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormData>()

  const loadByGroupAndLang = async (gid: string, l: 'en' | 'es') => {
    const { data } = await supabase.from('skills').select('*').eq('translation_group_id', gid).eq('language_code', l).maybeSingle()
    if (data) {
      const s = data as any
      reset({
        name: s.name, level: s.level, experience: s.experience,
        icon: s.icon, description: s.description, sort_order: s.sort_order,
      })
      setCurrentId(s.id.toString())
    } else {
      setCurrentId(null)
    }
  }

  useEffect(() => {
    if (isEdit && id) {
      supabase.from('skills').select('*').eq('id', id).single().then(({ data }) => {
        if (data) {
          const s = data as any
          setGroupId(s.translation_group_id)
          setLang(s.language_code)
          reset({
            name: s.name, level: s.level, experience: s.experience,
            icon: s.icon, description: s.description, sort_order: s.sort_order,
          })
        }
      })
    }
  }, [id, isEdit])

  const switchLang = (l: 'en' | 'es') => {
    setLang(l)
    if (groupId) loadByGroupAndLang(groupId, l)
  }

  const onSubmit = async (data: FormData) => {
    let gid = groupId
    if (!gid) gid = crypto.randomUUID()

    const payload = {
      name: data.name,
      level: data.level,
      experience: data.experience,
      icon: data.icon,
      description: data.description,
      sort_order: data.sort_order,
      language_code: lang,
      translation_group_id: gid,
    }

    if (currentId) {
      await supabase.from('skills').update(payload).eq('id', currentId)
    } else {
      const { data: existing } = await supabase.from('skills').select('id').eq('translation_group_id', gid).eq('language_code', lang).maybeSingle()
      if (existing) {
        await supabase.from('skills').update(payload).eq('id', existing.id)
      } else {
        await supabase.from('skills').insert(payload)
      }
    }
    navigate('/admin/skills')
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-white mb-6">{isEdit ? 'Edit Skill' : 'New Skill'}</h2>

      <div className="flex items-center gap-2 mb-6 bg-surface/10 rounded-lg p-1 w-fit border border-white/5">
        <button onClick={() => switchLang('en')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${lang === 'en' ? 'bg-primary text-bg' : 'text-text/40 hover:text-white'}`}>English</button>
        <button onClick={() => switchLang('es')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${lang === 'es' ? 'bg-primary text-bg' : 'text-text/40 hover:text-white'}`}>Español</button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text/40 mb-1">Name</label>
            <input {...register('name', { required: true })} className="w-full px-3 py-2 bg-surface/10 rounded-lg text-white border border-white/5 focus:outline-none focus:border-primary/50 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-text/40 mb-1">Icon slug</label>
            <input {...register('icon', { required: true })} className="w-full px-3 py-2 bg-surface/10 rounded-lg text-white border border-white/5 focus:outline-none focus:border-primary/50 text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text/40 mb-1">Level ({lang.toUpperCase()})</label>
            <select {...register('level')} className="w-full px-3 py-2 bg-surface/10 rounded-lg text-white border border-white/5 focus:outline-none focus:border-primary/50 text-sm">
              <option value="Advanced">Advanced</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Beginner">Beginner</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-text/40 mb-1">Experience ({lang.toUpperCase()})</label>
            <input {...register('experience')} placeholder="3+ years" className="w-full px-3 py-2 bg-surface/10 rounded-lg text-white border border-white/5 focus:outline-none focus:border-primary/50 text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-sm text-text/40 mb-1">Description ({lang.toUpperCase()})</label>
          <textarea {...register('description')} rows={2} className="w-full px-3 py-2 bg-surface/10 rounded-lg text-white border border-white/5 focus:outline-none focus:border-primary/50 text-sm resize-none" />
        </div>

        <div>
          <label className="block text-sm text-text/40 mb-1">Sort Order</label>
          <input type="number" {...register('sort_order', { valueAsNumber: true })} className="w-full px-3 py-2 bg-surface/10 rounded-lg text-white border border-white/5 focus:outline-none focus:border-primary/50 text-sm" />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={() => navigate('/admin/skills')} className="px-4 py-2 text-sm text-text/50 hover:text-white transition-colors">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-bg rounded-lg text-sm font-medium hover:brightness-110 transition-all disabled:opacity-50">
            {isSubmitting ? 'Saving...' : `Save (${lang.toUpperCase()})`}
          </button>
        </div>
      </form>
    </div>
  )
}
