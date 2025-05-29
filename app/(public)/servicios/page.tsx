import { AnimatedSection } from "@/components/animations/AnimatedSection"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight } from "lucide-react"
import Image from "next/image"

const servicios = [
  {
    id: 1,
    titulo: "Diseño Estructural",
    descripcion: "Diseño integral de estructuras metálicas con los más altos estándares internacionales",
    imagen: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800",
    caracteristicas: [
      "Análisis estructural avanzado",
      "Modelado BIM 3D",
      "Cálculos sísmicos especializados",
      "Optimización de materiales",
      "Planos detallados de fabricación"
    ]
  },
  {
    id: 2,
    titulo: "Fabricación",
    descripcion: "Fabricación de estructuras metálicas con tecnología de punta y control de calidad riguroso",
    imagen: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800",
    caracteristicas: [
      "Corte CNC de alta precisión",
      "Soldadura certificada AWS",
      "Galvanizado y pintura industrial",
      "Control de calidad en cada etapa",
      "Trazabilidad completa"
    ]
  },
  {
    id: 3,
    titulo: "Montaje",
    descripcion: "Montaje profesional con equipos especializados y personal altamente calificado",
    imagen: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800",
    caracteristicas: [
      "Equipos de izaje especializados",
      "Personal certificado en alturas",
      "Supervisión técnica permanente",
      "Cumplimiento de cronogramas",
      "Seguridad industrial integral"
    ]
  },
  {
    id: 4,
    titulo: "Consultoría Técnica",
    descripcion: "Asesoría experta en todas las fases de su proyecto de estructuras metálicas",
    imagen: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
    caracteristicas: [
      "Estudios de factibilidad",
      "Optimización de diseños",
      "Revisión de proyectos",
      "Peritajes técnicos",
      "Capacitación especializada"
    ]
  }
]

const procesoTrabajo = [
  {
    paso: 1,
    titulo: "Análisis del Proyecto",
    descripcion: "Estudiamos sus necesidades y objetivos para proponer la mejor solución"
  },
  {
    paso: 2,
    titulo: "Diseño y Planificación",
    descripcion: "Desarrollamos el diseño estructural optimizado y planificamos cada detalle"
  },
  {
    paso: 3,
    titulo: "Fabricación",
    descripcion: "Fabricamos las estructuras con los más altos estándares de calidad"
  },
  {
    paso: 4,
    titulo: "Montaje y Entrega",
    descripcion: "Instalamos y entregamos su proyecto listo para operar"
  }
]

export default function ServiciosPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-meisa-blue to-meisa-orange">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Nuestros Servicios
              </h1>
              <p className="text-xl max-w-3xl mx-auto opacity-90">
                Soluciones integrales en estructuras metálicas desde el diseño hasta la entrega final,
                con más de 15 años de experiencia en el mercado colombiano.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Servicios Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {servicios.map((servicio, index) => (
              <AnimatedSection 
                key={servicio.id} 
                direction={index % 2 === 0 ? "left" : "right"}
                delay={index * 0.1}
              >
                <Card className="overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                  <div className="relative h-64">
                    <Image
                      src={servicio.imagen}
                      alt={servicio.titulo}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <h3 className="absolute bottom-4 left-6 text-2xl font-bold text-white">
                      {servicio.titulo}
                    </h3>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-gray-600 mb-6">{servicio.descripcion}</p>
                    <ul className="space-y-3">
                      {servicio.caracteristicas.map((caracteristica, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{caracteristica}</span>
                        </li>
                      ))}
                    </ul>
                    <Button variant="meisa" className="w-full mt-6">
                      Más información
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Proceso de Trabajo */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Nuestro Proceso de Trabajo
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Un proceso probado que garantiza resultados excepcionales en cada proyecto
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {procesoTrabajo.map((paso, index) => (
              <AnimatedSection key={paso.paso} delay={index * 0.1}>
                <div className="text-center">
                  <div className="w-20 h-20 bg-meisa-blue text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {paso.paso}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {paso.titulo}
                  </h3>
                  <p className="text-gray-600">{paso.descripcion}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-meisa-blue to-meisa-orange">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                ¿Listo para comenzar su proyecto?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Nuestro equipo de expertos está listo para ayudarle
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary">
                  Solicitar cotización
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-meisa-blue">
                  Agendar reunión
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  )
}