'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Building, TrendingUp, Calendar, Award, Users, Factory, Wrench, ChevronRight, Play } from 'lucide-react'

// Datos de historia
const HISTORY_DATA = {
  founding: {
    year: 1996,
    city: 'Popayán, Cauca'
  },
  intro: 'Metálicas e Ingeniería S.A.S. fue constituida en 1996 en Popayán, especializándose en diseño, fabricación y montaje de estructuras metálicas.',
  timeline: [
    { year: '1996', title: 'Fundación', desc: 'Nace MEISA en Popayán' },
    { year: '2006', title: 'Expansión', desc: 'Nueva planta en Jamundí' },
    { year: '2011', title: 'Certificación', desc: 'Obtención del RUC' },
    { year: '2016', title: 'Crecimiento', desc: '+300 proyectos' },
    { year: '2024', title: 'Hoy', desc: 'Líder nacional' }
  ],
  stats: [
    { number: '29', label: 'Años', sublabel: 'de experiencia' },
    { number: '500+', label: 'Proyectos', sublabel: 'completados' },
    { number: '600', label: 'Ton/mes', sublabel: 'capacidad' },
    { number: '320+', label: 'Equipo', sublabel: 'colaboradores' }
  ]
}

export default function DemoHistoriaPage() {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Demo: Opciones de Presentación de Historia
          </h1>
          <p className="text-gray-600">
            Haz clic en cualquier opción para verla más grande. Elige la que más te guste.
          </p>
        </div>

        {/* Grid de opciones */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* OPCIÓN 1: Stats Grandes + Timeline Mínimo */}
          <OptionCard
            number={1}
            title="Stats Impactantes"
            description="Números grandes como protagonistas, timeline mínimo abajo"
            selected={selectedOption === 1}
            onClick={() => setSelectedOption(selectedOption === 1 ? null : 1)}
          >
            <div className="bg-white rounded-xl p-6">
              <p className="text-gray-600 text-center mb-6 text-sm">
                Desde 1996, construyendo el futuro de Colombia
              </p>

              {/* Stats grandes */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {HISTORY_DATA.stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-blue-600">{stat.number}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Timeline mínimo */}
              <div className="flex justify-between items-center border-t pt-4">
                {HISTORY_DATA.timeline.map((item, i) => (
                  <div key={i} className="text-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mx-auto mb-1"></div>
                    <div className="text-xs font-bold">{item.year}</div>
                  </div>
                ))}
              </div>
            </div>
          </OptionCard>

          {/* OPCIÓN 2: Timeline Horizontal con Cards */}
          <OptionCard
            number={2}
            title="Timeline con Cards"
            description="Línea de tiempo horizontal con tarjetas expandibles"
            selected={selectedOption === 2}
            onClick={() => setSelectedOption(selectedOption === 2 ? null : 2)}
          >
            <div className="bg-white rounded-xl p-6">
              <div className="relative">
                {/* Línea */}
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-blue-200"></div>

                {/* Items */}
                <div className="flex justify-between relative">
                  {HISTORY_DATA.timeline.map((item, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold z-10">
                        {i + 1}
                      </div>
                      <div className="mt-3 text-center">
                        <div className="text-xs font-bold text-blue-600">{item.year}</div>
                        <div className="text-xs text-gray-600">{item.title}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </OptionCard>

          {/* OPCIÓN 3: Contador Animado */}
          <OptionCard
            number={3}
            title="Contadores Animados"
            description="Números que animan al hacer scroll, muy visual"
            selected={selectedOption === 3}
            onClick={() => setSelectedOption(selectedOption === 3 ? null : 3)}
          >
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white">
              <h3 className="text-center text-lg font-bold mb-6">29 Años de Excelencia</h3>

              <div className="grid grid-cols-2 gap-4">
                {HISTORY_DATA.stats.map((stat, i) => (
                  <div key={i} className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold">{stat.number}</div>
                    <div className="text-sm text-blue-200">{stat.label}</div>
                    <div className="text-xs text-blue-300">{stat.sublabel}</div>
                  </div>
                ))}
              </div>
            </div>
          </OptionCard>

          {/* OPCIÓN 4: Una Sola Frase + Grid de Hitos */}
          <OptionCard
            number={4}
            title="Frase + Grid de Hitos"
            description="Una frase potente arriba, hitos en grid abajo"
            selected={selectedOption === 4}
            onClick={() => setSelectedOption(selectedOption === 4 ? null : 4)}
          >
            <div className="bg-white rounded-xl p-6">
              {/* Quote */}
              <div className="border-l-4 border-blue-600 pl-4 mb-6">
                <p className="text-gray-700 italic">
                  "Desde 1996 en Popayán, transformando acero en infraestructura para Colombia."
                </p>
              </div>

              {/* Grid 2x2 de hitos */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-blue-600 font-bold">1996</div>
                  <div className="text-xs text-gray-600">Fundación</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-blue-600 font-bold">2006</div>
                  <div className="text-xs text-gray-600">Expansión</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-blue-600 font-bold">500+</div>
                  <div className="text-xs text-gray-600">Proyectos</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-blue-600 font-bold">320+</div>
                  <div className="text-xs text-gray-600">Equipo</div>
                </div>
              </div>
            </div>
          </OptionCard>

          {/* OPCIÓN 5: Timeline Vertical Compacto */}
          <OptionCard
            number={5}
            title="Timeline Vertical Compacto"
            description="Lista vertical ordenada con años destacados"
            selected={selectedOption === 5}
            onClick={() => setSelectedOption(selectedOption === 5 ? null : 5)}
          >
            <div className="bg-white rounded-xl p-6">
              <div className="space-y-3">
                {HISTORY_DATA.timeline.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {item.year}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{item.title}</div>
                      <div className="text-xs text-gray-500">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </OptionCard>

          {/* OPCIÓN 6: Infografía Circular */}
          <OptionCard
            number={6}
            title="Infografía con Círculos"
            description="Estadísticas en círculos conectados visualmente"
            selected={selectedOption === 6}
            onClick={() => setSelectedOption(selectedOption === 6 ? null : 6)}
          >
            <div className="bg-white rounded-xl p-6">
              <div className="flex justify-center items-center gap-2">
                {HISTORY_DATA.stats.map((stat, i) => (
                  <div key={i} className="relative">
                    <div className={`w-16 h-16 rounded-full flex flex-col items-center justify-center ${
                      i === 0 ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
                    }`}>
                      <div className="text-sm font-bold">{stat.number}</div>
                      <div className="text-[8px]">{stat.label}</div>
                    </div>
                    {i < 3 && <div className="absolute top-1/2 -right-1 w-2 h-0.5 bg-blue-300"></div>}
                  </div>
                ))}
              </div>
              <p className="text-center text-xs text-gray-500 mt-4">
                Desde 1996 • Popayán, Cauca
              </p>
            </div>
          </OptionCard>

          {/* OPCIÓN 7: Cards con Iconos */}
          <OptionCard
            number={7}
            title="Cards con Iconos"
            description="Tarjetas elegantes con iconos representativos"
            selected={selectedOption === 7}
            onClick={() => setSelectedOption(selectedOption === 7 ? null : 7)}
          >
            <div className="bg-white rounded-xl p-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-gray-200 rounded-lg p-3 text-center">
                  <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <div className="text-xl font-bold text-gray-900">29</div>
                  <div className="text-xs text-gray-500">Años</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-3 text-center">
                  <Building className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <div className="text-xl font-bold text-gray-900">500+</div>
                  <div className="text-xs text-gray-500">Proyectos</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-3 text-center">
                  <Factory className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <div className="text-xl font-bold text-gray-900">600</div>
                  <div className="text-xs text-gray-500">Ton/mes</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-3 text-center">
                  <Users className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <div className="text-xl font-bold text-gray-900">320+</div>
                  <div className="text-xs text-gray-500">Equipo</div>
                </div>
              </div>
            </div>
          </OptionCard>

          {/* OPCIÓN 8: Banner Hero Style */}
          <OptionCard
            number={8}
            title="Banner Hero"
            description="Estilo banner con fondo degradado y stats"
            selected={selectedOption === 8}
            onClick={() => setSelectedOption(selectedOption === 8 ? null : 8)}
          >
            <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">1996</div>
                  <div className="text-sm text-gray-300">Año de fundación</div>
                  <div className="text-xs text-gray-400 mt-1">Popayán, Cauca</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">2024</div>
                  <div className="text-sm text-gray-300">29 años después</div>
                  <div className="text-xs text-gray-400 mt-1">Líder nacional</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-600 flex justify-between text-center">
                <div><div className="font-bold">500+</div><div className="text-xs text-gray-400">Proyectos</div></div>
                <div><div className="font-bold">3</div><div className="text-xs text-gray-400">Plantas</div></div>
                <div><div className="font-bold">320+</div><div className="text-xs text-gray-400">Equipo</div></div>
                <div><div className="font-bold">600t</div><div className="text-xs text-gray-400">Capacidad</div></div>
              </div>
            </div>
          </OptionCard>

          {/* OPCIÓN 9: Minimalista con Línea */}
          <OptionCard
            number={9}
            title="Minimalista"
            description="Diseño limpio, solo lo esencial con línea decorativa"
            selected={selectedOption === 9}
            onClick={() => setSelectedOption(selectedOption === 9 ? null : 9)}
          >
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl font-bold text-blue-600">29</div>
                <div className="h-12 w-px bg-gray-300"></div>
                <div>
                  <div className="text-sm text-gray-900 font-medium">Años de experiencia</div>
                  <div className="text-xs text-gray-500">Desde 1996 en Popayán</div>
                </div>
              </div>

              <div className="flex gap-6 text-center border-t pt-4">
                <div><div className="text-lg font-bold text-gray-900">500+</div><div className="text-xs text-gray-500">proyectos</div></div>
                <div><div className="text-lg font-bold text-gray-900">3</div><div className="text-xs text-gray-500">plantas</div></div>
                <div><div className="text-lg font-bold text-gray-900">320+</div><div className="text-xs text-gray-500">equipo</div></div>
                <div><div className="text-lg font-bold text-gray-900">600t</div><div className="text-xs text-gray-500">capacidad</div></div>
              </div>
            </div>
          </OptionCard>

          {/* OPCIÓN 10: Storytelling con Progresión */}
          <OptionCard
            number={10}
            title="Storytelling Visual"
            description="Cuenta la historia como una progresión visual"
            selected={selectedOption === 10}
            onClick={() => setSelectedOption(selectedOption === 10 ? null : 10)}
          >
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <div className="text-xs text-gray-500">Comenzamos</div>
                  <div className="text-xl font-bold text-blue-600">1996</div>
                </div>
                <div className="flex-1 mx-3">
                  <div className="h-2 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-600 rounded-full relative">
                    <div className="absolute -top-1 left-0 w-4 h-4 bg-blue-200 rounded-full"></div>
                    <div className="absolute -top-1 left-1/4 w-4 h-4 bg-blue-300 rounded-full"></div>
                    <div className="absolute -top-1 left-1/2 w-4 h-4 bg-blue-400 rounded-full"></div>
                    <div className="absolute -top-1 left-3/4 w-4 h-4 bg-blue-500 rounded-full"></div>
                    <div className="absolute -top-1 right-0 w-4 h-4 bg-blue-600 rounded-full"></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">Hoy somos</div>
                  <div className="text-xl font-bold text-blue-600">Líderes</div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-sm text-gray-700">
                  <span className="font-bold text-blue-600">500+ proyectos</span> •
                  <span className="font-bold text-blue-600"> 3 plantas</span> •
                  <span className="font-bold text-blue-600"> 320+ personas</span>
                </div>
              </div>
            </div>
          </OptionCard>

        </div>

        {/* Instrucciones */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <h3 className="font-bold text-yellow-800 mb-2">¿Cómo elegir?</h3>
          <p className="text-yellow-700 text-sm">
            Revisa cada opción. Puedes elegir una sola o combinar elementos de varias.
            Dime el número(s) que te gusten y lo implementamos.
          </p>
        </div>
      </div>
    </div>
  )
}

// Componente de tarjeta de opción
function OptionCard({
  number,
  title,
  description,
  selected,
  onClick,
  children
}: {
  number: number
  title: string
  description: string
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <motion.div
      layout
      className={`bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all ${
        selected ? 'ring-4 ring-blue-500 col-span-2' : 'hover:shadow-xl'
      }`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
            {number}
          </span>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        </div>
        <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${selected ? 'rotate-90' : ''}`} />
      </div>

      {/* Preview */}
      <div className={`p-4 ${selected ? 'scale-100' : 'scale-95'} transition-transform`}>
        {children}
      </div>
    </motion.div>
  )
}
