"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface Stats {
  totalProyectos: number
  totalToneladas: number
  departamentos: number
  añosExperiencia: number
}

interface Props {
  stats: Stats | null
}

export function HeroTrayectoria({ stats }: Props) {
  const añosExperiencia = stats?.añosExperiencia || 29
  const [count, setCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= añosExperiencia) {
          clearInterval(interval)
          return añosExperiencia
        }
        return prev + 1
      })
    }, 50)

    return () => clearInterval(interval)
  }, [añosExperiencia])

  return (
    <section className="relative bg-stone-50 overflow-hidden">
      {/* Split editorial: imagen a la izquierda, texto a la derecha */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 min-h-[70vh] lg:min-h-[85vh]">
        {/* Imagen (5/12) */}
        <div className="relative h-[50vh] lg:h-auto lg:col-span-5">
          <Image
            src="https://storage.googleapis.com/meisa-imagenes/site/proyectos/puente-destacado.jpg"
            alt="Puente metálico — Proyecto destacado MEISA"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 42vw"
            className="object-cover"
          />
        </div>

        {/* Texto (7/12) */}
        <div className="relative lg:col-span-7 flex items-center px-4 sm:px-6 lg:px-16 py-16 lg:py-24">
          <div className="w-full max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-5">
                Desde 1996 — Nuestra trayectoria
              </p>

              <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bebas uppercase leading-[0.9] text-slate-950">
                <span className="block">{count}</span>
                <span className="block text-slate-300">años</span>
              </h1>

              <p className="mt-6 lg:mt-8 text-base md:text-lg text-slate-700 leading-relaxed max-w-xl">
                Construyendo Colombia con estructuras metálicas de excelencia. Cada proyecto
                entregado es parte de una historia técnica que se escribe en acero.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats strip con divide-x */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="border-t border-slate-200"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-10 md:py-12">
            <div className="grid grid-cols-3 gap-6 md:divide-x md:divide-slate-200">
              <div className="md:pl-0 md:pr-6">
                <div className="font-bebas text-5xl md:text-6xl lg:text-7xl leading-none text-slate-950">
                  {stats.totalProyectos}
                  <span className="text-slate-300">+</span>
                </div>
                <p className="mt-2 text-slate-500 font-lato text-[10px] md:text-xs uppercase tracking-[0.2em]">
                  Proyectos entregados
                </p>
              </div>

              <div className="md:px-6">
                <div className="font-bebas text-5xl md:text-6xl lg:text-7xl leading-none text-slate-950">
                  +{Math.floor(stats.totalToneladas / 1000)}
                  <span className="text-slate-300">&nbsp;mil</span>
                </div>
                <p className="mt-2 text-slate-500 font-lato text-[10px] md:text-xs uppercase tracking-[0.2em]">
                  Toneladas de acero
                </p>
              </div>

              <div className="md:px-6">
                <div className="font-bebas text-5xl md:text-6xl lg:text-7xl leading-none text-slate-950">
                  {stats.departamentos}
                </div>
                <p className="mt-2 text-slate-500 font-lato text-[10px] md:text-xs uppercase tracking-[0.2em]">
                  Departamentos
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  )
}
