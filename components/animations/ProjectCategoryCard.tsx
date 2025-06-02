"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { getCategoryIconComponent } from '@/lib/get-category-icon'

interface Categoria {
  id: string
  key: string
  nombre: string
  descripcion: string | null
  slug: string
  imagenCover: string | null
  icono: string | null
  color: string | null
  colorSecundario: string | null
  overlayColor: string | null
  overlayOpacity: number | null
  visible: boolean
  destacada: boolean
}

interface ProjectCategoryCardProps {
  category: Categoria
  onCategorySelect?: (categoryKey: string) => void
  delay?: number
  projectCount?: number
}


export default function ProjectCategoryCard({ 
  category, 
  onCategorySelect, 
  delay = 0,
  projectCount = 0
}: ProjectCategoryCardProps) {

  const handleClick = () => {
    if (onCategorySelect) {
      onCategorySelect(category.key)
    }
  }

  return (
    <Link href={`/proyectos/categoria/${category.slug}`} className="group">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
        className="relative h-80 w-full cursor-pointer"
      >
      <div className="relative h-full rounded-2xl overflow-hidden shadow-xl transition-all duration-500 group-hover:shadow-2xl group-hover:scale-105">
        {/* Imagen de fondo */}
        {category.imagenCover ? (
          <>
            <img
              src={category.imagenCover}
              alt={`Cover de ${category.nombre}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Overlay personalizable para el ícono */}
            {category.overlayOpacity && category.overlayOpacity > 0 && (
              <div 
                className="absolute inset-0"
                style={{ 
                  backgroundColor: category.overlayColor || '#000000',
                  opacity: category.overlayOpacity
                }}
              />
            )}
            
            {/* Overlay oscuro para legibilidad del texto */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent group-hover:from-black/60 group-hover:via-black/20 transition-all duration-300 z-5" />
            
            {/* Ícono - se mueve con transform desde la misma posición base */}
            <div className="absolute top-0 left-0 right-0 bottom-20 flex items-center justify-center">
              <div 
                className="flex items-center justify-center opacity-80 transition-all duration-500 ease-out group-hover:opacity-100 transform group-hover:-translate-y-16 group-hover:scale-50"
                style={{ color: category.color || '#3b82f6' }}
              >
                {getCategoryIconComponent(category.icono, "w-32 h-32")}
              </div>
            </div>

            {/* Título siempre visible en la parte inferior */}
            <div className="absolute bottom-4 left-4 right-4 z-20">
              <h3 className="text-xl font-bold text-white drop-shadow-lg">
                {category.nombre}
              </h3>
            </div>

            {/* Información que aparece en el centro en hover */}
            <div className="absolute top-20 left-0 right-0 bottom-20 flex items-center justify-center p-6 text-white">
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out text-center bg-black/60 backdrop-blur-sm rounded-lg p-4 max-w-full">
                <p className="text-lg font-bold drop-shadow-lg mb-3 text-white">
                  {projectCount} proyecto{projectCount !== 1 ? 's' : ''}
                </p>
                <p className="text-sm text-white/90 drop-shadow-lg leading-relaxed" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {category.descripcion}
                </p>
              </div>
            </div>

            {/* Efecto hover overlay */}
            <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-all duration-300 z-10" />
            
            {/* Ring hover effect */}
            <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-blue-400/50 transition-all duration-300 pointer-events-none z-10" />
          </>
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <span className="text-white">Sin imagen</span>
          </div>
        )}
      </div>
      </motion.div>
    </Link>
  )
}