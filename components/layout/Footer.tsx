import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Linkedin, Youtube, Globe } from 'lucide-react'

type IconComponent = React.ComponentType<{ className?: string }>

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

// Formas mínimas (desacopladas de Prisma) que el footer necesita para renderizar.
export interface FooterLinkItem { grupo: string; label: string; href: string }
export interface FooterSocialItem { red: string; url: string; label?: string | null; icono?: string | null }
export interface FooterPlantaItem { nombre: string; ubicacion: string }

interface FooterProps {
  links?: FooterLinkItem[]
  social?: FooterSocialItem[]
  plantas?: FooterPlantaItem[]
}

// Orden y títulos de las columnas. Un grupo nuevo creado en el admin que no
// esté aquí se muestra al final con su nombre capitalizado.
const COLUMN_ORDER = ['soluciones', 'guias', 'ciudades', 'empresa']
const GROUP_TITLES: Record<string, string> = {
  soluciones: 'Soluciones',
  guias: 'Guías',
  ciudades: 'Ciudades',
  empresa: 'Empresa',
}

// --- Fallbacks: si la DB no devuelve datos, el footer nunca queda vacío. ---
const DEFAULT_LINKS: FooterLinkItem[] = [
  { grupo: 'soluciones', label: 'Bodegas y naves', href: '/soluciones/estructura-metalica-para-bodegas' },
  { grupo: 'soluciones', label: 'Puentes metálicos', href: '/soluciones/puentes-metalicos' },
  { grupo: 'soluciones', label: 'Cubiertas y fachadas', href: '/soluciones/cubiertas-metalicas' },
  { grupo: 'soluciones', label: 'Centros comerciales', href: '/soluciones/estructura-metalica-centros-comerciales' },
  { grupo: 'soluciones', label: 'Escenarios deportivos', href: '/soluciones/estructura-metalica-escenarios-deportivos' },
  { grupo: 'soluciones', label: 'Edificios', href: '/soluciones/edificios-en-estructura-metalica' },
  { grupo: 'guias', label: 'Precios y costos', href: '/precios-estructuras-metalicas' },
  { grupo: 'guias', label: 'Acero vs. concreto', href: '/estructura-metalica-vs-concreto' },
  { grupo: 'guias', label: 'Tipos de estructuras', href: '/tipos-de-estructuras-metalicas' },
  { grupo: 'guias', label: 'Peso por m²', href: '/peso-estructura-metalica-por-m2' },
  { grupo: 'ciudades', label: 'Cali', href: '/estructuras-metalicas/cali' },
  { grupo: 'ciudades', label: 'Bogotá', href: '/estructuras-metalicas/bogota' },
  { grupo: 'ciudades', label: 'Popayán', href: '/estructuras-metalicas/popayan' },
  { grupo: 'empresa', label: 'Sobre MEISA', href: '/empresa' },
  { grupo: 'empresa', label: 'Tecnología', href: '/procesos-tecnologias' },
  { grupo: 'empresa', label: 'Calidad y Certificaciones', href: '/calidad' },
  { grupo: 'empresa', label: 'Portfolio', href: '/proyectos' },
  { grupo: 'legal', label: 'Política de Datos', href: '/politica-datos' },
  { grupo: 'legal', label: 'Gobierno Corporativo', href: '/empresa#gobierno-corporativo' },
]

const DEFAULT_SOCIAL: FooterSocialItem[] = [
  { red: 'facebook', url: 'https://www.facebook.com/Metalicaseingenieria', icono: 'Facebook' },
  { red: 'instagram', url: 'https://www.instagram.com/meisa.sas', icono: 'Instagram' },
  { red: 'linkedin', url: 'https://www.linkedin.com/company/meisa-sas', icono: 'Linkedin' },
  { red: 'twitter', url: 'https://x.com/meisa_sas', icono: 'Twitter' },
  { red: 'youtube', url: 'https://www.youtube.com/@MEISA_SAS', icono: 'Youtube' },
]

