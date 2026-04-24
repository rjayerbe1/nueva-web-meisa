'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Building, MapPin, Calendar, Weight, Ruler } from 'lucide-react'

interface RenderProps {
  contenido: any
  componentesData?: any
}

export function ComponentRenderer({ contenido, componentesData }: RenderProps) {
  // Si no hay contenido, mostrar placeholder
  if (!contenido || Object.keys(contenido).length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Esta página aún no tiene contenido configurado</p>
      </div>
    )
  }

  // Renderizar basado en el tipo de contenido
  const { type, ...props } = contenido

  switch (type) {
    case 'COVER_PAGE':
      return <CoverPageComponent {...props} />

    case 'PROJECT_GRID':
      return <ProjectGridComponent {...props} />

    case 'STATS_GRID':
      return <StatsGridComponent {...props} />

    case 'TEXT_BLOCK':
      return <TextBlockComponent {...props} />

    case 'CONTACT_INFO':
      return <ContactInfoComponent {...props} />

    case 'TIMELINE':
      return <TimelineComponent {...props} />

    case 'IMAGE_GALLERY':
      return <ImageGalleryComponent {...props} />

    case 'TECHNICAL_SPECS':
      return <TechnicalSpecsComponent {...props} />

    default:
      // Renderizado genérico para otros tipos
      return <GenericRenderer contenido={contenido} />
  }
}

// Componente de Portada
function CoverPageComponent(props: any) {
  const {
    title = 'PORTAFOLIO',
    subtitle = 'Proyectos Destacados',
    year = new Date().getFullYear(),
    logo = 'https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa.png',
    backgroundImage,
    backgroundColor = 'linear-gradient(135deg, #1e40af 0%, #dc2626 100%)'
  } = props

  return (
    <div
      className="relative w-full min-h-[600px] flex flex-col items-center justify-center text-white overflow-hidden"
      style={{ background: backgroundColor }}
    >
      {backgroundImage && (
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt="Background"
            fill
            className="object-cover opacity-30"
          />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center"
      >
        {logo && (
          <div className="mb-8">
            <Image
              src={logo}
              alt="MEISA"
              width={200}
              height={60}
              className="mx-auto brightness-0 invert"
            />
          </div>
        )}

        <h1 className="text-7xl font-black mb-4 uppercase tracking-tight">
          {title}
        </h1>

        <p className="text-2xl font-light mb-8">
          {subtitle}
        </p>

        <div className="text-4xl font-bold">
          {year}
        </div>
      </motion.div>

      {/* Decorative diagonal accent */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 transform rotate-45 translate-x-48 translate-y-48" />
    </div>
  )
}

// Grid de Proyectos
function ProjectGridComponent(props: any) {
  const {
    title = 'Proyectos Destacados',
    subtitle,
    projects = []
  } = props

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
        {subtitle && <p className="text-xl text-gray-600">{subtitle}</p>}
        <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-red-600 mx-auto mt-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project: any, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
          >
            {project.imagen && (
              <div className="relative h-64">
                <Image
                  src={project.imagen}
                  alt={project.titulo || 'Proyecto'}
                  fill
                  className="object-cover"
                />
                {project.año && (
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-md font-semibold">
                    {project.año}
                  </div>
                )}
              </div>
            )}

            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {project.titulo || 'Proyecto'}
              </h3>

              {project.ubicacion && (
                <p className="text-gray-600 flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4" />
                  {project.ubicacion}
                </p>
              )}

              <div className="space-y-2 border-t border-gray-200 pt-4">
                {project.area && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Ruler className="w-4 h-4" />
                      Área:
                    </span>
                    <span className="font-semibold text-blue-700">
                      {project.area.toLocaleString()} m²
                    </span>
                  </div>
                )}

                {project.peso && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Weight className="w-4 h-4" />
                      Peso:
                    </span>
                    <span className="font-semibold text-blue-700">
                      {project.peso} ton
                    </span>
                  </div>
                )}

                {project.cliente && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Cliente:
                    </span>
                    <span className="font-semibold text-gray-900">
                      {project.cliente}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          No hay proyectos configurados para mostrar
        </div>
      )}
    </div>
  )
}

