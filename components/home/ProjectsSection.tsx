"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Building2, MapPin, Calendar, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

const projects = [
  {
    id: 1,
    title: 'Centro Comercial Campanario',
    category: 'Centros Comerciales',
    location: 'Popayán, Cauca',
    year: '2023',
    description: 'Estructura metálica para centro comercial de 45,000 m² con diseño innovador y sostenible.',
    image: '/projects/campanario.jpg',
    stats: {
      area: '45,000 m²',
      steel: '2,500 ton',
      duration: '8 meses'
    }
  },
  {
    id: 2,
    title: 'Torre Empresarial Bogotá',
    category: 'Edificios',
    location: 'Bogotá, Colombia',
    year: '2023',
    description: 'Edificio de oficinas de 25 pisos con estructura metálica antisísmica de última generación.',
    image: '/projects/torre-bogota.jpg',
    stats: {
      area: '35,000 m²',
      steel: '3,200 ton',
      duration: '12 meses'
    }
  },
  {
    id: 3,
    title: 'Puente Río Magdalena',
    category: 'Puentes',
    location: 'Barrancabermeja, Santander',
    year: '2022',
    description: 'Puente vehicular de 350 metros de longitud sobre el río Magdalena.',
    image: '/projects/puente-magdalena.jpg',
    stats: {
      area: '350 m',
      steel: '1,800 ton',
      duration: '10 meses'
    }
  },
  {
    id: 4,
    title: 'Planta Industrial Nestlé',
    category: 'Industrial',
    location: 'Medellín, Antioquia',
    year: '2022',
    description: 'Estructura metálica para nueva planta de producción con tecnología de punta.',
    image: '/projects/planta-nestle.jpg',
    stats: {
      area: '28,000 m²',
      steel: '2,100 ton',
      duration: '6 meses'
    }
  }
]

const categories = ['Todos', 'Centros Comerciales', 'Edificios', 'Puentes', 'Industrial']

export function ProjectsSection() {
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [currentIndex, setCurrentIndex] = useState(0)

  const filteredProjects = selectedCategory === 'Todos' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory)

  const nextProject = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === filteredProjects.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevProject = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? filteredProjects.length - 1 : prevIndex - 1
    )
  }

  return (
    <section id="proyectos" className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Proyectos Destacados
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Nuestra experiencia se refleja en cada proyecto que realizamos
          </p>
        </div>

        {/* Category Filter */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category)
                setCurrentIndex(0)
              }}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Carousel */}
        <div className="mt-16 relative">
          <div className="overflow-hidden rounded-2xl">
            <div className="relative h-[600px] bg-gray-100">
              {filteredProjects.map((project, index) => (
                <div
                  key={project.id}
                  className={`absolute inset-0 transition-all duration-500 ${
                    index === currentIndex 
                      ? 'opacity-100 translate-x-0' 
                      : index < currentIndex 
                        ? 'opacity-0 -translate-x-full' 
                        : 'opacity-0 translate-x-full'
                  }`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                    {/* Image */}
                    <div className="relative h-full bg-gradient-to-br from-blue-500 to-blue-600">
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Building2 className="w-32 h-32 text-white/30" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 lg:p-12 flex flex-col justify-center bg-white">
                      <span className="text-sm font-medium text-blue-600">
                        {project.category}
                      </span>
                      <h3 className="mt-2 text-3xl font-bold text-gray-900">
                        {project.title}
                      </h3>
                      <p className="mt-4 text-gray-600">
                        {project.description}
                      </p>

                      <div className="mt-6 space-y-3">
                        <div className="flex items-center text-gray-500">
                          <MapPin className="w-5 h-5 mr-2" />
                          <span>{project.location}</span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Calendar className="w-5 h-5 mr-2" />
                          <span>{project.year}</span>
                        </div>
                      </div>

                      <div className="mt-8 grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{project.stats.area}</p>
                          <p className="text-sm text-gray-600">Área</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{project.stats.steel}</p>
                          <p className="text-sm text-gray-600">Acero</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{project.stats.duration}</p>
                          <p className="text-sm text-gray-600">Duración</p>
                        </div>
                      </div>

                      <Link
                        href="#contacto"
                        className="mt-8 inline-flex items-center text-blue-600 font-medium hover:text-blue-700"
                      >
                        Ver detalles del proyecto
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevProject}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={nextProject}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {filteredProjects.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'w-8 bg-blue-600' 
                    : 'bg-gray-400 hover:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/proyectos"
            className="inline-flex items-center px-8 py-3 border-2 border-blue-600 text-base font-medium rounded-md text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
          >
            Ver todos los proyectos
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}