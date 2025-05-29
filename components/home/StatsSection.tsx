"use client"

import { useEffect, useState } from 'react'
import { Building2, Users, Trophy, Calendar } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'

const stats = [
  {
    id: 1,
    name: 'Proyectos Completados',
    value: siteConfig.estadisticas.proyectosCompletados,
    suffix: '+',
    icon: Building2,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    id: 2,
    name: 'Años de Experiencia',
    value: siteConfig.estadisticas.aniosExperiencia,
    suffix: '',
    icon: Calendar,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    id: 3,
    name: 'Toneladas/Mes',
    value: siteConfig.estadisticas.toneladas,
    suffix: '',
    icon: Users,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    id: 4,
    name: 'Colaboradores',
    value: siteConfig.estadisticas.empleados,
    suffix: '+',
    icon: Trophy,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
]

function CountUpAnimation({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTimestamp: number | null = null
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      
      setCount(Math.floor(progress * end))
      
      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }
    
    window.requestAnimationFrame(step)
  }, [end, duration])

  return <span>{count}{suffix}</span>
}

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById('stats-section')
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [])

  return (
    <section id="stats-section" className="bg-gradient-to-br from-gray-50 to-gray-100 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Números que hablan por nosotros
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Nuestro compromiso con la excelencia se refleja en cada proyecto
          </p>
        </div>

        <dl className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.id}
                className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <dt>
                  <div className={`absolute rounded-md ${stat.bgColor} p-3`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-sm font-medium text-gray-600">{stat.name}</p>
                </dt>
                <dd className="ml-16 mt-2 flex items-baseline">
                  <p className={`text-4xl font-semibold ${stat.color}`}>
                    {isVisible ? (
                      <CountUpAnimation end={stat.value} suffix={stat.suffix} />
                    ) : (
                      <span>0{stat.suffix}</span>
                    )}
                  </p>
                </dd>
                {/* Decorative element */}
                <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 opacity-20" />
              </div>
            )
          })}
        </dl>
      </div>
    </section>
  )
}