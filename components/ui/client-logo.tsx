'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ClientLogoProps {
  logo?: string | null
  logoBlanco?: string | null
  alt: string
  width?: number
  height?: number
  className?: string
  darkMode?: boolean
}

export function ClientLogo({ 
  logo,
  logoBlanco, 
  alt, 
  width = 120, 
  height = 60, 
  className = "",
  darkMode = false
}: ClientLogoProps) {
  const [error, setError] = useState(false)
  
  // Determinar qué logo usar y qué filtros aplicar
  const getLogoConfig = () => {
    if (darkMode && logoBlanco) {
      // Usar logo blanco sin filtros adicionales (ya está optimizado para fondo oscuro)
      return {
        src: logoBlanco,
        filters: 'opacity-80 group-hover/logo:opacity-100 hover:opacity-100 transition-opacity'
      }
    } else if (darkMode && logo) {
      // Usar logo normal con filtros de inversión para fondo oscuro
      return {
        src: logo,
        filters: 'filter brightness-0 invert opacity-60 group-hover/logo:opacity-100 hover:opacity-100 transition-opacity'
      }
    } else if (!darkMode && logo) {
      // Usar logo normal sin filtros para fondo claro
      return {
        src: logo,
        filters: 'opacity-90 hover:opacity-100 transition-opacity'
      }
    } else if (!darkMode && logoBlanco) {
      // Usar logo blanco con filtros de inversión para fondo claro
      return {
        src: logoBlanco,
        filters: 'filter brightness-0 invert opacity-90 hover:opacity-100 transition-opacity'
      }
    }
    
    return null
  }
  
  // Generar placeholder basado en el nombre
  const getPlaceholder = () => {
    const initials = alt
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
    
    return (
      <div className={`flex items-center justify-center ${
        darkMode ? 'bg-white/10 text-white' : 'bg-gray-200 text-gray-600'
      } font-bold rounded ${className}`}>
        {initials}
      </div>
    )
  }

  const logoConfig = getLogoConfig()
  
  if (!logoConfig || error) {
    return getPlaceholder()
  }

  return (
    <Image
      src={logoConfig.src}
      alt={alt}
      width={width}
      height={height}
      className={`object-contain ${logoConfig.filters} ${className}`}
      onError={() => setError(true)}
    />
  )
}