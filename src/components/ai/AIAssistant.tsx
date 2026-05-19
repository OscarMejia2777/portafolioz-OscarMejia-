import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sendChatMessage } from '@/lib/gemini'
import { useLanguage } from '@/context/LanguageContext'

interface Message {
  role: 'user' | 'ai'
  text: string
}

export function AIAssistant() {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight)
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    const userMsg: Message = { role: 'user', text: input }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    const history = messages.map((m) => ({
      role: m.role === 'ai' ? 'model' as const : 'user' as const,
      text: m.text,
    }))
    const res = await sendChatMessage(input, history)
    setMessages((prev) => [...prev, { role: 'ai', text: res.text }])
    setIsLoading(false)
  }

  return (
    <>
      <motion.button
        className="fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full bg-primary text-bg flex items-center justify-center shadow-lg hover:shadow-primary/25"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('ai.toggle')}
      >
        <span className="material-symbols-outlined">{isOpen ? 'close' : 'smart_toy'}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            className="fixed bottom-24 right-6 z-[100] w-[360px] h-[500px] bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm text-bg">smart_toy</span>
                </div>
                <div>
                  <p className="font-medium text-white text-sm">{t('ai.title')}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-text/40">{t('ai.online')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center text-text/40 text-sm mt-8">
                  {t('ai.empty')}
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-primary text-bg rounded-br-sm'
                        : 'bg-bg text-text rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-bg px-4 py-3 rounded-xl rounded-bl-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-text/30 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-text/30 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-text/30 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-white/5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t('ai.placeholder')}
                  className="flex-1 px-3 py-2 bg-bg border border-white/5 rounded-lg text-sm text-white placeholder-text/30 focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="px-3 py-2 bg-primary text-bg rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  {t('ai.send')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
