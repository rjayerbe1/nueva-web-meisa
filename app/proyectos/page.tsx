import { AnimatedSection } from "@/components/animations/AnimatedSection"
import { ProjectCard } from "@/components/animations/ProjectCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"

// Datos de ejemplo - en producción vendría de la API
const proyectos = [
  {
    id: "1",
    titulo: "Centro Comercial Unicentro",
    descripcion: "Diseño y construcción de estructura metálica para expansión del centro comercial más importante de la ciudad. 15,000 m² de estructura.",
    categoria: "CENTROS_COMERCIALES",
    estado: "COMPLETADO",
    cliente: "Grupo Unicentro",
    ubicacion: "Bogotá, Colombia",
    fechaInicio: new Date("2023-01-15"),
    presupuesto: 4500000000,
    slug: "centro-comercial-unicentro",
    destacado: true,
    imagenes: [{
      url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800",
      alt: "Centro Comercial Unicentro"
    }],
    progreso: [
      { porcentaje: 100, fase: "Planificación" },
      { porcentaje: 100, fase: "Diseño" },
      { porcentaje: 100, fase: "Fabricación" },
      { porcentaje: 100, fase: "Montaje" },
      { porcentaje: 100, fase: "Finalización" }
    ],
    _count: {
      imagenes: 25,
      documentos: 12
    }
  },
  {
    id: "2",
    titulo: "Puente Río Magdalena",
    descripcion: "Construcción de puente vehicular sobre el río Magdalena. Estructura de 450 metros de longitud con tecnología antisísmica.",
    categoria: "PUENTES",
    estado: "EN_PROGRESO",
    cliente: "INVIAS",
    ubicacion: "Barrancabermeja, Colombia",
    fechaInicio: new Date("2023-06-01"),
    presupuesto: 8500000000,
    slug: "puente-rio-magdalena",
    destacado: true,
    imagenes: [{
      url: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800",
      alt: "Puente Río Magdalena"
    }],
    progreso: [
      { porcentaje: 100, fase: "Planificación" },
      { porcentaje: 100, fase: "Diseño" },
      { porcentaje: 80, fase: "Fabricación" },
      { porcentaje: 60, fase: "Montaje" },
      { porcentaje: 0, fase: "Finalización" }
    ],
    _count: {
      imagenes: 32,
      documentos: 18
    }
  },
  {
    id: "3",
    titulo: "Torre Empresarial Colpatria",
    descripcion: "Reforzamiento estructural y ampliación de la Torre Colpatria. 42 pisos de estructura metálica de alta resistencia.",
    categoria: "EDIFICIOS",
    estado: "EN_PROGRESO",
    cliente: "Grupo Colpatria",
    ubicacion: "Bogotá, Colombia",
    fechaInicio: new Date("2023-09-01"),
    presupuesto: 6200000000,
    slug: "torre-empresarial-colpatria",
    destacado: false,
    imagenes: [{
      url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
      alt: "Torre Empresarial Colpatria"
    }],
    progreso: [
      { porcentaje: 100, fase: "Planificación" },
      { porcentaje: 90, fase: "Diseño" },
      { porcentaje: 50, fase: "Fabricación" },
      { porcentaje: 20, fase: "Montaje" },
      { porcentaje: 0, fase: "Finalización" }
    ],
    _count: {
      imagenes: 28,
      documentos: 15
    }
  },
  {
    id: "4",
    titulo: "Planta Industrial Ecopetrol",
    descripcion: "Construcción de nueva planta de refinación con estructuras especializadas para la industria petrolera. Certificación internacional.",
    categoria: "OIL_GAS",
    estado: "COMPLETADO",
    cliente: "Ecopetrol S.A.",
    ubicacion: "Cartagena, Colombia",
    fechaInicio: new Date("2022-03-01"),
    presupuesto: 12500000000,
    slug: "planta-industrial-ecopetrol",
    destacado: true,
    imagenes: [{
      url: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=800",
      alt: "Planta Industrial Ecopetrol"
    }],
    progreso: [
      { porcentaje: 100, fase: "Planificación" },
      { porcentaje: 100, fase: "Diseño" },
      { porcentaje: 100, fase: "Fabricación" },
      { porcentaje: 100, fase: "Montaje" },
      { porcentaje: 100, fase: "Finalización" }
    ],
    _count: {
      imagenes: 45,
      documentos: 28
    }
  },
  {
    id: "5",
    titulo: "Bodega Logística DHL",
    descripcion: "Diseño y construcción de centro de distribución logística de 25,000 m². Estructura optimizada para máxima eficiencia operativa.",
    categoria: "INDUSTRIAL",
    estado: "COMPLETADO",
    cliente: "DHL Express",
    ubicacion: "Tocancipá, Colombia",
    fechaInicio: new Date("2023-02-01"),
    presupuesto: 3800000000,
    slug: "bodega-logistica-dhl",
    destacado: false,
    imagenes: [{
      url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800",
      alt: "Bodega Logística DHL"
    }],
    progreso: [
      { porcentaje: 100, fase: "Planificación" },
      { porcentaje: 100, fase: "Diseño" },
      { porcentaje: 100, fase: "Fabricación" },
      { porcentaje: 100, fase: "Montaje" },
      { porcentaje: 100, fase: "Finalización" }
    ],
    _count: {
      imagenes: 22,
      documentos: 10
    }
  },
  {
    id: "6",
    titulo: "Conjunto Residencial Bosques",
    descripcion: "Estructuras metálicas para conjunto residencial de lujo. 6 torres de 20 pisos con diseño arquitectónico vanguardista.",
    categoria: "RESIDENCIAL",
    estado: "EN_PROGRESO",
    cliente: "Constructora Bolívar",
    ubicacion: "Medellín, Colombia",
    fechaInicio: new Date("2024-01-01"),
    presupuesto: 5600000000,
    slug: "conjunto-residencial-bosques",
    destacado: false,
    imagenes: [{
      url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      alt: "Conjunto Residencial Bosques"
    }],
    progreso: [
      { porcentaje: 100, fase: "Planificación" },
      { porcentaje: 80, fase: "Diseño" },
      { porcentaje: 40, fase: "Fabricación" },
      { porcentaje: 10, fase: "Montaje" },
      { porcentaje: 0, fase: "Finalización" }
    ],
    _count: {
      imagenes: 30,
      documentos: 14
    }
  }
]

