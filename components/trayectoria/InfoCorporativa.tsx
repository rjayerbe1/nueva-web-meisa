"use client"

import { AnimatedSection } from '@/components/animations/AnimatedSection'
import { Target, Eye, Heart, ShieldCheck, Users, Zap, Flame, CheckCircle, GraduationCap } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface Config {
  resenaHistorica: string
  mision: string
  vision: string
  valores: any
}

interface Props {
  config: Config
}

const iconMap: Record<string, any> = {
  target: Target,
  'shield-check': ShieldCheck,
  users: Users,
  heart: Heart,
  zap: Zap,
  flame: Flame,
  'check-circle': CheckCircle,
  'graduation-cap': GraduationCap
}

export function InfoCorporativa({ config }: Props) {
  let valores = []
  try {
    valores = typeof config.valores === 'string' ? JSON.parse(config.valores) : config.valores
  } catch (e) {
    console.error('Error parsing valores:', e)
  }

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Reseña Histórica */}
        <AnimatedSection direction="up" className="mb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900 mb-8">
              Nuestra Historia
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-slate-700 leading-relaxed text-lg whitespace-pre-line">
                {config.resenaHistorica}
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Misión y Visión */}
        <div className="mb-20">
          <AnimatedSection direction="up" className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Misión & Visión
            </h2>
            <p className="text-xl text-slate-600">
              Los principios que guían nuestro camino
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <AnimatedSection direction="left" delay={0.2}>
              <Card className="h-full p-8 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-600 p-3 rounded-xl">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-blue-900">Misión</h3>
                </div>
                <p className="text-slate-700 leading-relaxed text-lg">
                  {config.mision}
                </p>
              </Card>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.2}>
              <Card className="h-full p-8 bg-gradient-to-br from-red-50 to-white border-2 border-red-200 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-red-600 p-3 rounded-xl">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-red-900">Visión</h3>
                </div>
                <p className="text-slate-700 leading-relaxed text-lg">
                  {config.vision}
                </p>
              </Card>
            </AnimatedSection>
          </div>
        </div>

        {/* Valores */}
        {valores.length > 0 && (
          <div>
            <AnimatedSection direction="up" className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Nuestros Valores
              </h2>
              <p className="text-xl text-slate-600">
                Los principios que definen nuestra forma de trabajar
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {valores.map((valor: any, index: number) => {
                const Icon = iconMap[valor.icono] || Target
                return (
                  <AnimatedSection
                    key={index}
                    direction="up"
                    delay={index * 0.05}
                  >
                    <Card className="p-6 h-full hover:shadow-lg transition-all hover:-translate-y-1 border-2 hover:border-blue-400">
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-blue-100 p-4 rounded-full mb-4">
                          <Icon className="w-8 h-8 text-blue-600" />
                        </div>
                        <h4 className="font-bold text-lg text-slate-900 mb-2">
                          {valor.nombre}
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {valor.descripcion}
                        </p>
                      </div>
                    </Card>
                  </AnimatedSection>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
