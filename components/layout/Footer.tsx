import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Linkedin } from 'lucide-react'

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

// Columnas de enlaces internos. Las landings SEO (Soluciones / Guías / Ciudades)
// se enlazan desde aquí para que no queden como páginas huérfanas: el footer
// está en todas las páginas, así Google las descubre y les pasa autoridad.
const linkColumns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Soluciones',
    links: [
      { label: 'Bodegas y naves', href: '/soluciones/estructura-metalica-para-bodegas' },
      { label: 'Puentes metálicos', href: '/soluciones/puentes-metalicos' },
      { label: 'Cubiertas y fachadas', href: '/soluciones/cubiertas-metalicas' },
      { label: 'Centros comerciales', href: '/soluciones/estructura-metalica-centros-comerciales' },
      { label: 'Escenarios deportivos', href: '/soluciones/estructura-metalica-escenarios-deportivos' },
      { label: 'Edificios', href: '/soluciones/edificios-en-estructura-metalica' },
    ],
  },
  {
    title: 'Guías',
    links: [
      { label: 'Precios y costos', href: '/precios-estructuras-metalicas' },
      { label: 'Acero vs. concreto', href: '/estructura-metalica-vs-concreto' },
      { label: 'Tipos de estructuras', href: '/tipos-de-estructuras-metalicas' },
      { label: 'Peso por m²', href: '/peso-estructura-metalica-por-m2' },
    ],
  },
  {
    title: 'Ciudades',
    links: [
      { label: 'Cali', href: '/estructuras-metalicas/cali' },
      { label: 'Bogotá', href: '/estructuras-metalicas/bogota' },
      { label: 'Popayán', href: '/estructuras-metalicas/popayan' },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Sobre MEISA', href: '/empresa' },
      { label: 'Tecnología', href: '/procesos-tecnologias' },
      { label: 'Calidad y Certificaciones', href: '/calidad' },
      { label: 'Portfolio', href: '/proyectos' },
    ],
  },
]

const plantas = [
  { ciudad: 'Jamundí', direccion: 'Vía Panamericana 6 Sur – 195, Valle del Cauca' },
  { ciudad: 'Popayán', direccion: 'Bodega E13 Parque Industrial, Cauca' },
  { ciudad: 'Villa Rica', direccion: 'Vía Puerto Tejada, Cauca' },
]

export function Footer() {
  const year = new Date().getFullYear()

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
            {[
              { href: 'https://www.facebook.com/Metalicaseingenieria', icon: Facebook, label: 'Facebook' },
              { href: 'https://www.instagram.com/meisa.s.a.s', icon: Instagram, label: 'Instagram' },
              { href: 'https://co.linkedin.com/company/meisa-sas', icon: Linkedin, label: 'LinkedIn' },
              { href: 'https://x.com/meisa_sas', icon: XIcon, label: 'X' },
            ].map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors"
                aria-label={label}
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Columnas de enlaces */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-10">
          {linkColumns.map((col) => (
            <div key={col.title}>
              <h4 className="text-white/40 font-lato font-bold text-xs uppercase tracking-[0.2em] mb-5">
                {col.title}
              </h4>
              <ul className="space-y-3 font-lato text-sm">
                {col.links.map((link) => (
                  <li key={link.href}>
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
              {plantas.map((p) => (
                <li key={p.ciudad}>
                  <p className="text-white font-semibold">{p.ciudad}</p>
                  <p className="text-white/50 text-xs leading-relaxed">{p.direccion}</p>
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
          <div className="flex flex-wrap gap-x-6 gap-y-2 font-lato text-white/40 text-xs">
            <Link href="/politica-datos" className="hover:text-white transition-colors">
              Política de Datos
            </Link>
            <Link href="/empresa#gobierno-corporativo" className="hover:text-white transition-colors">
              Gobierno Corporativo
            </Link>
            <Link href="/calidad" className="hover:text-white transition-colors">
              Sistema de Gestión
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
