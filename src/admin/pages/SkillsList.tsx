import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import ConfirmDialog from '@/admin/components/ConfirmDialog'
import EmptyState from '@/admin/components/EmptyState'
import { HiOutlinePlus, HiOutlineTrash, HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2'

interface LangRow {
  id: number; level: string; sort_order: number; is_published: boolean
}

interface SkillGroup {
  translation_group_id: string
  name: string
  en: LangRow | null
  es: LangRow | null
}

export default function SkillsList() {
  const navigate = useNavigate()
  const [groups, setGroups] = useState<SkillGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('skills').select('id, name, level, sort_order, language_code, translation_group_id, is_published').order('sort_order')
    if (data) {
      const map = new Map<string, SkillGroup>()
      for (const row of data as any[]) {
        if (!map.has(row.translation_group_id)) {
          map.set(row.translation_group_id, { translation_group_id: row.translation_group_id, name: row.name, en: null, es: null })
        }
        const g = map.get(row.translation_group_id)!
        g[row.language_code as 'en' | 'es'] = { id: row.id, level: row.level, sort_order: row.sort_order, is_published: row.is_published }
      }
      setGroups(Array.from(map.values()))
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const togglePublish = async (id: number, current: boolean) => {
    await supabase.from('skills').update({ is_published: !current }).eq('id', id)
    load()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    await supabase.from('skills').delete().eq('id', deleteId)
    setDeleting(false)
    setDeleteId(null)
    load()
  }

  const LangCell = ({ lang, row }: { lang: string; row: LangRow | null }) => (
    <td className="px-4 py-3">
      <div className="flex items-center justify-center gap-2">
        {row ? (
          <>
            <button onClick={() => navigate(`/admin/skills/${row.id}/edit`)} className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full transition-all ${
              row.is_published
                ? 'text-green-400 bg-green-500/10 hover:brightness-110'
                : 'text-amber-400 bg-amber-500/10 hover:brightness-110'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${row.is_published ? 'bg-green-400' : 'bg-amber-400'}`} />
              {row.is_published ? `Edit ${lang}` : 'Draft'}
            </button>
            <button onClick={() => togglePublish(row.id, row.is_published)} className="p-1 text-text/30 hover:text-white transition-colors" title={row.is_published ? 'Unpublish' : 'Publish'}>
              {row.is_published ? <HiOutlineEye className="w-3.5 h-3.5" /> : <HiOutlineEyeSlash className="w-3.5 h-3.5" />}
            </button>
          </>
        ) : (
          <span className="text-xs text-text/30">—</span>
        )}
      </div>
    </td>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Skills</h2>
        <button onClick={() => navigate('/admin/skills/new')} className="flex items-center gap-2 px-4 py-2 bg-primary text-bg rounded-lg text-sm font-medium hover:brightness-110 transition-all">
          <HiOutlinePlus className="w-4 h-4" /> New Skill
        </button>
      </div>

      {groups.length === 0 && !loading ? (
        <EmptyState title="No skills yet" description="Add the technologies you work with." actionLabel="New Skill" onAction={() => navigate('/admin/skills/new')} />
      ) : (
        <div className="bg-surface/10 rounded-xl border border-white/5 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-text/40 text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-center px-4 py-3 font-medium">EN</th>
                <th className="text-center px-4 py-3 font-medium">ES</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <tr key={g.translation_group_id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{g.name}</td>
                  <LangCell lang="EN" row={g.en} />
                  <LangCell lang="ES" row={g.es} />
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setDeleteId(g.en?.id || g.es?.id || null)} className="p-1.5 text-text/30 hover:text-red-400 transition-colors" title="Delete">
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog open={!!deleteId} title="Delete Skill" message="This will delete only the selected language version." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
    </div>
  )
}
