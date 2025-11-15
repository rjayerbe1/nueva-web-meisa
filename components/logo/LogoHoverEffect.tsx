'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export type LogoHoverVariant = '3d-tilt' | 'magnetic' | 'glitch' | 'glow-scale' | 'parallax-3d'

interface LogoHoverEffectProps {
  variant?: LogoHoverVariant
  width?: number
  height?: number
  className?: string
}

export function LogoHoverEffect({
  variant = '3d-tilt',
  width = 300,
  height = 85,
  className = ''
}: LogoHoverEffectProps) {
  return (
    <div className={className}>
      {variant === '3d-tilt' && <TiltEffect width={width} height={height} />}
      {variant === 'magnetic' && <MagneticEffect width={width} height={height} />}
      {variant === 'glitch' && <GlitchEffect width={width} height={height} />}
      {variant === 'glow-scale' && <GlowScaleEffect width={width} height={height} />}
      {variant === 'parallax-3d' && <Parallax3DEffect width={width} height={height} />}
    </div>
  )
}

// Efecto 1: 3D Tilt - El logo se inclina siguiendo el mouse
function TiltEffect({ width, height }: { width: number; height: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), {
    stiffness: 300,
    damping: 20
  })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), {
    stiffness: 300,
    damping: 20
  })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) / rect.width)
    y.set((e.clientY - centerY) / rect.height)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        width,
        height
      }}
      className="relative flex items-center justify-center"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d'
        }}
        animate={{
          scale: isHovered ? 1.05 : 1
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <Image
          src="/images/logo/logo-meisa.png"
          alt="MEISA"
          width={width}
          height={height}
          unoptimized
          priority
          style={{
            transform: 'translateZ(50px)',
            filter: isHovered ? 'drop-shadow(0 8px 16px rgba(30, 64, 175, 0.08))' : 'none'
          }}
        />
      </motion.div>
    </div>
  )
}

// Efecto 2: Magnetic - El logo se atrae hacia el cursor
function MagneticEffect({ width, height }: { width: number; height: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { stiffness: 200, damping: 15 }
  const smoothX = useSpring(x, springConfig)
  const smoothY = useSpring(y, springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Calcula la distancia y la atracción magnética
    const distanceX = (e.clientX - centerX) * 0.3
    const distanceY = (e.clientY - centerY) * 0.3

    x.set(distanceX)
    y.set(distanceY)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ width, height }}
      className="relative flex items-center justify-center cursor-pointer"
    >
      <motion.div
        style={{
          x: smoothX,
          y: smoothY
        }}
        animate={{
          scale: isHovered ? 1.08 : 1
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <Image
          src="/images/logo/logo-meisa.png"
          alt="MEISA"
          width={width}
          height={height}
          unoptimized
          priority
          className="transition-all duration-300"
          style={{
            filter: isHovered ? 'drop-shadow(0 10px 30px rgba(30, 64, 175, 0.4))' : 'none'
          }}
        />
      </motion.div>

      {/* Efecto de campo magnético visual */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-full blur-2xl bg-blue-500/20"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </div>
  )
}

// Efecto 3: Glitch - Efecto de distorsión digital
function GlitchEffect({ width, height }: { width: number; height: number }) {
  const [isGlitching, setIsGlitching] = useState(false)

  const handleMouseEnter = () => {
    setIsGlitching(true)
  }

  const handleMouseLeave = () => {
    setIsGlitching(false)
  }

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ width, height }}
      className="relative flex items-center justify-center cursor-pointer overflow-hidden"
    >
      {/* Logo principal */}
      <motion.div
        className="relative z-10"
        animate={{
          scale: isGlitching ? 1.05 : 1
        }}
      >
        <Image
          src="/images/logo/logo-meisa.png"
          alt="MEISA"
          width={width}
          height={height}
          unoptimized
          priority
        />
      </motion.div>

      {/* Glitch layers - RGB split */}
      {isGlitching && (
        <>
          {/* Red channel */}
          <motion.div
            className="absolute inset-0 opacity-70 mix-blend-screen"
            animate={{
              x: [-2, 2, -1, 3, -2],
              y: [1, -1, 2, -2, 1]
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
            style={{ filter: 'brightness(1.2) hue-rotate(-20deg)' }}
          >
            <Image
              src="/images/logo/logo-meisa.png"
              alt=""
              width={width}
              height={height}
              unoptimized
              className="opacity-50"
            />
          </motion.div>

          {/* Blue channel */}
          <motion.div
            className="absolute inset-0 opacity-70 mix-blend-screen"
            animate={{
              x: [2, -2, 1, -3, 2],
              y: [-1, 1, -2, 2, -1]
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: 0.05
            }}
            style={{ filter: 'brightness(1.2) hue-rotate(180deg)' }}
          >
            <Image
              src="/images/logo/logo-meisa.png"
              alt=""
              width={width}
              height={height}
              unoptimized
              className="opacity-50"
            />
          </motion.div>

          {/* Scan lines */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.1) 2px, rgba(0, 0, 0, 0.1) 4px)'
            }}
            animate={{ y: [0, 10] }}
            transition={{
              duration: 0.1,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
          />
        </>
      )}
    </div>
  )
}

