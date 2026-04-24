'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export type LoadingVariant = 'fade-scale' | 'spinner' | 'metallic' | 'pulse-glow' | 'fade-glow'

interface LoadingScreenProps {
  isVisible: boolean
  variant?: LoadingVariant
  onComplete?: () => void
}

export function LoadingScreen({
  isVisible,
  variant = 'fade-scale',
  onComplete
}: LoadingScreenProps) {
  return (
    <AnimatePresence mode="wait" onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-white flex items-center justify-center"
        >
          {variant === 'fade-scale' && <FadeScaleVariant />}
          {variant === 'spinner' && <SpinnerVariant />}
          {variant === 'metallic' && <MetallicVariant />}
          {variant === 'pulse-glow' && <PulseGlowVariant />}
          {variant === 'fade-glow' && <FadeGlowVariant />}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Variante 1: Fade in/out suave con escala elegante
function FadeScaleVariant() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 10 }}
      animate={{
        opacity: 1,
        scale: [0.85, 1, 1, 1],
        y: [10, 0, 0, 0]
      }}
      transition={{
        duration: 1.2,
        times: [0, 0.4, 0.7, 1],
        ease: "easeOut"
      }}
      className="relative"
    >
      <motion.div
        animate={{
          scale: [1, 1.02, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Image
          src="https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa.png"
          alt="MEISA"
          width={300}
          height={85}
          priority
          unoptimized
        />
      </motion.div>

      {/* Línea decorativa debajo */}
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: '100%', opacity: 1 }}
        transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
        className="h-0.5 bg-gradient-to-r from-transparent via-blue-700 to-transparent mt-6"
      />
    </motion.div>
  )
}

// Variante 2: Spinner circular girando alrededor del logo
function SpinnerVariant() {
  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10"
      >
        <Image
          src="https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa.png"
          alt="MEISA"
          width={240}
          height={68}
          priority
          unoptimized
        />
      </motion.div>

      {/* Spinner circular */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ width: 320, height: 320, left: '50%', top: '50%', marginLeft: -160, marginTop: -160 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
          className="w-full h-full"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="70 200"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e40af" stopOpacity="1" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#1e40af" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </motion.div>
    </div>
  )
}

// Variante 3: Efecto de construcción metálica (líneas ensamblándose)
function MetallicVariant() {
  return (
    <div className="relative">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="relative z-10"
      >
        <Image
          src="https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa.png"
          alt="MEISA"
          width={240}
          height={68}
          priority
          unoptimized
        />
      </motion.div>

      {/* Contenedor de efectos estructurales */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ width: 400, height: 400, left: '50%', top: '50%', marginLeft: -200, marginTop: -200 }}>
        <svg viewBox="0 0 400 400" className="w-full h-full">
          {/* Marco exterior que se dibuja */}
          <motion.rect
            x="50"
            y="50"
            width="300"
            height="300"
            fill="none"
            stroke="#1e40af"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />

          {/* Líneas estructurales horizontales */}
          <motion.line
            x1="50"
            y1="200"
            x2="350"
            y2="200"
            stroke="#3b82f6"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          />

          {/* Líneas estructurales verticales */}
          <motion.line
            x1="200"
            y1="50"
            x2="200"
            y2="350"
            stroke="#3b82f6"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          />

          {/* Líneas diagonales (vigas estructurales) */}
          <motion.line
            x1="50"
            y1="50"
            x2="350"
            y2="350"
            stroke="#dc2626"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
          <motion.line
            x1="350"
            y1="50"
            x2="50"
            y2="350"
            stroke="#dc2626"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          />

          {/* Puntos de conexión (tornillos/uniones) */}
          {[
            [50, 50], [350, 50], [50, 350], [350, 350],
            [200, 50], [200, 350], [50, 200], [350, 200]
          ].map(([x, y], i) => (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill="#1e40af"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.6 }}
              transition={{ delay: 0.8 + i * 0.05, duration: 0.3 }}
            />
          ))}

          {/* Cuadrados internos decorativos */}
          <motion.rect
            x="120"
            y="120"
            width="60"
            height="60"
            fill="none"
            stroke="#1e40af"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.2 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          />
          <motion.rect
            x="220"
            y="220"
            width="60"
            height="60"
            fill="none"
            stroke="#1e40af"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.2 }}
            transition={{ delay: 0.75, duration: 0.5 }}
          />
        </svg>
      </div>
    </div>
  )
}

// Variante 4: Pulso y glow brillante
function PulseGlowVariant() {
  return (
    <div className="relative">
      {/* Glow de fondo pulsante */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 blur-3xl bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
        style={{ width: 400, height: 400, left: '50%', top: '50%', marginLeft: -200, marginTop: -200 }}
      />

      {/* Logo con animación de aparición */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <Image
          src="https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa.png"
          alt="MEISA"
          width={240}
          height={68}
          priority
          unoptimized
          className="drop-shadow-2xl"
        />
      </motion.div>

      {/* Anillos pulsantes */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border-2 border-blue-500"
          style={{
            width: 280 + i * 40,
            height: 280 + i * 40,
            left: '50%',
            top: '50%',
            marginLeft: -(140 + i * 20),
            marginTop: -(140 + i * 20)
          }}
          animate={{
            scale: [1, 1.2],
            opacity: [0.6, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Partículas brillantes */}
      {[...Array(8)].map((_, i) => {
        const angle = (i * 360) / 8
        const radius = 150
        const x = Math.cos((angle * Math.PI) / 180) * radius
        const y = Math.sin((angle * Math.PI) / 180) * radius

        return (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full"
            style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        )
      })}
    </div>
  )
}

// Variante 5: Fade Glow - Mezcla elegante entre fade-scale y pulse-glow
function FadeGlowVariant() {
  return (
    <div className="relative flex flex-col items-center">
      {/* Logo con animación fade-scale elegante */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0, 1, 1, 1],
          scale: [0.8, 1, 1, 1.02]
        }}
        transition={{
          duration: 2,
          times: [0, 0.3, 0.7, 1],
          ease: "easeInOut"
        }}
        className="relative z-10 mb-8"
      >
        <Image
          src="https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa.png"
          alt="MEISA"
          width={240}
          height={68}
          priority
          unoptimized
          className="drop-shadow-xl"
        />
      </motion.div>

      {/* Línea decorativa debajo del logo */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '240px' }}
        transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
        className="h-0.5 bg-gradient-to-r from-transparent via-blue-600 to-transparent mb-6"
      />

      {/* Contenedor del efecto de pulso DEBAJO del logo */}
      <div className="relative" style={{ width: 240, height: 80 }}>
        {/* Glow de fondo pulsante - DEBAJO del logo */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute blur-2xl bg-gradient-to-r from-blue-500 to-blue-300 rounded-full"
          style={{
            width: 200,
            height: 60,
            left: '50%',
            top: '20%',
            marginLeft: -100
          }}
        />

        {/* Anillos pulsantes horizontales - DEBAJO del logo */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-blue-400"
            style={{
              width: 180 + i * 40,
              height: 50 + i * 15,
              left: '50%',
              top: '30%',
              marginLeft: -(90 + i * 20),
            }}
            animate={{
              scale: [1, 1.15],
              opacity: [0.4, 0]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeOut"
            }}
          />
        ))}

        {/* Partículas brillantes en forma horizontal */}
        {[...Array(5)].map((_, i) => {
          const spacing = 50
          const x = (i - 2) * spacing

          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full"
              style={{ left: `calc(50% + ${x}px)`, top: '40%' }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.8, 0],
                y: [0, 10, 0]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
