"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ProjectCategory } from "@/lib/categories-config"
import Image from "next/image"

interface ProjectCategoryCardProps {
  category: ProjectCategory
  onCategorySelect: (categoryDbValue: string) => void
  delay?: number
}

export default function ProjectCategoryCard({ 
  category, 
  onCategorySelect, 
  delay = 0 
}: ProjectCategoryCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleClick = () => {
    onCategorySelect(category.dbValue)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="relative h-80 w-full perspective-1000 cursor-pointer group"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={handleClick}
    >
      {/* Flip Container */}
      <motion.div
        className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* Front Side - Image */}
        <div className="absolute inset-0 backface-hidden rounded-lg overflow-hidden shadow-lg">
          <div className="relative w-full h-full">
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/20" />
            
            {/* Category Icon */}
            <div className="absolute top-4 right-4 bg-white/90 rounded-full p-3 backdrop-blur-sm">
              <Image
                src={category.icon}
                alt={`${category.name} icon`}
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </div>
            
            {/* Category Name Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <h3 className="text-white text-xl font-bold">{category.name}</h3>
            </div>
          </div>
        </div>

        {/* Back Side - Description */}
        <div 
          className="absolute inset-0 backface-hidden rounded-lg shadow-lg rotate-y-180 flex flex-col justify-center items-center p-6 text-center text-white"
          style={{ backgroundColor: category.backgroundColor }}
        >
          <div className="mb-4">
            <Image
              src={category.icon}
              alt={`${category.name} icon`}
              width={48}
              height={48}
              className="w-12 h-12 mx-auto mb-4 filter brightness-0 invert"
            />
          </div>
          
          <h3 className="text-xl font-bold mb-4">{category.name}</h3>
          
          <p className="text-sm leading-relaxed mb-6 opacity-90">
            {category.description}
          </p>
          
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200">
            Ver Proyectos
          </button>
        </div>
      </motion.div>
      
      {/* Hover Effect Ring */}
      <div className="absolute inset-0 rounded-lg ring-2 ring-transparent group-hover:ring-blue-400 transition-all duration-300 pointer-events-none" />
    </motion.div>
  )
}