// Efecto 4: Glow + Scale - Brillo y escala premium
function GlowScaleEffect({ width, height }: { width: number; height: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ width, height }}
      className="relative flex items-center justify-center cursor-pointer"
    >
      {/* Glow dinámico que sigue al mouse */}
      {isHovered && (
        <motion.div
          className="absolute rounded-full blur-3xl"
          style={{
            width: 150,
            height: 150,
            left: mousePosition.x - 75,
            top: mousePosition.y - 75,
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, rgba(30, 64, 175, 0.3) 50%, transparent 70%)'
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Logo con escala y sombra */}
      <motion.div
        animate={{
          scale: isHovered ? 1.1 : 1
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <Image
          src="/images/logo/logo-meisa.png"
          alt="MEISA"
          width={width}
          height={height}
          unoptimized
          priority
          className="relative z-10"
          style={{
            filter: isHovered
              ? `drop-shadow(0 0 30px rgba(59, 130, 246, 0.8)) drop-shadow(0 20px 40px rgba(30, 64, 175, 0.4))`
              : 'none'
          }}
        />
      </motion.div>

      {/* Anillos pulsantes al hover */}
      {isHovered && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-lg border-2 border-blue-400"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.3 + i * 0.15, opacity: 0 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeOut'
              }}
            />
          ))}
        </>
      )}
    </div>
  )
}

// Efecto 5: Parallax 3D - Capas con profundidad
function Parallax3DEffect({ width, height }: { width: number; height: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const smoothX = useSpring(x, { stiffness: 300, damping: 30 })
  const smoothY = useSpring(y, { stiffness: 300, damping: 30 })

  // Diferentes profundidades para crear parallax
  const layer1X = useTransform(smoothX, (value) => value * 0.8)
  const layer1Y = useTransform(smoothY, (value) => value * 0.8)
  const layer2X = useTransform(smoothX, (value) => value * 0.5)
  const layer2Y = useTransform(smoothY, (value) => value * 0.5)
  const layer3X = useTransform(smoothX, (value) => value * 0.2)
  const layer3Y = useTransform(smoothY, (value) => value * 0.2)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) / 10)
    y.set((e.clientY - centerY) / 10)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ width, height, perspective: 1000 }}
      className="relative flex items-center justify-center cursor-pointer overflow-visible"
    >
      {/* Capa de fondo - más lenta */}
      <motion.div
        className="absolute"
        style={{
          x: layer3X,
          y: layer3Y,
          opacity: isHovered ? 0.3 : 0,
          scale: 1.1
        }}
      >
        <Image
          src="/images/logo/logo-meisa.png"
          alt=""
          width={width}
          height={height}
          unoptimized
          className="blur-sm"
          style={{ filter: 'brightness(0.5)' }}
        />
      </motion.div>

      {/* Capa media */}
      <motion.div
        className="absolute"
        style={{
          x: layer2X,
          y: layer2Y,
          opacity: isHovered ? 0.5 : 0,
          scale: 1.05
        }}
      >
        <Image
          src="/images/logo/logo-meisa.png"
          alt=""
          width={width}
          height={height}
          unoptimized
          className="blur-[1px]"
          style={{ filter: 'brightness(0.7)' }}
        />
      </motion.div>

      {/* Logo principal - más rápida */}
      <motion.div
        className="relative z-10"
        style={{
          x: layer1X,
          y: layer1Y,
          rotateX: useTransform(smoothY, [-20, 20], [5, -5]),
          rotateY: useTransform(smoothX, [-20, 20], [-5, 5]),
          transformStyle: 'preserve-3d'
        }}
        animate={{
          scale: isHovered ? 1.05 : 1
        }}
      >
        <Image
          src="/images/logo/logo-meisa.png"
          alt="MEISA"
          width={width}
          height={height}
          unoptimized
          priority
          style={{
            filter: isHovered ? 'drop-shadow(0 15px 35px rgba(30, 64, 175, 0.35))' : 'none',
            transform: 'translateZ(30px)'
          }}
        />
      </motion.div>

      {/* Partículas de fondo */}
      {isHovered && (
        <>
          {[...Array(6)].map((_, i) => {
            const angle = (i * 60) * (Math.PI / 180)
            const distance = 80
            return (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full"
                style={{
                  left: '50%',
                  top: '50%'
                }}
                initial={{ x: 0, y: 0, opacity: 0 }}
                animate={{
                  x: Math.cos(angle) * distance,
                  y: Math.sin(angle) * distance,
                  opacity: [0, 0.8, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            )
          })}
        </>
      )}
    </div>
  )
}
