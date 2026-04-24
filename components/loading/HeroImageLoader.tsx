'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface HeroImageLoaderProps {
  isVisible: boolean
  progress: number // 0-100
}

export function HeroImageLoader({ isVisible, progress }: HeroImageLoaderProps) {
  // Calcular el dashoffset para la barra circular
  const radius = 90
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] bg-white flex items-center justify-center"
        >
          <div className="flex flex-col items-center justify-center gap-6">
            {/* Círculo con logo */}
            <div className="relative flex items-center justify-center w-[280px] h-[280px]">
              {/* SVG de progreso circular - Centrado absoluto */}
              <svg
                className="absolute inset-0"
                width="280"
                height="280"
                style={{ transform: 'rotate(-90deg)' }}
              >
                {/* Círculo de fondo */}
                <circle
                  cx="140"
                  cy="140"
                  r={radius}
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />

                {/* Círculo de progreso */}
                <motion.circle
                  cx="140"
                  cy="140"
                  r={radius}
                  fill="none"
                  stroke="#1e40af"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </svg>

              {/* Contenedor del logo - Centrado perfecto */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Logo con pulso suave */}
                <motion.div
                  animate={{
                    scale: [1, 1.03, 1]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="flex items-center justify-center"
                >
                  <Image
                    src="https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa.png"
                    alt="MEISA"
                    width={160}
                    height={45}
                    priority
                    unoptimized
                    className="object-contain"
                  />
                </motion.div>
              </div>
            </div>

            {/* Porcentaje de carga - FUERA del círculo, debajo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-blue-700 font-lato font-bold text-xl tracking-wider"
            >
              {Math.round(progress)}%
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
