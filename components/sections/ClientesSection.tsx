'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface Cliente {
  id: string
  nombre: string
  logo?: string | null
  logoBlanco?: string | null
  descripcion?: string | null
  sitioWeb?: string | null
  sector: string
  proyectoDestacado?: string | null
  capacidadProyecto?: string | null
  ubicacionProyecto?: string | null
  mostrarEnHome: boolean
  destacado: boolean
  orden: number
  activo: boolean
}


export function ClientesSection() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchClientes()
  }, [])

  const fetchClientes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/clientes?mostrarEnHome=true&activo=true')
      if (!response.ok) throw new Error('Error al cargar clientes')
      const data = await response.json()
      setClientes(data)
    } catch (err) {
      console.error('Error fetching clients:', err)
      setError('Error al cargar los clientes')
    } finally {
      setLoading(false)
    }
  }

  // Obtener clientes destacados con proyecto
  const clientesDestacados = clientes
    .filter(c => c.destacado && c.proyectoDestacado)
    .sort((a, b) => a.orden - b.orden)
    .slice(0, 4)

  if (loading) {
    return (
      <section id="clientes" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando clientes...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="clientes" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="clientes" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-blue-600 font-semibold text-lg mb-2">Nuestros Aliados</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Clientes
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800"> Destacados</span>
          </h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empresas líderes en Colombia confían en MEISA para sus proyectos más importantes
          </p>
        </motion.div>

        {/* Carrusel de logos automático */}
        {clientes.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 overflow-hidden"
          >
            <div className="flex space-x-16 animate-scroll">
              {/* Primera copia del array */}
              {clientes.filter(c => c.logo).map((cliente) => (
                <div
                  key={`logo-1-${cliente.id}`}
                  className="flex-shrink-0 w-40 h-20 flex items-center justify-center hover:opacity-80 transition-opacity duration-300"
                >
                  {cliente.logo ? (
                    <Image
                      src={cliente.logo}
                      alt={cliente.nombre}
                      width={120}
                      height={60}
                      className="object-contain max-w-full max-h-full filter grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  ) : (
                    <div className="text-gray-600 text-xs font-medium text-center">
                      {cliente.nombre.split(' ').map(word => word[0]).join('').slice(0, 3)}
                    </div>
                  )}
                </div>
              ))}
              {/* Segunda copia para efecto continuo */}
              {clientes.filter(c => c.logo).map((cliente) => (
                <div
                  key={`logo-2-${cliente.id}`}
                  className="flex-shrink-0 w-40 h-20 flex items-center justify-center hover:opacity-80 transition-opacity duration-300"
                >
                  {cliente.logo ? (
                    <Image
                      src={cliente.logo}
                      alt={cliente.nombre}
                      width={120}
                      height={60}
                      className="object-contain max-w-full max-h-full filter grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  ) : (
                    <div className="text-gray-600 text-xs font-medium text-center">
                      {cliente.nombre.split(' ').map(word => word[0]).join('').slice(0, 3)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Proyectos destacados con logos */}
        {clientesDestacados.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h4 className="text-2xl font-bold text-gray-900 text-center mb-8">Proyectos Destacados</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {clientesDestacados.map((cliente, index) => (
                <motion.div
                  key={cliente.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white rounded-lg p-2 flex items-center justify-center shadow-sm border border-gray-200">
                        {cliente.logo ? (
                          <Image
                            src={cliente.logo}
                            alt={cliente.nombre}
                            width={48}
                            height={48}
                            className="object-contain max-w-full max-h-full"
                          />
                        ) : (
                          <div className="text-gray-600 text-xs font-medium text-center">
                            {cliente.nombre.split(' ').map(word => word[0]).join('').slice(0, 2)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h5 className="text-lg font-semibold text-gray-900">{cliente.nombre}</h5>
                        <p className="text-blue-600 text-sm">{cliente.proyectoDestacado}</p>
                      </div>
                    </div>
                    {cliente.capacidadProyecto && (
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{cliente.capacidadProyecto}</p>
                        <p className="text-xs text-gray-500">de estructura</p>
                      </div>
                    )}
                  </div>
                  
                  {cliente.ubicacionProyecto && (
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <div className="w-4 h-4 rounded bg-blue-100 flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-600 rounded" />
                      </div>
                      {cliente.ubicacionProyecto}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Estadística final */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-50 to-gray-50 border border-gray-200 rounded-2xl p-8 text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-4xl font-bold text-blue-600 mb-2">{clientes.length}+</p>
              <p className="text-gray-600">Clientes activos en todo Colombia</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600 mb-2">9</p>
              <p className="text-gray-600">Sectores industriales atendidos</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600 mb-2">29+</p>
              <p className="text-gray-600">Años construyendo confianza</p>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}