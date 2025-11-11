"use client"

import { useEffect, useState } from 'react'
import { AnimatedSection } from '@/components/animations/AnimatedSection'
import { ChevronDown } from 'lucide-react'

interface Stats {
  totalProyectos: number
  totalToneladas: number
  valorTotalFormateado: string
  departamentos: number
  añosExperiencia: number
}

interface Props {
  stats: Stats | null
}

export function HeroTrayectoria({ stats }: Props) {
  const [count, setCount] = useState(0)
  const añosExperiencia = stats?.añosExperiencia || 29

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
    <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white overflow-hidden">
      {/* Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-6 py-20 md:py-32 relative z-10">
        <AnimatedSection direction="up" className="text-center">
          <div className="inline-block mb-6">
            <span className="text-blue-300 text-sm font-semibold tracking-wide uppercase">
              Desde 1996
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">Nuestra</span>{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-red-400">
              Trayectoria
            </span>
          </h1>

          <div className="text-6xl md:text-8xl font-bold mb-6">
            <span className="text-blue-300">{count}</span>{' '}
            <span className="text-white text-4xl md:text-5xl">años</span>
          </div>

          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Construyendo el futuro de Colombia con estructuras metálicas de excelencia
          </p>

          {/* Scroll Indicator */}
          <div className="flex justify-center">
            <div className="animate-bounce">
              <ChevronDown className="w-8 h-8 text-blue-300" />
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
