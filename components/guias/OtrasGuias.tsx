// Cross-link entre las 4 guías técnicas SEO. Las guías formaban un clúster de
// contenido pero no se enlazaban entre sí (páginas semi-huérfanas). Este bloque
// se renderiza en GuiaTemplate y en la página de precios, excluyendo la actual.
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const GUIAS_NAV = [
  {
    path: '/precios-estructuras-metalicas',
    titulo: 'Precios de estructuras metálicas',
    descripcion: 'Rangos reales por kg instalado y qué hace variar el costo.',
  },
  {
    path: '/estructura-metalica-vs-concreto',
    titulo: 'Estructura metálica vs concreto',
    descripcion: 'Comparación real de costo, tiempo de obra y mantenimiento.',
  },
  {
    path: '/tipos-de-estructuras-metalicas',
    titulo: 'Tipos de estructuras metálicas',
    descripcion: 'Pórticos, cerchas, entrepisos y cuándo conviene cada uno.',
  },
  {
    path: '/peso-estructura-metalica-por-m2',
    titulo: 'Peso por m² de una estructura metálica',
    descripcion: 'Rangos orientativos de kg/m² según el tipo de obra.',
  },
  {
    path: '/granallado-y-pintura-estructuras-metalicas',
    titulo: 'Granallado y pintura',
    descripcion: 'Preparación de superficie, sistemas de pintura y control de calidad.',
  },
  {
    path: '/precio-cubierta-metalica-por-m2',
    titulo: 'Precio de cubierta metálica por m²',
    descripcion: 'Cómo pasar de kg a m² y los rangos reales de una cubierta instalada.',
  },
  {
    path: '/como-se-construye-un-puente-metalico',
    titulo: 'Cómo se construye un puente metálico',
    descripcion: 'El proceso paso a paso, con el video real del montaje del Puente Cascada.',
  },
  {
    path: '/como-elegir-empresa-de-estructuras-metalicas',
    titulo: 'Cómo elegir empresa de estructuras metálicas',
    descripcion: 'Los 7 criterios, las señales de alarma y las preguntas antes de firmar.',
  },
]

export function OtrasGuias({ currentPath }: { currentPath: string }) {
  const otras = GUIAS_NAV.filter((g) => g.path !== currentPath)
  if (otras.length === 0) return null
  return (
    <section className="pb-20 md:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="mb-10 md:mb-12 max-w-4xl">
          <p className="text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
            Más guías técnicas
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas uppercase leading-[0.95] text-slate-950">
            Siga aprendiendo
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-200 border border-slate-200">
          {otras.map((g) => (
            <Link
              key={g.path}
              href={g.path}
              className="group bg-white p-8 md:p-10 flex flex-col"
            >
              <p className="text-slate-400 font-lato font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-3">
                Guía
              </p>
              <h3 className="text-2xl md:text-3xl font-bebas uppercase leading-[0.95] text-slate-950 mb-3">
                {g.titulo}
              </h3>
              <p className="text-slate-600 font-lato text-sm md:text-base leading-relaxed mb-6">
                {g.descripcion}
              </p>
              <span className="mt-auto inline-flex items-center gap-2 text-slate-950 font-lato font-bold text-sm uppercase tracking-wider">
                Leer guía
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
