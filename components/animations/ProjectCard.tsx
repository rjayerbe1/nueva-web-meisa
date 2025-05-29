"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, User, ArrowRight, Clock } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Proyecto, ImagenProyecto, ProgresoProyecto } from "@prisma/client"

interface ProjectCardProps {
  proyecto: Proyecto & {
    imagenes: ImagenProyecto[]
    progreso: ProgresoProyecto[]
    _count: {
      imagenes: number
      documentos: number
    }
  }
  index: number
}

const categoryColors = {
  CENTROS_COMERCIALES: "bg-purple-100 text-purple-800",
  EDIFICIOS: "bg-blue-100 text-blue-800",
  PUENTES: "bg-green-100 text-green-800",
  OIL_GAS: "bg-yellow-100 text-yellow-800",
  INDUSTRIAL: "bg-red-100 text-red-800",
  RESIDENCIAL: "bg-pink-100 text-pink-800",
  INFRAESTRUCTURA: "bg-gray-100 text-gray-800",
  OTRO: "bg-indigo-100 text-indigo-800",
}

const statusColors = {
  PLANIFICACION: "bg-gray-100 text-gray-800",
  EN_PROGRESO: "bg-blue-100 text-blue-800",
  PAUSADO: "bg-yellow-100 text-yellow-800",
  COMPLETADO: "bg-green-100 text-green-800",
  CANCELADO: "bg-red-100 text-red-800",
}

export function ProjectCard({ proyecto, index }: ProjectCardProps) {
  const portadaImage = proyecto.imagenes[0]
  const progresoGeneral = Math.round(
    proyecto.progreso.reduce((sum, p) => sum + p.porcentaje, 0) / 
    Math.max(proyecto.progreso.length, 1)
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.25, 0, 1]
      }}
      className="group"
    >
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm">
        {/* Image Container */}
        <motion.div 
          className="relative h-64 overflow-hidden"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
        >
          {portadaImage ? (
            <Image
              src={portadaImage.url}
              alt={portadaImage.alt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-meisa-blue to-meisa-orange flex items-center justify-center">
              <div className="text-white text-6xl font-bold">
                {proyecto.titulo.charAt(0)}
              </div>
            </div>
          )}
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <Badge className={statusColors[proyecto.estado]}>
              {proyecto.estado.replace("_", " ")}
            </Badge>
          </div>

          {/* Progress Overlay */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progreso General</span>
              <span className="text-sm font-bold text-meisa-blue">{progresoGeneral}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-meisa-blue to-meisa-orange h-2 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: `${progresoGeneral}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </motion.div>
        </motion.div>

        <CardContent className="p-6">
          {/* Title and Category */}
          <div className="mb-4">
            <div className="flex justify-between items-start mb-2">
              <motion.h3 
                className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-meisa-blue transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                {proyecto.titulo}
              </motion.h3>
              {proyecto.destacado && (
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <Badge variant="destructive">Destacado</Badge>
                </motion.div>
              )}
            </div>
            
            <Badge className={categoryColors[proyecto.categoria]}>
              {proyecto.categoria.replace("_", " ")}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {proyecto.descripcion}
          </p>

          {/* Project Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-500">
              <User className="w-4 h-4 mr-2" />
              <span>{proyecto.cliente}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{proyecto.ubicacion}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{formatDate(proyecto.fechaInicio)}</span>
            </div>

            {proyecto.presupuesto && (
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-2" />
                <span className="font-semibold text-meisa-blue">
                  {formatCurrency(Number(proyecto.presupuesto))}
                </span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex justify-between items-center mb-4 text-xs text-gray-400">
            <span>{proyecto._count.imagenes} imágenes</span>
            <span>{proyecto._count.documentos} documentos</span>
          </div>

          {/* Action Button */}
          <Link href={`/proyectos/${proyecto.slug}`}>
            <Button 
              className="w-full group/btn"
              variant="meisa"
            >
              <span>Ver Proyecto</span>
              <motion.div
                className="ml-2"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  )
}