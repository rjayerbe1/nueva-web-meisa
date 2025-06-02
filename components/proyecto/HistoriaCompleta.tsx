'use client'

import { motion } from 'framer-motion'
import { Award, Lightbulb, Target, TrendingUp, Users, Clock, CheckCircle, Quote } from 'lucide-react'

interface HistoriaProyecto {
  id: string
  tituloAlternativo: string | null
  resumenCorto: string | null
  contexto: string | null
  problemasIniciales: string | null
  desafios: any
  enfoque: string | null
  solucionTecnica: string | null
  innovaciones: any
  metodologia: string | null
  tiempoTotal: string | null
  resultados: any
  impactoCliente: string | null
  valorAgregado: string | null
  testimonioCliente: string | null
  testimonioEquipo: string | null
  dificultadTecnica: number | null
  innovacionNivel: number | null
  tagsTecnicos: any
  imagenDestacada: string | null
}

interface Props {
  historia: HistoriaProyecto
  proyecto: {
    titulo: string
    cliente: string
  }
}

export default function HistoriaCompleta({ historia, proyecto }: Props) {
  const desafios = Array.isArray(historia.desafios) ? historia.desafios : []
  const innovaciones = Array.isArray(historia.innovaciones) ? historia.innovaciones : []
  const resultados = Array.isArray(historia.resultados) ? historia.resultados : []
  const tagsTecnicos = Array.isArray(historia.tagsTecnicos) ? historia.tagsTecnicos : []

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Award className="w-4 h-4" />
            Historia de Éxito MEISA
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {historia.tituloAlternativo || `La Historia de ${proyecto.titulo}`}
          </h2>
          {historia.resumenCorto && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {historia.resumenCorto}
            </p>
          )}
        </motion.div>

        {/* Métricas Visuales */}
        {(historia.dificultadTecnica || historia.innovacionNivel) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
          >
            {historia.dificultadTecnica && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Complejidad Técnica</h3>
                    <p className="text-gray-600 text-sm">Nivel de dificultad del proyecto</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${(historia.dificultadTecnica / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-2xl font-bold text-red-600">
                    {historia.dificultadTecnica}/10
                  </span>
                </div>
              </div>
            )}

            {historia.innovacionNivel && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Nivel de Innovación</h3>
                    <p className="text-gray-600 text-sm">Innovación técnica aplicada</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${(historia.innovacionNivel / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    {historia.innovacionNivel}/10
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* La Historia en 3 Actos */}
        <div className="space-y-16">
          {/* 1. EL DESAFÍO */}
          {(historia.contexto || historia.problemasIniciales || desafios.length > 0) && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
            >
              <div className="flex items-start gap-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
                    <Target className="w-8 h-8 text-red-600" />
                  </div>
                  <div className="w-1 h-32 bg-red-200 mx-auto mt-4"></div>
                </div>
                
                <div className="flex-1">
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <span className="bg-red-100 text-red-600 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold">1</span>
                      El Desafío
                    </h3>
                    
                    {historia.contexto && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Contexto Inicial</h4>
                        <p className="text-gray-700 leading-relaxed">{historia.contexto}</p>
                      </div>
                    )}
                    
                    {historia.problemasIniciales && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Problemas a Resolver</h4>
                        <p className="text-gray-700 leading-relaxed">{historia.problemasIniciales}</p>
                      </div>
                    )}
                    
                    {desafios.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Desafíos Específicos</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {desafios.map((desafio: string, index: number) => (
                            <div key={index} className="flex items-center gap-2 bg-red-50 p-3 rounded-lg">
                              <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                              <span className="text-gray-800 text-sm">{desafio}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. LA SOLUCIÓN */}
          {(historia.enfoque || historia.solucionTecnica || innovaciones.length > 0) && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative"
            >
              <div className="flex items-start gap-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <Lightbulb className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="w-1 h-32 bg-blue-200 mx-auto mt-4"></div>
                </div>
                
                <div className="flex-1">
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold">2</span>
                      La Solución MEISA
                    </h3>
                    
                    {historia.enfoque && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Nuestro Enfoque</h4>
                        <p className="text-gray-700 leading-relaxed">{historia.enfoque}</p>
                      </div>
                    )}
                    
                    {historia.solucionTecnica && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Solución Técnica</h4>
                        <p className="text-gray-700 leading-relaxed">{historia.solucionTecnica}</p>
                      </div>
                    )}
                    
                    {innovaciones.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Innovaciones Aplicadas</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {innovaciones.map((innovacion: string, index: number) => (
                            <div key={index} className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg">
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                              <span className="text-gray-800 text-sm">{innovacion}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {historia.metodologia && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                          <Clock className="w-5 h-5 text-gray-600" />
                          <h4 className="font-semibold text-gray-900">Metodología</h4>
                          {historia.tiempoTotal && (
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-sm">
                              {historia.tiempoTotal}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 leading-relaxed">{historia.metodologia}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 3. EL RESULTADO */}
          {(resultados.length > 0 || historia.impactoCliente || historia.valorAgregado) && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="relative"
            >
              <div className="flex items-start gap-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <span className="bg-green-100 text-green-600 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold">3</span>
                      Los Resultados
                    </h3>
                    
                    {resultados.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Logros Específicos</h4>
                        <div className="space-y-2">
                          {resultados.map((resultado: string, index: number) => (
                            <div key={index} className="flex items-center gap-3 bg-green-50 p-3 rounded-lg">
                              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                              <span className="text-gray-800">{resultado}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {historia.impactoCliente && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Impacto para el Cliente</h4>
                        <p className="text-gray-700 leading-relaxed">{historia.impactoCliente}</p>
                      </div>
                    )}
                    
                    {historia.valorAgregado && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">El Valor MEISA</h4>
                        <p className="text-gray-700 leading-relaxed">{historia.valorAgregado}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Testimonios */}
        {(historia.testimonioCliente || historia.testimonioEquipo) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {historia.testimonioCliente && (
                <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Quote className="w-8 h-8 text-blue-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Testimonio del Cliente</h4>
                      <p className="text-blue-600 text-sm">{proyecto.cliente}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic leading-relaxed">"{historia.testimonioCliente}"</p>
                </div>
              )}
              
              {historia.testimonioEquipo && (
                <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-8 h-8 text-slate-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Testimonio del Equipo</h4>
                      <p className="text-slate-600 text-sm">Equipo MEISA</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic leading-relaxed">"{historia.testimonioEquipo}"</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Tags Técnicos */}
        {tagsTecnicos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-16 text-center"
          >
            <h4 className="font-semibold text-gray-900 mb-4">Especialidades Técnicas Aplicadas</h4>
            <div className="flex flex-wrap justify-center gap-3">
              {tagsTecnicos.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="bg-slate-700 text-white px-4 py-2 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}