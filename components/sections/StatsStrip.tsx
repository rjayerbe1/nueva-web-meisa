'use client'

import { motion } from 'framer-motion'

export interface StatItem {
  value: string
  suffix?: string
  label: string
}

interface StatsStripProps {
  stats: StatItem[]
}

export function StatsStrip({ stats }: StatsStripProps) {
  if (stats.length === 0) return null
  return (
    <section
      aria-label="Cifras de MEISA"
      className="relative w-full bg-slate-950 text-white py-16 md:py-24 border-y border-white/10"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-3 md:grid-cols-4 gap-y-12 gap-x-3 sm:gap-x-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex flex-col md:border-l md:border-white/10 md:first:border-l-0 md:pl-6 lg:pl-10"
            >
              <div className="flex items-baseline gap-0.5 sm:gap-1">
                <span className="font-bebas text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none tracking-tight">
                  {stat.value}
                </span>
                {stat.suffix && (
                  <span className="font-bebas text-2xl sm:text-3xl md:text-4xl text-white/40 leading-none">
                    {stat.suffix}
                  </span>
                )}
              </div>
              <span className="mt-3 font-lato text-[10px] sm:text-[11px] md:text-xs uppercase tracking-[0.12em] sm:tracking-[0.2em] text-white/50">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
