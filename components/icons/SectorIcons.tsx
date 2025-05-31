import React from 'react'

interface IconProps {
  className?: string
  size?: number
}

// Icono para Sector Industrial - Engranajes y Fábrica
export const IndustrialIcon = ({ className = "w-6 h-6", size }: IconProps) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none"
  >
    <defs>
      <linearGradient id="industrial-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>
    </defs>
    
    {/* Base de fábrica */}
    <rect x="2" y="14" width="20" height="8" rx="1" fill="url(#industrial-gradient)" opacity="0.8"/>
    
    {/* Chimeneas */}
    <rect x="5" y="6" width="2" height="8" rx="1" fill="url(#industrial-gradient)"/>
    <rect x="9" y="4" width="2" height="10" rx="1" fill="url(#industrial-gradient)"/>
    <rect x="13" y="7" width="2" height="7" rx="1" fill="url(#industrial-gradient)"/>
    
    {/* Engranaje principal */}
    <circle cx="17" cy="10" r="3" fill="none" stroke="white" strokeWidth="1.5"/>
    <circle cx="17" cy="10" r="1.5" fill="white"/>
    <path d="m17 7 0.5-1.5 1.5 0.5-0.5 1.5z" fill="white"/>
    <path d="m20 10 1.5-0.5 0.5 1.5-1.5 0.5z" fill="white"/>
    <path d="m17 13 -0.5 1.5-1.5-0.5 0.5-1.5z" fill="white"/>
    <path d="m14 10 -1.5 0.5-0.5-1.5 1.5-0.5z" fill="white"/>
    
    {/* Líneas de conexión */}
    <path d="M6 18h12" stroke="white" strokeWidth="1" opacity="0.6"/>
  </svg>
)

// Icono para Sector Comercial - Tienda moderna con gráfico
export const ComercialIcon = ({ className = "w-6 h-6", size }: IconProps) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <defs>
      <linearGradient id="comercial-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    
    {/* Base del edificio comercial */}
    <rect x="3" y="8" width="18" height="12" rx="2" fill="url(#comercial-gradient)" opacity="0.8"/>
    
    {/* Techo del centro comercial */}
    <path d="M2 8 L12 4 L22 8 L20 8 L12 5.5 L4 8 Z" fill="url(#comercial-gradient)"/>
    
    {/* Ventanas/locales */}
    <rect x="5" y="11" width="3" height="3" rx="0.5" fill="white" opacity="0.9"/>
    <rect x="10" y="11" width="3" height="3" rx="0.5" fill="white" opacity="0.9"/>
    <rect x="15" y="11" width="3" height="3" rx="0.5" fill="white" opacity="0.9"/>
    
    {/* Entrada principal */}
    <rect x="10" y="16" width="4" height="4" rx="0.5" fill="white" opacity="0.7"/>
    
    {/* Gráfico de crecimiento */}
    <path d="M16 6 L17 4 L18 5 L19 3 L20 4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <circle cx="16" cy="6" r="0.5" fill="currentColor"/>
    <circle cx="17" cy="4" r="0.5" fill="currentColor"/>
    <circle cx="18" cy="5" r="0.5" fill="currentColor"/>
    <circle cx="19" cy="3" r="0.5" fill="currentColor"/>
    <circle cx="20" cy="4" r="0.5" fill="currentColor"/>
  </svg>
)

// Icono para Sector Construcción - Grúa y Edificios
export const ConstruccionIcon = ({ className = "w-6 h-6", size }: IconProps) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <defs>
      <linearGradient id="construccion-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6B7280" />
        <stop offset="100%" stopColor="#374151" />
      </linearGradient>
    </defs>
    
    {/* Edificios en construcción */}
    <rect x="2" y="12" width="4" height="10" rx="0.5" fill="url(#construccion-gradient)" opacity="0.7"/>
    <rect x="7" y="8" width="4" height="14" rx="0.5" fill="url(#construccion-gradient)" opacity="0.8"/>
    <rect x="12" y="10" width="4" height="12" rx="0.5" fill="url(#construccion-gradient)" opacity="0.6"/>
    
    {/* Grúa torre */}
    <rect x="17" y="6" width="1" height="16" fill="currentColor"/>
    
    {/* Brazo de grúa */}
    <rect x="14" y="6" width="8" height="0.8" fill="currentColor"/>
    <rect x="21" y="6" width="0.8" height="3" fill="currentColor"/>
    
    {/* Gancho */}
    <line x1="19" y1="6.8" x2="19" y2="9" stroke="currentColor" strokeWidth="0.5"/>
    <rect x="18.5" y="9" width="1" height="0.5" fill="currentColor"/>
    
    {/* Ventanas en edificios */}
    <rect x="3" y="14" width="0.8" height="0.8" fill="white" opacity="0.8"/>
    <rect x="4.2" y="14" width="0.8" height="0.8" fill="white" opacity="0.8"/>
    <rect x="3" y="16" width="0.8" height="0.8" fill="white" opacity="0.8"/>
    <rect x="4.2" y="16" width="0.8" height="0.8" fill="white" opacity="0.8"/>
    
    <rect x="8" y="10" width="0.8" height="0.8" fill="white" opacity="0.8"/>
    <rect x="9.2" y="10" width="0.8" height="0.8" fill="white" opacity="0.8"/>
    <rect x="8" y="12" width="0.8" height="0.8" fill="white" opacity="0.8"/>
    <rect x="9.2" y="12" width="0.8" height="0.8" fill="white" opacity="0.8"/>
  </svg>
)

