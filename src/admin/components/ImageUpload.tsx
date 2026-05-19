import { useState, useRef, type ChangeEvent } from 'react'
import { supabase } from '@/lib/supabase'
import { HiOutlinePhoto, HiOutlineTrash, HiOutlineArrowPath } from 'react-icons/hi2'

interface ImageUploadProps {
  bucket?: string
  path?: string
  currentUrl?: string
  onUpload: (url: string) => void
  onRemove?: () => void
}

export default function ImageUpload({
  bucket = 'images',
  path = 'projects',
  currentUrl,
  onUpload,
  onRemove,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentUrl ?? '')

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}.${ext}`
    const filePath = `${path}/${fileName}`

    const { error } = await supabase.storage.from(bucket).upload(filePath, file)
    if (error) { setUploading(false); return }

    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath)
    setPreview(publicUrl)
    onUpload(publicUrl)
    setUploading(false)
  }

  const handleRemove = () => {
    setPreview('')
    onRemove?.()
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        {preview ? (
          <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-white/10 group">
            <img src={preview} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button type="button" onClick={() => inputRef.current?.click()} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
                <HiOutlineArrowPath className="w-4 h-4 text-white" />
              </button>
              <button type="button" onClick={handleRemove} className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors">
                <HiOutlineTrash className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-32 h-20 rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center hover:border-primary/50 transition-colors"
          >
            {uploading ? (
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <HiOutlinePhoto className="w-6 h-6 text-text/30" />
            )}
          </button>
        )}
        <div>
          <p className="text-sm text-white">Project Image</p>
          <p className="text-xs text-text/40">PNG, JPG, WebP (max 2MB)</p>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  )
}