// Grid de Estadísticas
function StatsGridComponent(props: any) {
  const { stats = [] } = props

  return (
    <div className="py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat: any, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center shadow-xl"
          >
            <div className="text-5xl font-black mb-3">
              {stat.value || '0'}
            </div>
            <div className="text-lg font-medium opacity-90">
              {stat.label || 'Estadística'}
            </div>
          </motion.div>
        ))}
      </div>

      {stats.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          No hay estadísticas configuradas
        </div>
      )}
    </div>
  )
}

// Bloque de Texto
function TextBlockComponent(props: any) {
  const { title, content, align = 'left' } = props

  return (
    <div className={`py-8 text-${align}`}>
      {title && (
        <h2 className="text-3xl font-bold text-gray-900 mb-6">{title}</h2>
      )}
      {content && (
        <div className="prose prose-lg max-w-none text-gray-700">
          <p>{content}</p>
        </div>
      )}
    </div>
  )
}

// Información de Contacto
function ContactInfoComponent(props: any) {
  const {
    title = 'Contáctenos',
    address,
    phone,
    email,
    website
  } = props

  return (
    <div className="py-12 bg-gray-50 rounded-xl">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-red-600 mx-auto" />
      </div>

      <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {address && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">Dirección</h3>
            <p className="text-gray-700">{address}</p>
          </div>
        )}

        {phone && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">Teléfono</h3>
            <p className="text-gray-700">{phone}</p>
          </div>
        )}

        {email && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
            <p className="text-gray-700">{email}</p>
          </div>
        )}

        {website && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">Sitio Web</h3>
            <p className="text-gray-700">{website}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Timeline
function TimelineComponent(props: any) {
  const { title = 'Cronología del Proyecto', events = [] } = props

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-red-600 mx-auto" />
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-300" />

        {/* Events */}
        <div className="space-y-12">
          {events.map((event: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`relative flex items-center ${
                index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {event.title || 'Evento'}
                </h3>
                {event.date && (
                  <p className="text-sm text-blue-600 font-semibold mb-2">
                    {event.date}
                  </p>
                )}
                {event.description && (
                  <p className="text-gray-700">{event.description}</p>
                )}
              </div>

              {/* Dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg" />

              <div className="w-5/12" />
            </motion.div>
          ))}
        </div>
      </div>

      {events.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          No hay eventos configurados en la línea de tiempo
        </div>
      )}
    </div>
  )
}

// Galería de Imágenes
function ImageGalleryComponent(props: any) {
  const { title, images = [], columns = 3 } = props

  return (
    <div className="py-12">
      {title && (
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-red-600 mx-auto" />
        </div>
      )}

      <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-6`}>
        {images.map((image: any, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow"
          >
            <div className="relative h-64">
              <Image
                src={image.url || image}
                alt={image.alt || `Imagen ${index + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white text-sm font-medium">{image.caption}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          No hay imágenes configuradas en la galería
        </div>
      )}
    </div>
  )
}

// Especificaciones Técnicas
function TechnicalSpecsComponent(props: any) {
  const { title = 'Especificaciones Técnicas', specs = [] } = props

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-red-600 mx-auto" />
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Especificación</th>
              <th className="px-6 py-4 text-left font-semibold">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {specs.map((spec: any, index: number) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {spec.label || spec.name}
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {spec.value}
                  {spec.unit && <span className="text-gray-500 ml-1">{spec.unit}</span>}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {specs.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          No hay especificaciones técnicas configuradas
        </div>
      )}
    </div>
  )
}

// Renderizador Genérico
function GenericRenderer({ contenido }: { contenido: any }) {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Contenido Personalizado
      </h3>
      <div className="bg-white rounded p-4 overflow-auto">
        <pre className="text-sm text-gray-700">
          {JSON.stringify(contenido, null, 2)}
        </pre>
      </div>
      <p className="text-sm text-gray-500 mt-4">
        Este tipo de contenido se renderizará cuando se implemente su componente específico.
      </p>
    </div>
  )
}
