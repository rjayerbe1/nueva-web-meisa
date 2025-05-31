import React from 'react'

interface IconProps {
  className?: string
  size?: number
}

// Icono para Centros Comerciales
export const CentrosComercialesIcon = ({ className = "w-6 h-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    {/* Edificio principal */}
    <rect x="4" y="8" width="16" height="12" rx="2" fill="white" opacity="0.9"/>
    {/* Techo */}
    <path d="M3 8 L12 4 L21 8 L19 8 L12 5.5 L5 8 Z" fill="white"/>
    {/* Locales comerciales */}
    <rect x="6" y="11" width="3" height="3" rx="0.5" fill="#2d2e80" opacity="0.8"/>
    <rect x="10" y="11" width="3" height="3" rx="0.5" fill="#2d2e80" opacity="0.8"/>
    <rect x="14" y="11" width="3" height="3" rx="0.5" fill="#2d2e80" opacity="0.8"/>
    {/* Entrada principal */}
    <rect x="10" y="16" width="4" height="4" rx="0.5" fill="#2d2e80" opacity="0.6"/>
    {/* Letrero */}
    <rect x="7" y="6" width="10" height="1.5" rx="0.5" fill="white"/>
    {/* Carritos de compras */}
    <circle cx="6" cy="22" r="0.5" fill="white"/>
    <circle cx="18" cy="22" r="0.5" fill="white"/>
  </svg>
)

// Icono para Edificios
export const EdificiosIcon = ({ className = "w-6 h-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    {/* Torre principal */}
    <rect x="8" y="4" width="8" height="16" rx="1" fill="white" opacity="0.9"/>
    {/* Torre lateral */}
    <rect x="4" y="8" width="4" height="12" rx="1" fill="white" opacity="0.7"/>
    {/* Torre derecha */}
    <rect x="16" y="6" width="4" height="14" rx="1" fill="white" opacity="0.8"/>
    {/* Ventanas torre principal */}
    <rect x="9" y="6" width="1.5" height="1.5" fill="#2d2e80" opacity="0.6"/>
    <rect x="11.5" y="6" width="1.5" height="1.5" fill="#2d2e80" opacity="0.6"/>
    <rect x="14" y="6" width="1.5" height="1.5" fill="#2d2e80" opacity="0.6"/>
    <rect x="9" y="9" width="1.5" height="1.5" fill="#2d2e80" opacity="0.6"/>
    <rect x="11.5" y="9" width="1.5" height="1.5" fill="#2d2e80" opacity="0.6"/>
    <rect x="14" y="9" width="1.5" height="1.5" fill="#2d2e80" opacity="0.6"/>
    {/* Ventanas torres laterales */}
    <rect x="5" y="10" width="1" height="1" fill="#2d2e80" opacity="0.6"/>
    <rect x="6.5" y="10" width="1" height="1" fill="#2d2e80" opacity="0.6"/>
    <rect x="17" y="8" width="1" height="1" fill="#2d2e80" opacity="0.6"/>
    <rect x="18.5" y="8" width="1" height="1" fill="#2d2e80" opacity="0.6"/>
  </svg>
)

// Icono para Industria
export const IndustriaIcon = ({ className = "w-6 h-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    {/* Planta industrial */}
    <rect x="3" y="14" width="18" height="6" rx="1" fill="white" opacity="0.9"/>
    {/* Chimeneas */}
    <rect x="6" y="8" width="2" height="6" rx="1" fill="white" opacity="0.8"/>
    <rect x="10" y="6" width="2" height="8" rx="1" fill="white" opacity="0.8"/>
    <rect x="14" y="10" width="2" height="4" rx="1" fill="white" opacity="0.8"/>
    {/* Humo */}
    <circle cx="7" cy="7" r="0.8" fill="white" opacity="0.5"/>
    <circle cx="7.5" cy="5.5" r="0.6" fill="white" opacity="0.4"/>
    <circle cx="11" cy="5" r="0.8" fill="white" opacity="0.5"/>
    <circle cx="11.5" cy="3.5" r="0.6" fill="white" opacity="0.4"/>
    {/* Tanques */}
    <circle cx="18" cy="16" r="2" fill="white" opacity="0.7"/>
    <rect x="17.5" y="14" width="1" height="4" fill="#2d2e80" opacity="0.6"/>
    {/* Tuberías */}
    <path d="M8 16 L12 16 L12 18 L16 18" stroke="white" strokeWidth="1.5" fill="none"/>
  </svg>
)

// Icono para Puentes Vehiculares
export const PuentesVehicularesIcon = ({ className = "w-6 h-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    {/* Tablero del puente */}
    <rect x="2" y="12" width="20" height="2" rx="1" fill="white"/>
    {/* Torres */}
    <rect x="7" y="4" width="2" height="10" rx="0.5" fill="white" opacity="0.9"/>
    <rect x="15" y="4" width="2" height="10" rx="0.5" fill="white" opacity="0.9"/>
    {/* Cables */}
    <path d="M8 4 L4 12" stroke="white" strokeWidth="1"/>
    <path d="M8 4 L12 12" stroke="white" strokeWidth="1"/>
    <path d="M16 4 L12 12" stroke="white" strokeWidth="1"/>
    <path d="M16 4 L20 12" stroke="white" strokeWidth="1"/>
    {/* Vehículos */}
    <rect x="5" y="10.5" width="3" height="1" rx="0.5" fill="#2d2e80" opacity="0.8"/>
    <rect x="16" y="10.5" width="3" height="1" rx="0.5" fill="#2d2e80" opacity="0.8"/>
    {/* Pilares */}
    <rect x="7.5" y="14" width="1" height="6" fill="white" opacity="0.7"/>
    <rect x="15.5" y="14" width="1" height="6" fill="white" opacity="0.7"/>
  </svg>
)

// Icono para Puentes Peatonales
export const PuentesPeatonalesIcon = ({ className = "w-6 h-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    {/* Pasarela */}
    <rect x="3" y="10" width="18" height="1.5" rx="0.5" fill="white"/>
    {/* Barandas */}
    <rect x="3" y="9" width="18" height="0.5" fill="white" opacity="0.7"/>
    <rect x="3" y="11.5" width="18" height="0.5" fill="white" opacity="0.7"/>
    {/* Estructura de soporte */}
    <path d="M6 10 L6 6 L12 4 L18 6 L18 10" stroke="white" strokeWidth="1.5" fill="none"/>
    {/* Tensores */}
    <path d="M12 4 L9 10" stroke="white" strokeWidth="0.8"/>
    <path d="M12 4 L15 10" stroke="white" strokeWidth="0.8"/>
    {/* Escaleras */}
    <rect x="2" y="11.5" width="3" height="8" rx="0.5" fill="white" opacity="0.8"/>
    <rect x="19" y="11.5" width="3" height="8" rx="0.5" fill="white" opacity="0.8"/>
    {/* Peldaños */}
    <line x1="2" y1="13" x2="5" y2="13" stroke="#2d2e80" strokeWidth="0.5"/>
    <line x1="2" y1="15" x2="5" y2="15" stroke="#2d2e80" strokeWidth="0.5"/>
    <line x1="19" y1="13" x2="22" y2="13" stroke="#2d2e80" strokeWidth="0.5"/>
    <line x1="19" y1="15" x2="22" y2="15" stroke="#2d2e80" strokeWidth="0.5"/>
    {/* Peatones */}
    <circle cx="8" cy="9.5" r="0.3" fill="#2d2e80"/>
    <rect x="7.7" y="9.8" width="0.6" height="1" fill="#2d2e80"/>
    <circle cx="16" cy="9.5" r="0.3" fill="#2d2e80"/>
    <rect x="15.7" y="9.8" width="0.6" height="1" fill="#2d2e80"/>
  </svg>
)

// Icono para Escenarios Deportivos
export const EscenariosDeportivosIcon = ({ className = "w-6 h-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    {/* Estadio base */}
    <ellipse cx="12" cy="16" rx="9" ry="4" fill="white" opacity="0.9"/>
    {/* Campo/Cancha */}
    <ellipse cx="12" cy="16" rx="6" ry="2.5" fill="#2d2e80" opacity="0.6"/>
    {/* Graderías */}
    <path d="M4 12 L8 14 L8 18 L4 16 Z" fill="white" opacity="0.8"/>
    <path d="M20 12 L16 14 L16 18 L20 16 Z" fill="white" opacity="0.8"/>
    {/* Techos */}
    <path d="M3 12 L9 9 L9 11 L3 14 Z" fill="white"/>
    <path d="M21 12 L15 9 L15 11 L21 14 Z" fill="white"/>
    {/* Torres de iluminación */}
    <rect x="6" y="4" width="0.8" height="8" fill="white"/>
    <rect x="17.2" y="4" width="0.8" height="8" fill="white"/>
    {/* Luces */}
    <circle cx="6.4" cy="4.5" r="0.8" fill="white"/>
    <circle cx="17.6" cy="4.5" r="0.8" fill="white"/>
    {/* Líneas del campo */}
    <ellipse cx="12" cy="16" rx="4" ry="1.5" fill="none" stroke="white" strokeWidth="0.5"/>
    <line x1="12" y1="14.5" x2="12" y2="17.5" stroke="white" strokeWidth="0.5"/>
  </svg>
)

// Icono para Cubiertas y Fachadas
export const CubiertasFachadasIcon = ({ className = "w-6 h-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    {/* Edificio base */}
    <rect x="5" y="12" width="14" height="8" rx="1" fill="white" opacity="0.8"/>
    {/* Cubierta principal */}
    <path d="M4 12 L12 6 L20 12 L18 12 L12 7.5 L6 12 Z" fill="white"/>
    {/* Tejas/paneles */}
    <path d="M6 12 L8 10.5 L10 12 L8 13.5 Z" fill="#2d2e80" opacity="0.7"/>
    <path d="M8 10.5 L10 9 L12 10.5 L10 12 Z" fill="#2d2e80" opacity="0.7"/>
    <path d="M10 9 L12 7.5 L14 9 L12 10.5 Z" fill="#2d2e80" opacity="0.7"/>
    <path d="M12 7.5 L14 6 L16 7.5 L14 9 Z" fill="#2d2e80" opacity="0.7"/>
    <path d="M14 9 L16 10.5 L18 12 L16 13.5 Z" fill="#2d2e80" opacity="0.7"/>
    {/* Fachada con paneles */}
    <rect x="7" y="14" width="2" height="4" fill="#2d2e80" opacity="0.6"/>
    <rect x="10" y="14" width="2" height="4" fill="#2d2e80" opacity="0.4"/>
    <rect x="13" y="14" width="2" height="4" fill="#2d2e80" opacity="0.6"/>
    <rect x="16" y="14" width="2" height="4" fill="#2d2e80" opacity="0.4"/>
    {/* Canalones */}
    <rect x="4" y="11.5" width="16" height="0.5" rx="0.25" fill="white"/>
    {/* Standing seam */}
    <line x1="7" y1="7.5" x2="7" y2="12" stroke="white" strokeWidth="0.5"/>
    <line x1="9" y1="8.5" x2="9" y2="12" stroke="white" strokeWidth="0.5"/>
    <line x1="11" y1="8" x2="11" y2="12" stroke="white" strokeWidth="0.5"/>
    <line x1="13" y1="8" x2="13" y2="12" stroke="white" strokeWidth="0.5"/>
    <line x1="15" y1="8.5" x2="15" y2="12" stroke="white" strokeWidth="0.5"/>
    <line x1="17" y1="9.5" x2="17" y2="12" stroke="white" strokeWidth="0.5"/>
  </svg>
)

// Icono para Estructuras Modulares
export const EstructurasModularesIcon = ({ className = "w-6 h-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    {/* Módulos conectados */}
    <rect x="3" y="10" width="6" height="6" rx="1" fill="white" opacity="0.9"/>
    <rect x="9" y="8" width="6" height="6" rx="1" fill="white" opacity="0.8"/>
    <rect x="15" y="12" width="6" height="6" rx="1" fill="white" opacity="0.9"/>
    {/* Conexiones */}
    <rect x="8.5" y="11.5" width="1" height="1" fill="#2d2e80" opacity="0.8"/>
    <rect x="14.5" y="13.5" width="1" height="1" fill="#2d2e80" opacity="0.8"/>
    {/* Puertas/ventanas */}
    <rect x="4" y="12" width="1.5" height="3" fill="#2d2e80" opacity="0.6"/>
    <rect x="6.5" y="12" width="1.5" height="1.5" fill="#2d2e80" opacity="0.6"/>
    <rect x="10" y="10" width="1.5" height="3" fill="#2d2e80" opacity="0.6"/>
    <rect x="12.5" y="10" width="1.5" height="1.5" fill="#2d2e80" opacity="0.6"/>
    <rect x="16" y="14" width="1.5" height="3" fill="#2d2e80" opacity="0.6"/>
    <rect x="18.5" y="14" width="1.5" height="1.5" fill="#2d2e80" opacity="0.6"/>
    {/* Grúa de montaje */}
    <rect x="11" y="2" width="0.8" height="6" fill="white"/>
    <rect x="8" y="2" width="6" height="0.8" fill="white"/>
    <line x1="12" y1="2.8" x2="12" y2="5" stroke="white" strokeWidth="1"/>
    <rect x="11.5" y="5" width="1" height="0.5" fill="white"/>
  </svg>
)

// Icono para Oil and Gas
export const OilGasIcon = ({ className = "w-6 h-6" }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    {/* Tanques de almacenamiento */}
    <circle cx="7" cy="15" r="3.5" fill="white" opacity="0.9"/>
    <circle cx="17" cy="15" r="3.5" fill="white" opacity="0.8"/>
    {/* Válvulas */}
    <rect x="6.5" y="12" width="1" height="2" fill="#2d2e80" opacity="0.8"/>
    <rect x="16.5" y="12" width="1" height="2" fill="#2d2e80" opacity="0.8"/>
    {/* Tuberías principales */}
    <rect x="3" y="8" width="18" height="1.5" rx="0.75" fill="white"/>
    <rect x="7" y="8" width="10" height="1" rx="0.5" fill="#2d2e80" opacity="0.6"/>
    {/* Torre de perforación */}
    <rect x="11.5" y="2" width="1" height="8" fill="white"/>
    <path d="M10 2 L12 1 L14 2 L12 3 Z" fill="white"/>
    {/* Intercambiador de calor */}
    <rect x="9" y="18" width="6" height="2" rx="1" fill="white" opacity="0.9"/>
    <circle cx="10" cy="19" r="0.3" fill="#2d2e80"/>
    <circle cx="11" cy="19" r="0.3" fill="#2d2e80"/>
    <circle cx="12" cy="19" r="0.3" fill="#2d2e80"/>
    <circle cx="13" cy="19" r="0.3" fill="#2d2e80"/>
    <circle cx="14" cy="19" r="0.3" fill="#2d2e80"/>
    {/* Conexiones */}
    <path d="M7 11.5 L7 8" stroke="white" strokeWidth="1"/>
    <path d="M17 11.5 L17 8" stroke="white" strokeWidth="1"/>
    <path d="M12 8 L12 18" stroke="white" strokeWidth="1"/>
    {/* Válvulas de control */}
    <circle cx="5" cy="8.75" r="0.5" fill="#2d2e80"/>
    <circle cx="19" cy="8.75" r="0.5" fill="#2d2e80"/>
  </svg>
)

export const categoryIcons = {
  CENTROS_COMERCIALES: CentrosComercialesIcon,
  EDIFICIOS: EdificiosIcon,
  INDUSTRIAL: IndustriaIcon,
  PUENTES: PuentesVehicularesIcon,
  PUENTES_PEATONALES: PuentesPeatonalesIcon,
  ESCENARIOS_DEPORTIVOS: EscenariosDeportivosIcon,
  CUBIERTAS_FACHADAS: CubiertasFachadasIcon,
  ESTRUCTURAS_MODULARES: EstructurasModularesIcon,
  OIL_GAS: OilGasIcon
}