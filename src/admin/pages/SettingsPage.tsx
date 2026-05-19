import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import ImageUpload from '@/admin/components/ImageUpload'

export default function SettingsPage() {
  const [profileImage, setProfileImage] = useState('')
  const [initials, setInitials] = useState('')
  const [linkedinPersonal, setLinkedinPersonal] = useState('')
  const [linkedinCompany, setLinkedinCompany] = useState('')
  const [jdkLinkText, setJdkLinkText] = useState('')
  
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    supabase.from('site_settings').select('key, value').then(({ data }) => {
      if (data) {
        data.forEach(row => {
          if (row.key === 'profile') setProfileImage((row.value as any)?.image_url ?? '')
          if (row.key === 'initials') setInitials((row.value as any)?.value ?? '')
          if (row.key === 'linkedin_personal') setLinkedinPersonal((row.value as any)?.value ?? '')
          if (row.key === 'linkedin_company') setLinkedinCompany((row.value as any)?.value ?? '')
          if (row.key === 'jdk_link_text') setJdkLinkText((row.value as any)?.value ?? '')
        })
      }
    })
  }, [])

  const save = async () => {
    setSaving(true)
    const updates = [
      { key: 'profile', value: { image_url: profileImage } },
      { key: 'initials', value: { value: initials } },
      { key: 'linkedin_personal', value: { value: linkedinPersonal } },
      { key: 'linkedin_company', value: { value: linkedinCompany } },
      { key: 'jdk_link_text', value: { value: jdkLinkText } },
    ]

    await supabase.from('site_settings').upsert(updates, { onConflict: 'key' })
    
    setSaving(false)
    setMessage('Saved!')
    setTimeout(() => setMessage(''), 2000)
  }

  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-bold text-white mb-6">Site Settings</h2>

      <div className="bg-surface/10 rounded-xl border border-white/5 p-6 space-y-8">
        {/* Profile Image */}
        <section>
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">image</span>
            Profile Image
          </h3>
          <ImageUpload
            bucket="images"
            path="profile"
            currentUrl={profileImage}
            onUpload={setProfileImage}
            onRemove={() => setProfileImage('')}
          />
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
          {/* Logo Initials */}
          <div>
            <label className="block text-sm font-medium text-text/60 mb-2">Logo Initials</label>
            <input
              type="text"
              value={initials}
              onChange={(e) => setInitials(e.target.value)}
              placeholder="e.g. OM"
              className="w-full px-4 py-2 bg-bg border border-white/5 rounded-lg text-white placeholder-text/20 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* JDK Link Text */}
          <div>
            <label className="block text-sm font-medium text-text/60 mb-2">Company Name (JDK)</label>
            <input
              type="text"
              value={jdkLinkText}
              onChange={(e) => setJdkLinkText(e.target.value)}
              placeholder="Full company name"
              className="w-full px-4 py-2 bg-bg border border-white/5 rounded-lg text-white placeholder-text/20 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Social Links */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-sm font-medium text-white">Social Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-text/40 mb-1">LinkedIn Personal</label>
                <input
                  type="url"
                  value={linkedinPersonal}
                  onChange={(e) => setLinkedinPersonal(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-4 py-2 bg-bg border border-white/5 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="block text-xs text-text/40 mb-1">LinkedIn Company</label>
                <input
                  type="url"
                  value={linkedinCompany}
                  onChange={(e) => setLinkedinCompany(e.target.value)}
                  placeholder="https://linkedin.com/company/..."
                  className="w-full px-4 py-2 bg-bg border border-white/5 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-6 border-t border-white/5">
          <button onClick={save} disabled={saving} className="px-6 py-2 bg-primary text-bg rounded-lg text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-50">
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
          {message && <span className="text-sm text-green-400 font-medium">{message}</span>}
        </div>
      </div>
    </div>
  )
}