const DEFAULT_PLANTAS: FooterPlantaItem[] = [
  { nombre: 'Jamundí', ubicacion: 'Vía Panamericana 6 Sur – 195, Valle del Cauca' },
  { nombre: 'Popayán', ubicacion: 'Bodega E13 Parque Industrial, Cauca' },
  { nombre: 'Villa Rica', ubicacion: 'Vía Puerto Tejada, Cauca' },
]

function resolveSocialIcon(s: FooterSocialItem): IconComponent {
  const key = `${s.red} ${s.icono ?? ''} ${s.url}`.toLowerCase()
  if (key.includes('facebook')) return Facebook
  if (key.includes('instagram')) return Instagram
  if (key.includes('linkedin')) return Linkedin
  if (key.includes('youtube')) return Youtube
  if (key.includes('twitter') || key.includes('x.com')) return XIcon
  return Globe
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export function Footer({ links, social, plantas }: FooterProps = {}) {
  const year = new Date().getFullYear()
  const allLinks = links && links.length > 0 ? links : DEFAULT_LINKS
  const socialLinks = social && social.length > 0 ? social : DEFAULT_SOCIAL
  const plantList = plantas && plantas.length > 0 ? plantas : DEFAULT_PLANTAS

  // Agrupar enlaces por grupo, preservando el orden de llegada.
  const byGroup = new Map<string, FooterLinkItem[]>()
  for (const l of allLinks) {
    const arr = byGroup.get(l.grupo) ?? []
    arr.push(l)
    byGroup.set(l.grupo, arr)
  }
  const legalLinks = byGroup.get('legal') ?? []
  const columnKeys = [
    ...COLUMN_ORDER.filter((g) => byGroup.has(g)),
    ...Array.from(byGroup.keys()).filter((g) => g !== 'legal' && !COLUMN_ORDER.includes(g)),
  ]

  return (
    <footer className="bg-slate-950 text-white border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-14 md:py-20">
        {/* Marca + redes */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 pb-10 md:pb-12 mb-12 md:mb-16 border-b border-white/10">
          <div className="max-w-sm">
            <Image
              src="https://storage.googleapis.com/meisa-imagenes/site/logo/logo-meisa-white.png"
              alt="MEISA"
              width={120}
              height={34}
              unoptimized
              className="w-[120px] h-auto mb-6"
            />
            <p className="text-white/50 font-lato text-sm leading-relaxed">
              Metálicas e Ingeniería S.A.S. — Diseño, fabricación y montaje de estructuras metálicas desde 1996.
            </p>
          </div>
          <div className="flex gap-5">
            {socialLinks.map((s) => {
              const Icon = resolveSocialIcon(s)
              return (
                <a
                  key={s.red || s.url}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 hover:text-white transition-colors"
                  aria-label={s.label || capitalize(s.red)}
                >
                  <Icon className="w-5 h-5" />
                </a>
              )
            })}
          </div>
        </div>

        {/* Columnas de enlaces */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-10">
          {columnKeys.map((grupo) => (
            <div key={grupo}>
              <h4 className="text-white/40 font-lato font-bold text-xs uppercase tracking-[0.2em] mb-5">
                {GROUP_TITLES[grupo] ?? capitalize(grupo)}
              </h4>
              <ul className="space-y-3 font-lato text-sm">
                {(byGroup.get(grupo) ?? []).map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="text-white/80 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Plantas */}
          <div>
            <h4 className="text-white/40 font-lato font-bold text-xs uppercase tracking-[0.2em] mb-5">
              Plantas
            </h4>
            <ul className="space-y-4 font-lato text-sm">
              {plantList.map((p) => (
                <li key={p.nombre}>
                  <p className="text-white font-semibold">{p.nombre}</p>
                  <p className="text-white/50 text-xs leading-relaxed">{p.ubicacion}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="mt-14 md:mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="font-lato text-white/40 text-xs">
            © {year} MEISA Metálicas e Ingeniería S.A.S. · Todos los derechos reservados
          </p>
          {legalLinks.length > 0 && (
            <div className="flex flex-wrap gap-x-6 gap-y-2 font-lato text-white/40 text-xs">
              {legalLinks.map((link) => (
                <Link key={link.href + link.label} href={link.href} className="hover:text-white transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
