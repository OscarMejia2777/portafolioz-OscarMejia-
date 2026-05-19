import { motion } from 'framer-motion'

const SOCIALS = [
  { name: 'GitHub', icon: 'code', url: '#' },
  { name: 'LinkedIn', icon: 'work', url: '#' },
  { name: 'Twitter', icon: 'alternate_email', url: '#' },
]

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <span className="text-xl font-bold text-white">
              <span className="text-primary">&lt;</span> JD <span className="text-primary">/&gt;</span>
            </span>
            <p className="mt-2 text-sm text-text/40">Building digital experiences</p>
          </div>

          <div className="flex items-center gap-4">
            {SOCIALS.map((social) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-text/40 hover:text-primary hover:border-primary/30 border border-white/5 transition-all"
                whileHover={{ y: -3 }}
                aria-label={social.name}
              >
                <span className="material-symbols-outlined text-lg">{social.icon}</span>
              </motion.a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-sm text-text/30">
            &copy; {new Date().getFullYear()} JD. Built with React & Framer Motion.
          </p>
        </div>
      </div>
    </footer>
  )
}
