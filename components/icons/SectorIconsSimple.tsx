import React from 'react'

interface IconProps {
  className?: string
  size?: number
}

// Iconos simplificados que se ven bien en fondos coloridos
export const IndustrialIcon = ({ className = "w-6 h-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    {/* Fábrica simple */}
    <rect x="3" y="14" width="18" height="6" rx="1" fill="white" opacity="0.9"/>
    {/* Chimeneas */}
    <rect x="6" y="8" width="2" height="6" rx="1" fill="white" opacity="0.8"/>
    <rect x="10" y="6" width="2" height="8" rx="1" fill="white" opacity="0.8"/>
    <rect x="14" y="10" width="2" height="4" rx="1" fill="white" opacity="0.8"/>
    {/* Engranaje */}
    <circle cx="18" cy="10" r="2.5" fill="none" stroke="white" strokeWidth="2"/>
    <circle cx="18" cy="10" r="1" fill="white"/>
  </svg>
)

export const ComercialIcon = ({ className = "w-6 h-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    {/* Edificio comercial */}
    <rect x="4" y="9" width="16" height="11" rx="2" fill="white" opacity="0.9"/>
    {/* Techo */}
    <path d="M3 9 L12 5 L21 9 L19 9 L12 6.5 L5 9 Z" fill="white"/>
    {/* Ventanas */}
    <rect x="7" y="12" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="11" y="12" width="2" height="2" fill="currentColor" opacity="0.3"/>
    <rect x="15" y="12" width="2" height="2" fill="currentColor" opacity="0.3"/>
    {/* Entrada */}
    <rect x="10" y="16" width="4" height="4" fill="currentColor" opacity="0.3"/>
  </svg>
)

export const ConstruccionIcon = ({ className = "w-6 h-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    {/* Edificios */}
    <rect x="3" y="12" width="3" height="8" fill="white" opacity="0.8"/>
    <rect x="7" y="10" width="3" height="10" fill="white" opacity="0.9"/>
    <rect x="11" y="14" width="3" height="6" fill="white" opacity="0.7"/>
    {/* Grúa */}
    <rect x="16" y="6" width="1" height="14" fill="white"/>
    <rect x="13" y="6" width="7" height="1" fill="white"/>
    <rect x="19" y="6" width="1" height="2" fill="white"/>
    {/* Cable */}
    <line x1="17" y1="7" x2="17" y2="10" stroke="white" strokeWidth="1"/>
  </svg>
)

export const InstitucionalIcon = ({ className = "w-6 h-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    {/* Base */}
    <rect x="4" y="16" width="16" height="4" fill="white" opacity="0.9"/>
    {/* Columnas */}
    <rect x="6" y="9" width="1.5" height="7" fill="white"/>
    <rect x="9" y="9" width="1.5" height="7" fill="white"/>
    <rect x="12" y="9" width="1.5" height="7" fill="white"/>
    <rect x="15" y="9" width="1.5" height="7" fill="white"/>
    {/* Frontón */}
    <path d="M5 9 L12 4 L19 9 L17 9 L12 5.5 L7 9 Z" fill="white"/>
    {/* Entrada */}
    <rect x="10" y="13" width="4" height="3" fill="currentColor" opacity="0.3"/>
  </svg>
)

export const EnergiaIcon = ({ className = "w-6 h-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    {/* Panel solar */}
    <rect x="5" y="11" width="10" height="6" rx="1" fill="white" opacity="0.9"/>
    {/* Grid */}
    <line x1="8" y1="11" x2="8" y2="17" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
    <line x1="11" y1="11" x2="11" y2="17" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
    <line x1="5" y1="14" x2="15" y2="14" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
    {/* Sol */}
    <circle cx="18" cy="8" r="2" fill="white"/>
    {/* Rayos */}
    <path d="M18 4 L18 6" stroke="white" strokeWidth="1.5"/>
    <path d="M22 8 L20 8" stroke="white" strokeWidth="1.5"/>
    <path d="M20.5 5.5 L19.5 6.5" stroke="white" strokeWidth="1.5"/>
    {/* Rayo */}
    <path d="M2 6 L4 10 L3 10 L5 14" stroke="white" strokeWidth="2" fill="none"/>
  </svg>
)

export const MineriaIcon = ({ className = "w-6 h-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    {/* Montañas */}
    <path d="M3 16 L7 8 L11 12 L15 6 L19 10 L21 16 Z" fill="white" opacity="0.8"/>
    {/* Túnel */}
    <ellipse cx="12" cy="16" rx="2" ry="1" fill="currentColor" opacity="0.4"/>
    {/* Carrito */}
    <rect x="7" y="14" width="3" height="1.5" rx="0.5" fill="white"/>
    <circle cx="8" cy="16" r="0.5" fill="white"/>
    <circle cx="9.5" cy="16" r="0.5" fill="white"/>
    {/* Pico */}
    <path d="M17 12 L18 11 L19 12" stroke="white" strokeWidth="2" fill="none"/>
    <line x1="18" y1="12" x2="18" y2="15" stroke="white" strokeWidth="1.5"/>
  </svg>
)

export const GobiernoIcon = ({ className = "w-6 h-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    {/* Escudo */}
    <path d="M12 3 C15 3 18 4.5 18 7.5 C18 12.5 15 17.5 12 19 C9 17.5 6 12.5 6 7.5 C6 4.5 9 3 12 3 Z" 
          fill="white" opacity="0.9"/>
    {/* Estrella */}
    <path d="M12 8 L12.8 10.4 L15.2 10.4 L13.4 11.8 L14.2 14.2 L12 12.8 L9.8 14.2 L10.6 11.8 L8.8 10.4 L11.2 10.4 Z" 
          fill="currentColor" opacity="0.6"/>
    {/* Bandera */}
    <rect x="11.5" y="2" width="1" height="3" fill="white"/>
    <path d="M12.5 2 L15 2.5 L15 4 L12.5 3.5 Z" fill="white"/>
  </svg>
)

export const SaludIcon = ({ className = "w-6 h-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    {/* Cruz médica */}
    <rect x="10" y="5" width="4" height="14" rx="2" fill="white"/>
    <rect x="5" y="10" width="14" height="4" rx="2" fill="white"/>
    {/* Centro */}
    <circle cx="12" cy="12" r="2.5" fill="currentColor" opacity="0.3"/>
    {/* Corazón pequeño */}
    <path d="M12 10.5 C11 9.5 10 10 10 11 C10 12.5 12 14 12 14 C12 14 14 12.5 14 11 C14 10 13 9.5 12 10.5 Z" 
          fill="white" opacity="0.8"/>
    {/* Pulso */}
    <path d="M18 7 L19 5 L20 9 L21 3 L22 7" stroke="white" strokeWidth="1.5" fill="none"/>
  </svg>
)

export const OtroIcon = ({ className = "w-6 h-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    {/* Nodos conectados */}
    <circle cx="7" cy="7" r="2" fill="white" opacity="0.9"/>
    <circle cx="17" cy="7" r="2" fill="white" opacity="0.9"/>
    <circle cx="7" cy="17" r="2" fill="white" opacity="0.9"/>
    <circle cx="17" cy="17" r="2" fill="white" opacity="0.9"/>
    <circle cx="12" cy="12" r="2.5" fill="white"/>
    {/* Conexiones */}
    <line x1="9" y1="8" x2="10" y2="11" stroke="white" strokeWidth="1.5" opacity="0.6"/>
    <line x1="15" y1="8" x2="14" y2="11" stroke="white" strokeWidth="1.5" opacity="0.6"/>
    <line x1="9" y1="16" x2="10" y2="13" stroke="white" strokeWidth="1.5" opacity="0.6"/>
    <line x1="15" y1="16" x2="14" y2="13" stroke="white" strokeWidth="1.5" opacity="0.6"/>
    {/* Símbolo central */}
    <circle cx="12" cy="12" r="1" fill="currentColor" opacity="0.4"/>
  </svg>
)

export const sectorIcons = {
  INDUSTRIAL: IndustrialIcon,
  COMERCIAL: ComercialIcon,
  CONSTRUCCION: ConstruccionIcon,
  INSTITUCIONAL: InstitucionalIcon,
  ENERGIA: EnergiaIcon,
  MINERIA: MineriaIcon,
  GOBIERNO: GobiernoIcon,
  SALUD: SaludIcon,
  OTRO: OtroIcon
}