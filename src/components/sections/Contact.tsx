import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { sendContactEmail } from '@/lib/emailjs'
import { useLanguage } from '@/context/LanguageContext'
import type { FormEvent } from 'react'

export function Contact() {
  const { t } = useLanguage()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    const ok = await sendContactEmail(form)
    setStatus(ok ? 'success' : 'error')
    if (ok) setForm({ name: '', email: '', message: '' })
    setTimeout(() => setStatus('idle'), 4000)
  }

  return (
    <section id="contact" className="pt-4 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <SectionHeading
          label={t('contact.label')}
          title={t('contact.title')}
          subtitle={t('contact.subtitle')}
        />

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={t('contact.name')}
                className="w-full px-4 py-3 bg-surface/10 backdrop-blur-sm rounded-lg text-white border border-white/5 placeholder-transparent focus:outline-none focus:bg-surface/20 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all peer"
              />
              <label
                htmlFor="name"
                className="absolute left-4 top-3 text-sm text-text/30 transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:text-primary peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-valid:-top-6 peer-valid:text-xs peer-valid:text-primary"
              >
                {t('contact.name')}
              </label>
            </div>

            <div className="relative">
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder={t('contact.email')}
                className="w-full px-4 py-3 bg-surface/10 backdrop-blur-sm rounded-lg text-white border border-white/5 placeholder-transparent focus:outline-none focus:bg-surface/20 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all peer"
              />
              <label
                htmlFor="email"
                className="absolute left-4 top-3 text-sm text-text/30 transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:text-primary peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-valid:-top-6 peer-valid:text-xs peer-valid:text-primary"
              >
                {t('contact.email')}
              </label>
            </div>
          </div>

          <div className="relative">
            <textarea
              id="message"
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder={t('contact.message')}
              className="w-full px-4 py-3 bg-surface/10 backdrop-blur-sm rounded-lg text-white border border-white/5 placeholder-transparent focus:outline-none focus:bg-surface/20 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all peer resize-none"
            />
            <label
              htmlFor="message"
              className="absolute left-4 top-3 text-sm text-text/30 transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:text-primary peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-valid:-top-6 peer-valid:text-xs peer-valid:text-primary"
            >
              {t('contact.message')}
            </label>
          </div>

          <div className="text-center">
            <Button disabled={status === 'sending'}>
              {status === 'sending' ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-bg border-t-transparent rounded-full animate-spin" />
                  {t('contact.sending')}
                </span>
              ) : (
                t('contact.send')
              )}
            </Button>
          </div>

          <AnimatePresence>
            {status === 'success' && (
              <motion.p
                className="text-center text-sm text-green-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {t('contact.success')}
              </motion.p>
            )}
            {status === 'error' && (
              <motion.p
                className="text-center text-sm text-red-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {t('contact.error')}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.form>
      </div>
    </section>
  )
}