// Icono para Sector Institucional - Edificio gubernamental con columnas
export const InstitucionalIcon = ({ className = "w-6 h-6", size }: IconProps) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <defs>
      <linearGradient id="institucional-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#7C3AED" />
      </linearGradient>
    </defs>
    
    {/* Base del edificio */}
    <rect x="3" y="18" width="18" height="4" fill="url(#institucional-gradient)" opacity="0.8"/>
    
    {/* Columnas clásicas */}
    <rect x="5" y="8" width="1.5" height="10" fill="url(#institucional-gradient)"/>
    <rect x="8" y="8" width="1.5" height="10" fill="url(#institucional-gradient)"/>
    <rect x="11" y="8" width="1.5" height="10" fill="url(#institucional-gradient)"/>
    <rect x="14" y="8" width="1.5" height="10" fill="url(#institucional-gradient)"/>
    <rect x="17" y="8" width="1.5" height="10" fill="url(#institucional-gradient)"/>
    
    {/* Frontón triangular */}
    <path d="M4 8 L12 3 L20 8 L18 8 L12 4.5 L6 8 Z" fill="url(#institucional-gradient)"/>
    
    {/* Entrada con escalones */}
    <rect x="10" y="15" width="4" height="3" fill="white" opacity="0.9"/>
    <rect x="9" y="17.5" width="6" height="0.5" fill="url(#institucional-gradient)" opacity="0.6"/>
    
    {/* Detalles decorativos */}
    <circle cx="12" cy="6" r="0.8" fill="white" opacity="0.8"/>
    <rect x="4" y="7.5" width="16" height="0.5" fill="url(#institucional-gradient)"/>
  </svg>
)

// Icono para Sector Energía - Panel solar y rayos
export const EnergiaIcon = ({ className = "w-6 h-6", size }: IconProps) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <defs>
      <linearGradient id="energia-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    
    {/* Panel solar */}
    <rect x="4" y="10" width="12" height="8" rx="1" fill="url(#energia-gradient)" opacity="0.8"/>
    
    {/* Grid del panel */}
    <line x1="8" y1="10" x2="8" y2="18" stroke="white" strokeWidth="0.5" opacity="0.6"/>
    <line x1="12" y1="10" x2="12" y2="18" stroke="white" strokeWidth="0.5" opacity="0.6"/>
    <line x1="4" y1="14" x2="16" y2="14" stroke="white" strokeWidth="0.5" opacity="0.6"/>
    
    {/* Soporte del panel */}
    <path d="M6 18 L8 22 L12 22 L10 18" fill="url(#energia-gradient)" opacity="0.6"/>
    
    {/* Rayos de sol */}
    <path d="M19 7 L21 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M19 9 L21 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M19 11 L21 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    
    {/* Sol */}
    <circle cx="19" cy="9" r="2" fill="url(#energia-gradient)" opacity="0.7"/>
    
    {/* Rayo eléctrico */}
    <path d="M2 4 L4 8 L3 8 L5 12 L3 10 L1 10 Z" fill="currentColor"/>
  </svg>
)

// Icono para Sector Minería - Pico y montaña
export const MineriaIcon = ({ className = "w-6 h-6", size }: IconProps) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <defs>
      <linearGradient id="mineria-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EA580C" />
        <stop offset="100%" stopColor="#C2410C" />
      </linearGradient>
    </defs>
    
    {/* Montañas */}
    <path d="M2 18 L8 8 L14 14 L20 6 L22 18 Z" fill="url(#mineria-gradient)" opacity="0.7"/>
    
    {/* Túnel de mina */}
    <ellipse cx="12" cy="18" rx="3" ry="1.5" fill="currentColor" opacity="0.8"/>
    <rect x="10.5" y="15" width="3" height="3" rx="1.5" fill="currentColor" opacity="0.6"/>
    
    {/* Pico de minería */}
    <path d="M16 10 L17 9 L18 10 L17 11 Z" fill="currentColor"/>
    <rect x="16.3" y="10.5" width="0.4" height="4" fill="currentColor"/>
    
    {/* Carrito de mina */}
    <rect x="6" y="16" width="4" height="2" rx="0.5" fill="url(#mineria-gradient)" opacity="0.8"/>
    <circle cx="7" cy="18.5" r="0.5" fill="currentColor"/>
    <circle cx="9" cy="18.5" r="0.5" fill="currentColor"/>
    
    {/* Cristales/minerales */}
    <path d="M4 14 L5 12 L6 14 L5 15 Z" fill="currentColor" opacity="0.6"/>
    <path d="M18 14 L19 12 L20 14 L19 15 Z" fill="currentColor" opacity="0.6"/>
  </svg>
)

