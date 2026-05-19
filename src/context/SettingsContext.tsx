import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'

export interface SiteSettings {
  profile_image: string
  initials: string
  linkedin_personal: string
  linkedin_company: string
  jdk_link_text: string
}

const DEFAULT_SETTINGS: SiteSettings = {
  profile_image: '',
  initials: 'OM',
  linkedin_personal: '#',
  linkedin_company: '#',
  jdk_link_text: 'JDK Outstanding Technologies'
}

interface SettingsContextValue {
  settings: SiteSettings
  loading: boolean
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  loading: true
})

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  const fetchSettings = async () => {
    try {
      const { data } = await supabase.from('site_settings').select('key, value')
      if (data) {
        const mapped = { ...DEFAULT_SETTINGS }
        data.forEach((row) => {
          if (row.key === 'profile') mapped.profile_image = (row.value as any)?.image_url ?? ''
          if (row.key === 'initials') mapped.initials = (row.value as any)?.value ?? ''
          if (row.key === 'linkedin_personal') mapped.linkedin_personal = (row.value as any)?.value ?? ''
          if (row.key === 'linkedin_company') mapped.linkedin_company = (row.value as any)?.value ?? ''
          if (row.key === 'jdk_link_text') mapped.jdk_link_text = (row.value as any)?.value ?? ''
        })
        setSettings(mapped)
      }
    } catch (err) {
      console.error('Error fetching settings:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()

    const channel = supabase
      .channel('site_settings_global')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, () => {
        fetchSettings()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettingsContext = () => useContext(SettingsContext)
