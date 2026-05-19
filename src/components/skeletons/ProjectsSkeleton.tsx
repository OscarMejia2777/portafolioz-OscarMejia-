import { motion } from 'framer-motion'

function Pulsing({ className }: { className?: string }) {
  return (
    <motion.div
      className={`rounded-md bg-white/10 ${className ?? ''}`}
      animate={{ opacity: [0.25, 0.55, 0.25] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

export function ProjectsSkeleton() {
  return (
    <section className="pt-4 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 space-y-3">
          <Pulsing className="h-4 w-24 mx-auto rounded-full" />
          <Pulsing className="h-8 w-64 mx-auto" />
          <Pulsing className="h-4 w-96 mx-auto max-w-full" />
        </div>

        <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
          {[1, 2, 3].map((i) => (
            <Pulsing key={i} className="h-9 w-20 rounded-lg" />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-surface/20 rounded-xl overflow-hidden">
              <Pulsing className="aspect-video w-full rounded-none" />
              <div className="p-5 space-y-3">
                <Pulsing className="h-5 w-3/4" />
                <Pulsing className="h-4 w-full" />
                <Pulsing className="h-4 w-5/6" />
                <div className="flex gap-2 pt-1">
                  <Pulsing className="h-6 w-16 rounded-full" />
                  <Pulsing className="h-6 w-20 rounded-full" />
                  <Pulsing className="h-6 w-14 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
