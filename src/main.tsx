import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/globals.css'
import { LanguageProvider } from '@/context/LanguageContext'
import { SettingsProvider } from '@/context/SettingsContext'
import { AuthProvider } from '@/hooks/useAuth'
import App from '@/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <LanguageProvider>
        <SettingsProvider>
          <App />
        </SettingsProvider>
      </LanguageProvider>
    </AuthProvider>
  </StrictMode>
)