const categorias = [
  { value: "TODOS", label: "Todos los proyectos" },
  { value: "CENTROS_COMERCIALES", label: "Centros Comerciales" },
  { value: "EDIFICIOS", label: "Edificios" },
  { value: "PUENTES", label: "Puentes" },
  { value: "OIL_GAS", label: "Oil & Gas" },
  { value: "INDUSTRIAL", label: "Industrial" },
  { value: "RESIDENCIAL", label: "Residencial" },
]

export default function ProyectosPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <AnimatedSection>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nuestros Proyectos
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Más de 200 proyectos exitosos en toda Colombia. Cada estructura es un testimonio
              de nuestra excelencia en ingeniería y compromiso con la calidad.
            </p>
          </div>
        </AnimatedSection>

        {/* Filtros */}
        <AnimatedSection delay={0.1}>
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {categorias.map((cat) => (
              <Button
                key={cat.value}
                variant={cat.value === "TODOS" ? "default" : "outline"}
                className="rounded-full"
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </AnimatedSection>

        {/* Grid de proyectos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {proyectos.map((proyecto, index) => (
            <AnimatedSection key={proyecto.id} delay={0.1 * (index % 3)}>
              <ProjectCard proyecto={proyecto} index={index} />
            </AnimatedSection>
          ))}
        </div>

        {/* CTA */}
        <AnimatedSection delay={0.5}>
          <div className="text-center mt-16">
            <p className="text-gray-600 mb-4">
              ¿Tienes un proyecto en mente?
            </p>
            <Button size="lg" variant="meisa">
              Conversemos sobre tu proyecto
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </main>
  )
}