"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowDown, Play } from "lucide-react"
import Image from "next/image"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.25, 0, 1]
    }
  }
}

const titleVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.2,
      ease: [0.25, 0.25, 0, 1]
    }
  }
}

export function HeroSection() {
  const scrollToProjects = () => {
    document.getElementById("proyectos")?.scrollIntoView({ 
      behavior: "smooth" 
    })
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 opacity-80" />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-orange-900/20" />

      {/* Animated Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-10 left-10 w-64 h-64 border-4 border-white/10 rotate-45"
          animate={{
            rotate: [45, 90, 45],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-48 h-48 border-4 border-orange-500/20"
          animate={{
            rotate: [0, -360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto px-6"
        >
          <motion.div variants={titleVariants} className="mb-8">
            <h1 className="text-7xl md:text-8xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
                MEISA
              </span>
            </h1>
            <h2 className="text-2xl md:text-3xl text-gray-300 font-light tracking-wide">
              Metálicas e Ingeniería S.A.
            </h2>
          </motion.div>

          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Construyendo el futuro con estructuras metálicas de vanguardia. 
            Innovación, calidad y excelencia en cada proyecto.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Button 
              size="xl" 
              variant="meisa"
              onClick={scrollToProjects}
              className="group relative overflow-hidden"
            >
              <span className="relative z-10">Nuestros Proyectos</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.3 }}
              />
            </Button>

            <Button 
              size="xl" 
              variant="meisa-outline"
              className="group"
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Ver Video
            </Button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-20"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="cursor-pointer"
              onClick={scrollToProjects}
            >
              <ArrowDown className="w-8 h-8 text-white/60 mx-auto" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Stats Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex gap-8 text-center text-white">
          <div className="px-6 py-4 bg-white/10 backdrop-blur-md rounded-lg">
            <div className="text-3xl font-bold text-orange-400">200+</div>
            <div className="text-sm text-gray-300">Proyectos</div>
          </div>
          <div className="px-6 py-4 bg-white/10 backdrop-blur-md rounded-lg">
            <div className="text-3xl font-bold text-blue-400">15+</div>
            <div className="text-sm text-gray-300">Años</div>
          </div>
          <div className="px-6 py-4 bg-white/10 backdrop-blur-md rounded-lg">
            <div className="text-3xl font-bold text-green-400">50+</div>
            <div className="text-sm text-gray-300">Clientes</div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}