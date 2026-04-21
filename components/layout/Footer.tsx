import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Linkedin } from 'lucide-react'

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-slate-950 text-white border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-14 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1.5fr] gap-10 md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Image
              src="/images/logo/logo-meisa-white.png"
              alt="MEISA"
              width={120}
              height={34}
              unoptimized
              className="w-[120px] h-auto mb-6"
            />
            <p className="text-white/50 font-lato text-sm max-w-sm leading-relaxed mb-6">
              Metálicas e Ingeniería S.A.S. — Diseño, fabricación y montaje de estructuras metálicas desde 1996.
            </p>
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

          <div>
            <h4 className="text-white/40 font-lato font-bold text-xs uppercase tracking-[0.2em] mb-5">
              Empresa
            </h4>
            <ul className="space-y-3 font-lato text-sm">
              <li>
                <Link href="/empresa" className="text-white/80 hover:text-white transition-colors">
                  Sobre MEISA
                </Link>
              </li>
              <li>
                <Link href="/procesos-tecnologias" className="text-white/80 hover:text-white transition-colors">
                  Tecnología
                </Link>
              </li>
              <li>
                <Link href="/politicas" className="text-white/80 hover:text-white transition-colors">
                  Calidad y Certificaciones
                </Link>
              </li>
              <li>
                <Link href="/proyectos" className="text-white/80 hover:text-white transition-colors">
                  Portfolio
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white/40 font-lato font-bold text-xs uppercase tracking-[0.2em] mb-5">
              Plantas
            </h4>
            <ul className="space-y-4 font-lato text-sm">
              <li>
                <p className="text-white font-semibold">Jamundí</p>
                <p className="text-white/50 text-xs leading-relaxed">Vía Panamericana 6 Sur – 195, Valle del Cauca</p>
              </li>
              <li>
                <p className="text-white font-semibold">Popayán</p>
                <p className="text-white/50 text-xs leading-relaxed">Bodega E13 Parque Industrial, Cauca</p>
              </li>
              <li>
                <p className="text-white font-semibold">Villa Rica</p>
                <p className="text-white/50 text-xs leading-relaxed">Vía Puerto Tejada, Cauca</p>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-14 md:mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="font-lato text-white/40 text-xs">
            © {year} MEISA Metálicas e Ingeniería S.A.S. · Todos los derechos reservados
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 font-lato text-white/40 text-xs">
            <a
              href="https://meisa.com.co/politica-tratamiento-datos/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Política de Datos
            </a>
            <a
              href="https://meisa.com.co/manual-sagrilaft/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              SAGRILAFT
            </a>
            <Link href="/politicas" className="hover:text-white transition-colors">
              Sistema de Gestión
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
