import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import ImageUpload from '@/admin/components/ImageUpload'
import { useForm } from 'react-hook-form'

interface FormData {
  title: string
  slug: string
  tags: string
  demo_url: string
  description: string
  category_id: number
  sort_order: number
}

export default function ProjectForm() {
  const { slug } = useParams()
  const isEdit = !!slug
  const navigate = useNavigate()
  const [lang, setLang] = useState<'en' | 'es'>('en')
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [groupId, setGroupId] = useState<string | null>(null)
  const [categories, setCategories] = useState<{ id: number; name_en: string }[]>([])

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormData>()

  useEffect(() => {
    supabase.from('categories').select('id, name_en').order('sort_order').then(({ data }) => {
      if (data) setCategories(data as any)
    })
  }, [])

  const loadForLang = (l: 'en' | 'es') => {
    if (isEdit && slug) {
      const querySlug = l === 'es' && !slug.endsWith('-es') ? `${slug}-es` : slug
      supabase.from('projects').select('*').eq('slug', querySlug).single().then(({ data }) => {
        if (data) {
          const p = data as any
          reset({
            title: p.title, slug: p.slug,
            tags: p.tags.join(', '),
            demo_url: p.demo_url,
            description: p.description,
            category_id: p.category_id,
            sort_order: p.sort_order,
          })
          setImageUrl(p.image_url ?? '')
          setGroupId(p.translation_group_id)
        } else {
          reset({ title: '', slug: `${slug.split('-es')[0]}-${l}`, tags: '', demo_url: '', description: '', category_id: 1, sort_order: 0 })
          setImageUrl('')
        }
      })
    }
  }

  useEffect(() => { loadForLang(lang) }, [lang, slug, isEdit])

  const switchLang = (l: 'en' | 'es') => {
    setLang(l)
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    let gid = groupId
    if (!gid) gid = crypto.randomUUID()

    const payload: any = {
      title: data.title,
      slug: data.slug || `${data.title.toLowerCase().replace(/\s+/g, '-')}-${lang}`,
      tags: data.tags.split(',').map((t) => t.trim()).filter(Boolean),
      image_url: imageUrl,
      demo_url: data.demo_url,
      description: data.description,
      category_id: data.category_id,
      sort_order: data.sort_order,
      language_code: lang,
      translation_group_id: gid,
    }

    const existing = await supabase.from('projects').select('id').eq('translation_group_id', gid).eq('language_code', lang).maybeSingle()
    if (existing.data) {
      await supabase.from('projects').update(payload).eq('id', existing.data.id)
    } else {
      await supabase.from('projects').insert(payload)
    }

    setLoading(false)
    navigate('/admin/projects')
  }

  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-bold text-white mb-6">{isEdit ? 'Edit Project' : 'New Project'}</h2>

      <div className="flex items-center gap-2 mb-6 bg-surface/10 rounded-lg p-1 w-fit border border-white/5">
        <button onClick={() => switchLang('en')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${lang === 'en' ? 'bg-primary text-bg' : 'text-text/40 hover:text-white'}`}>English</button>
        <button onClick={() => switchLang('es')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${lang === 'es' ? 'bg-primary text-bg' : 'text-text/40 hover:text-white'}`}>Español</button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text/40 mb-1">Title ({lang.toUpperCase()})</label>
            <input {...register('title', { required: true })} className="w-full px-3 py-2 bg-surface/10 rounded-lg text-white border border-white/5 focus:outline-none focus:border-primary/50 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-text/40 mb-1">Slug</label>
            <input {...register('slug')} className="w-full px-3 py-2 bg-surface/10 rounded-lg text-white border border-white/5 focus:outline-none focus:border-primary/50 text-sm" disabled={isEdit} />
          </div>
        </div>

        <div>
          <label className="block text-sm text-text/40 mb-1">Description ({lang.toUpperCase()})</label>
          <textarea {...register('description', { required: true })} rows={3} className="w-full px-3 py-2 bg-surface/10 rounded-lg text-white border border-white/5 focus:outline-none focus:border-primary/50 text-sm resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text/40 mb-1">Tags (comma separated)</label>
            <input {...register('tags')} placeholder="React, TypeScript, API" className="w-full px-3 py-2 bg-surface/10 rounded-lg text-white border border-white/5 focus:outline-none focus:border-primary/50 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-text/40 mb-1">Category</label>
            <select {...register('category_id', { required: true, valueAsNumber: true })} className="w-full px-3 py-2 bg-surface/10 rounded-lg text-white border border-white/5 focus:outline-none focus:border-primary/50 text-sm">
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name_en}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text/40 mb-1">Demo URL</label>
            <input {...register('demo_url')} className="w-full px-3 py-2 bg-surface/10 rounded-lg text-white border border-white/5 focus:outline-none focus:border-primary/50 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-text/40 mb-1">Sort Order</label>
            <input type="number" {...register('sort_order', { valueAsNumber: true })} className="w-full px-3 py-2 bg-surface/10 rounded-lg text-white border border-white/5 focus:outline-none focus:border-primary/50 text-sm" />
          </div>
        </div>

        <ImageUpload currentUrl={imageUrl} onUpload={setImageUrl} onRemove={() => setImageUrl('')} />

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={() => navigate('/admin/projects')} className="px-4 py-2 text-sm text-text/50 hover:text-white transition-colors">Cancel</button>
          <button type="submit" disabled={isSubmitting || loading} className="px-4 py-2 bg-primary text-bg rounded-lg text-sm font-medium hover:brightness-110 transition-all disabled:opacity-50">
            {isSubmitting || loading ? 'Saving...' : `Save (${lang.toUpperCase()})`}
          </button>
        </div>
      </form>
    </div>
  )
}