// Icono para Sector Gobierno - Escudo con estrella
export const GobiernoIcon = ({ className = "w-6 h-6", size }: IconProps) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <defs>
      <linearGradient id="gobierno-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#DC2626" />
        <stop offset="100%" stopColor="#B91C1C" />
      </linearGradient>
    </defs>
    
    {/* Escudo principal */}
    <path d="M12 2 C16 2 20 4 20 8 C20 14 16 20 12 22 C8 20 4 14 4 8 C4 4 8 2 12 2 Z" 
          fill="url(#gobierno-gradient)" opacity="0.8"/>
    
    {/* Estrella central */}
    <path d="M12 7 L13.2 10.2 L16.5 10.2 L13.9 12.3 L15.1 15.5 L12 13.4 L8.9 15.5 L10.1 12.3 L7.5 10.2 L10.8 10.2 Z" 
          fill="white"/>
    
    {/* Detalles del escudo */}
    <path d="M12 3 C15.5 3 18.5 4.5 18.5 7.5 C18.5 13 15.5 18.5 12 20.5 C8.5 18.5 5.5 13 5.5 7.5 C5.5 4.5 8.5 3 12 3 Z" 
          fill="none" stroke="white" strokeWidth="0.5" opacity="0.6"/>
    
    {/* Bandera en la parte superior */}
    <rect x="11.5" y="1" width="1" height="3" fill="currentColor"/>
    <path d="M12.5 1 L15 1.5 L15 3 L12.5 2.5 Z" fill="url(#gobierno-gradient)" opacity="0.9"/>
  </svg>
)

// Icono para Sector Salud - Cruz médica y corazón
export const SaludIcon = ({ className = "w-6 h-6", size }: IconProps) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <defs>
      <linearGradient id="salud-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#0891B2" />
      </linearGradient>
    </defs>
    
    {/* Cruz médica principal */}
    <rect x="10" y="4" width="4" height="16" rx="2" fill="url(#salud-gradient)"/>
    <rect x="4" y="10" width="16" height="4" rx="2" fill="url(#salud-gradient)"/>
    
    {/* Centro de la cruz */}
    <circle cx="12" cy="12" r="3" fill="white"/>
    <circle cx="12" cy="12" r="1.5" fill="url(#salud-gradient)"/>
    
    {/* Corazón pequeño en el centro */}
    <path d="M12 10.5c0-1.5-1-2.5-2.5-2.5s-2.5 1-2.5 2.5c0 2.5 2.5 4.5 2.5 4.5s2.5-2 2.5-4.5z" 
          fill="none" stroke="white" strokeWidth="0.8" transform="scale(0.6) translate(6, 6)"/>
    
    {/* Pulso cardíaco */}
    <path d="M18 6 L19 4 L20 8 L21 2 L22 6" stroke="url(#salud-gradient)" strokeWidth="1.5" fill="none" opacity="0.8"/>
    
    {/* Escudo protector */}
    <path d="M3 8 C3 6 4 5 5 5 C6 5 7 6 7 8 C7 10 6 12 5 13 C4 12 3 10 3 8 Z" 
          fill="url(#salud-gradient)" opacity="0.7"/>
  </svg>
)

// Icono para Otros Sectores - Icono moderno y versátil
export const OtroIcon = ({ className = "w-6 h-6", size }: IconProps) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <defs>
      <linearGradient id="otro-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#4F46E5" />
      </linearGradient>
    </defs>
    
    {/* Nodos conectados representando diversidad */}
    <circle cx="6" cy="6" r="2.5" fill="url(#otro-gradient)" opacity="0.8"/>
    <circle cx="18" cy="6" r="2.5" fill="url(#otro-gradient)" opacity="0.8"/>
    <circle cx="6" cy="18" r="2.5" fill="url(#otro-gradient)" opacity="0.8"/>
    <circle cx="18" cy="18" r="2.5" fill="url(#otro-gradient)" opacity="0.8"/>
    <circle cx="12" cy="12" r="3" fill="url(#otro-gradient)"/>
    
    {/* Conexiones */}
    <path d="M8.5 7.5 L9.5 10.5" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
    <path d="M15.5 7.5 L14.5 10.5" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
    <path d="M8.5 16.5 L9.5 13.5" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
    <path d="M15.5 16.5 L14.5 13.5" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
    
    {/* Centro con símbolo de infinito */}
    <path d="M10 12 C10 11 10.5 10 11.5 10 C12.5 10 13 11 13 12 C13 11 13.5 10 14.5 10 C15.5 10 16 11 16 12 C16 13 15.5 14 14.5 14 C13.5 14 13 13 13 12 C13 13 12.5 14 11.5 14 C10.5 14 10 13 10 12 Z" 
          fill="white" opacity="0.9"/>
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