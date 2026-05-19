import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { HiOutlinePlus, HiOutlineTrash, HiOutlineCheck, HiOutlineXMark } from 'react-icons/hi2'
import ConfirmDialog from '@/admin/components/ConfirmDialog'

interface TranslationEntry {
  id: number
  key: string
  language_code: string
  value: string
}

export default function TranslationsPage() {
  const [items, setItems] = useState<TranslationEntry[]>([])
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState<number | null>(null)
  const [deleteKey, setDeleteKey] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('translations').select('*').order('key').then(({ data }) => {
      if (data) setItems(data as TranslationEntry[])
    })
  }, [])

  const update = async (id: number, value: string) => {
    setSaving(id)
    await supabase.from('translations').update({ value }).eq('id', id)
    setItems((prev) => prev.map((t) => t.id === id ? { ...t, value } : t))
    setSaving(null)
  }

  const handleDelete = async () => {
    if (!deleteKey) return
    await supabase.from('translations').delete().eq('key', deleteKey)
    setItems((prev) => prev.filter((t) => t.key !== deleteKey))
    setDeleteKey(null)
  }

  const addNew = async () => {
    const key = prompt('Enter translation key (e.g. \"section.subtitle\"):')
    if (!key) return
    const { data } = await supabase.from('translations').insert([
      { key, language_code: 'en', value: '' },
      { key, language_code: 'es', value: '' },
    ]).select()
    if (data) setItems((prev) => [...prev, ...(data as TranslationEntry[])])
  }

  const filtered = items.filter((t) => !search || t.key.toLowerCase().includes(search.toLowerCase()))
  const grouped = filtered.reduce<Record<string, { en?: TranslationEntry; es?: TranslationEntry }>>((acc, t) => {
    if (!acc[t.key]) acc[t.key] = {}
    acc[t.key][t.language_code as 'en' | 'es'] = t
    return acc
  }, {})

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Translations</h2>
        <div className="flex items-center gap-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search keys..." className="w-64 px-3 py-2 bg-surface/10 rounded-lg text-white border border-white/5 focus:outline-none focus:border-primary/50 text-sm" />
          <button onClick={addNew} className="flex items-center gap-2 px-4 py-2 bg-primary text-bg rounded-lg text-sm font-medium hover:brightness-110 transition-all">
            <HiOutlinePlus className="w-4 h-4" /> New Key
          </button>
        </div>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-16 text-text/30 text-sm">No translations found.</div>
      ) : (
        <div className="bg-surface/10 rounded-xl border border-white/5 overflow-hidden">
          <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 px-4 py-3 border-b border-white/5 text-xs text-text/40 font-medium">
            <span>Key</span><span>English</span><span>Spanish</span><span></span>
          </div>
          <div className="divide-y divide-white/5">
            {Object.entries(grouped).map(([key, { en, es }]) => (
              <div key={key} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 px-4 py-2 hover:bg-surface/10 transition-colors items-center">
                <div className="text-sm text-text/40 py-1.5 font-mono text-xs">{key}</div>
                <EditableCell value={en?.value ?? ''} onSave={(v) => en?.id && update(en.id, v)} saving={en?.id ? saving === en.id : false} />
                <EditableCell value={es?.value ?? ''} onSave={(v) => es?.id && update(es.id, v)} saving={es?.id ? saving === es.id : false} />
                <button onClick={() => setDeleteKey(key)} className="p-1.5 text-text/30 hover:text-red-400 transition-colors" title="Delete">
                  <HiOutlineTrash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteKey} title="Delete Translation" message={`Delete "${deleteKey}" and all its language versions?`} onConfirm={handleDelete} onCancel={() => setDeleteKey(null)} />
    </div>
  )
}

function EditableCell({ value, onSave, saving }: { value: string; onSave: (v: string) => void; saving: boolean }) {
  const [edit, setEdit] = useState(false)
  const [val, setVal] = useState(value)

  useEffect(() => { setVal(value) }, [value])

  const save = () => { onSave(val); setEdit(false) }
  const cancel = () => { setVal(value); setEdit(false) }

  if (edit) {
    return (
      <div className="flex items-center gap-1">
        <input value={val} onChange={(e) => setVal(e.target.value)} className="flex-1 px-2 py-1.5 bg-surface/20 rounded text-white text-sm border border-primary/30 focus:outline-none" autoFocus onKeyDown={(e) => e.key === 'Enter' && save()} />
        <button onClick={save} disabled={saving} className="text-green-400 hover:text-green-300 p-1 rounded hover:bg-green-400/10" title="Save">{saving ? <span className="text-xs">...</span> : <HiOutlineCheck className="w-4 h-4" />}</button>
        <button onClick={cancel} className="text-text/30 hover:text-white p-1 rounded hover:bg-white/5" title="Cancel"><HiOutlineXMark className="w-4 h-4" /></button>
      </div>
    )
  }

  return (
    <div className="text-sm text-white py-1.5 cursor-pointer hover:bg-surface/20 px-2 -mx-2 rounded transition-colors border border-transparent hover:border-white/10" onClick={() => setEdit(true)} title="Click to edit">
      {value || <span className="text-text/20 italic">empty</span>}
    </div>
  )
}
