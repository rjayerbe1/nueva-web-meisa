'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
interface Cliente {
  id: string
  nombre: string
  logo?: string | null
  logoBlanco?: string | null
  sector: string
  mostrarEnHome: boolean
  destacado: boolean
  orden: number
  activo: boolean
}

export interface ClientesCopy {
  eyebrow?: string | null
  titulo?: string | null
  descripcion?: string | null
  ctaTexto?: string | null
  ctaUrl?: string | null
}

interface ClientesSectionProps {
  copy?: ClientesCopy | null
  foundingYear?: number
}

export function ClientesSection({ copy, foundingYear = 1996 }: ClientesSectionProps = {}) {
  const yearsExperience = new Date().getFullYear() - foundingYear
  const eyebrow = copy?.eyebrow || 'Nuestros clientes'
  const titulo =
    copy?.titulo || `Confianza construida\ndurante ${yearsExperience}+ años`
  const tituloLineas = titulo.split('\n')
  const descripcion =
    copy?.descripcion ||
    'Empresas líderes en infraestructura, minería y construcción confían en MEISA para sus proyectos estructurales más exigentes.'
  const ctaTexto = copy?.ctaTexto || 'Conoce nuestra trayectoria'
  const ctaUrl = copy?.ctaUrl || '/trayectoria'

  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/clientes?mostrarEnHome=true&activo=true')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setClientes(Array.isArray(data) ? data : []))
      .catch(() => setClientes([]))
      .finally(() => setLoading(false))
  }, [])

  const logoClientes = clientes
    .filter((c) => c.logo || c.logoBlanco)
    .sort((a, b) => a.orden - b.orden)

  return (
    <section id="clientes" className="relative bg-slate-950 text-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 max-w-4xl"
        >
          <p className="text-white/40 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
            {eyebrow}
          </p>
          {tituloLineas.map((linea, i) => (
            <h2
              key={i}
              className={`text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95] ${
                i > 0 ? 'text-white/40' : ''
              }`}
            >
              {linea}
            </h2>
          ))}
          <p className="mt-6 text-white/60 font-lato text-base md:text-lg max-w-2xl leading-relaxed">
            {descripcion}
          </p>
        </motion.div>

        {loading ? (
          <div className="h-40 flex items-center text-white/40 font-lato text-sm">
            Cargando clientes…
          </div>
        ) : logoClientes.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-1.5 md:gap-2">
            {logoClientes.map((cliente, i) => {
              const logoSrc = cliente.logo || cliente.logoBlanco
              if (!logoSrc) return null
              return (
                <motion.div
                  key={cliente.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: (i % 7) * 0.04 }}
                  className="bg-white aspect-[2/1] flex items-center justify-center p-2.5 md:p-3.5 transition-transform duration-300 hover:-translate-y-0.5"
                  title={cliente.nombre}
                >
                  <Image
                    src={logoSrc}
                    alt={cliente.nombre}
                    width={200}
                    height={100}
                    className="object-contain"
                    style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '100%' }}
                  />
                </motion.div>
              )
            })}
          </div>
        ) : null}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 md:mt-16"
        >
          <Link
            href={ctaUrl}
            className="group inline-flex items-center gap-3 text-white font-lato font-bold text-base md:text-lg"
          >
            <span className="relative">
              {ctaTexto}
              <span className="absolute left-0 -bottom-0.5 h-px w-full bg-white/40 transition-colors duration-300 group-hover:bg-white" />
            </span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
