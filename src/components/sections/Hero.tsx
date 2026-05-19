import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { FaLinkedin } from 'react-icons/fa6'
import { useLanguage } from '@/context/LanguageContext'

export function Hero() {
  const { t } = useLanguage()

  return (
    <section className="relative pt-12 pb-24">
      <div className="absolute inset-0 opacity-30">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]"
          animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px]"
          animate={{ x: [0, -30, 20, 0], y: [0, 30, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-400/5 rounded-full blur-[150px]"
          animate={{ scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-0 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="shrink-0">
            <div className="relative w-48 h-48 sm:w-72 sm:h-72 lg:w-80 lg:h-80">
              <motion.div
                className="absolute w-96 h-96 sm:w-[28rem] sm:h-[28rem] rounded-full opacity-15 blur-3xl"
                style={{
                  background: 'radial-gradient(circle, #fff 0%, #6366f1 40%, transparent 70%)',
                }}
                animate={{ x: [0, 30, -20, 15, 0], y: [0, -25, 20, -15, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: 'conic-gradient(from var(--angle), #fff, #6366f1, #06b6d4, #fff)',
                  }}
                  animate={{ '--angle': '360deg' } as any}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
                <div className="absolute inset-[2.5px] rounded-full bg-bg" />
              </div>
              <motion.div
                className="absolute w-72 h-72 sm:w-80 sm:h-80 lg:w-[22rem] lg:h-[22rem] rounded-full opacity-40 blur-2xl"
                style={{
                  background: 'conic-gradient(from var(--angle), #fff 0%, #6366f1 30%, transparent 70%)',
                  left: '50%',
                  top: '50%',
                  x: '-50%',
                  y: '-50%',
                }}
                animate={{ '--angle': '360deg', scale: [1, 1.15, 0.9, 1] } as any}
                transition={{
                  '--angle': { duration: 4, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
                }}
              />
              <img
                src="/profile.jpg"
                alt={t('hero.name')}
                className="absolute inset-[3px] rounded-full object-cover w-[calc(100%-6px)] h-[calc(100%-6px)]"
                onError={(e) => {
                  const target = e.currentTarget
                  target.style.display = 'none'
                  const parent = target.parentElement
                  if (parent) {
                    const fallback = document.createElement('div')
                    fallback.className = 'absolute inset-0 rounded-full bg-surface flex items-center justify-center'
                    fallback.innerHTML = '<span class="material-symbols-outlined text-6xl text-text/30">person</span>'
                    parent.appendChild(fallback)
                  }
                }}
              />
            </div>
          </div>

          <div className="text-center lg:text-left w-full lg:max-w-xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 leading-tight">
              {t('hero.greeting')}{' '}
              <motion.span
                className="bg-clip-text text-transparent inline-block"
                style={{
                  backgroundImage: 'conic-gradient(from var(--angle), #fff, #6366f1, #06b6d4, #fff)',
                }}
                animate={{ '--angle': '360deg' } as any}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              >
                {t('hero.name')}
              </motion.span>
            </h1>

            <p className="text-xl text-text/60 mb-2">
              {t('hero.role')}{' '}
              <a
                href="https://www.linkedin.com/company/jdkoutstandingtechnologies"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium hover:text-accent transition-colors"
              >
                JDK Outstanding Technologies
              </a>
            </p>

            <p className="text-base text-text/40 mb-8">
              {t('hero.description')}
            </p>

            <div className="flex items-center gap-3 flex-wrap justify-center lg:justify-start">
              <Button href="#projects">{t('hero.viewProjects')}</Button>
              <Button variant="outline" href="#contact">
                {t('hero.getInTouch')}
              </Button>
              <a
                href="https://www.linkedin.com/in/oscar-alexis-mejia-rodriguez/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-surface border border-white/10 flex items-center justify-center text-primary hover:bg-primary/10 hover:border-primary/30 transition-all"
                aria-label={t('hero.linkedin')}
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
