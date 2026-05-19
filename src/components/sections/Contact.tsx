import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { sendContactEmail } from '@/lib/emailjs'
import type { FormEvent } from 'react'

export function Contact() {
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
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <SectionHeading
          label="Contact"
          title="Let's Work Together"
          subtitle="Have a project in mind? Let's discuss how we can build something great."
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
                placeholder="Name"
                className="w-full px-4 py-3 bg-surface border border-white/5 rounded-lg text-white placeholder-transparent focus:outline-none focus:border-primary/50 transition-colors peer"
              />
              <label
                htmlFor="name"
                className="absolute left-4 top-3 text-sm text-text/30 transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:text-primary peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-valid:-top-6 peer-valid:text-xs peer-valid:text-primary"
              >
                Name
              </label>
            </div>

            <div className="relative">
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
                className="w-full px-4 py-3 bg-surface border border-white/5 rounded-lg text-white placeholder-transparent focus:outline-none focus:border-primary/50 transition-colors peer"
              />
              <label
                htmlFor="email"
                className="absolute left-4 top-3 text-sm text-text/30 transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:text-primary peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-valid:-top-6 peer-valid:text-xs peer-valid:text-primary"
              >
                Email
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
              placeholder="Message"
              className="w-full px-4 py-3 bg-surface border border-white/5 rounded-lg text-white placeholder-transparent focus:outline-none focus:border-primary/50 transition-colors peer resize-none"
            />
            <label
              htmlFor="message"
              className="absolute left-4 top-3 text-sm text-text/30 transition-all peer-focus:-top-6 peer-focus:text-xs peer-focus:text-primary peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-valid:-top-6 peer-valid:text-xs peer-valid:text-primary"
            >
              Message
            </label>
          </div>

          <div className="text-center">
            <Button disabled={status === 'sending'}>
              {status === 'sending' ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-bg border-t-transparent rounded-full animate-spin" />
                  Sending...
                </span>
              ) : (
                'Send Message'
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
                Message sent successfully!
              </motion.p>
            )}
            {status === 'error' && (
              <motion.p
                className="text-center text-sm text-red-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                Failed to send. Try again later.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.form>
      </div>
    </section>
  )
}
