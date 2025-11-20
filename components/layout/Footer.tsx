import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react"
import { siteConfig } from "@/lib/site-config"

// Ícono de X (Twitter)
const XIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1.3fr_1fr] gap-8">
          {/* Información de la empresa */}
          <div>
            <div className="mb-8">
              <Image
                src="/images/logo/logo-meisa-white.png"
                alt="MEISA"
                width={90}
                height={25}
                unoptimized
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>

            <div className="flex space-x-5">
              <a
                href="https://www.facebook.com/Metalicaseingenieria"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-7 h-7" />
              </a>
              <a
                href="https://www.instagram.com/meisa.s.a.s"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-7 h-7" />
              </a>
              <a
                href="https://co.linkedin.com/company/meisa-sas"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-7 h-7" />
              </a>
              <a
                href="https://x.com/meisa_sas"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-400 transition-colors"
                aria-label="X (Twitter)"
              >
                <XIcon className="w-7 h-7" />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/empresa" className="text-gray-400 hover:text-white transition-colors">
                  Sobre MEISA
                </Link>
              </li>
              <li>
                <Link href="/tecnologia" className="text-gray-400 hover:text-white transition-colors">
                  Tecnología
                </Link>
              </li>
              <li>
                <Link href="/calidad" className="text-gray-400 hover:text-white transition-colors">
                  Calidad y Certificaciones
                </Link>
              </li>
              <li>
                <Link href="/proyectos" className="text-gray-400 hover:text-white transition-colors">
                  Portfolio de Proyectos
                </Link>
              </li>
            </ul>
          </div>

          {/* Ubicaciones */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Nuestras Plantas</h4>
            <div className="space-y-4">
              <div>
                <h5 className="text-white font-medium mb-1">Jamundí</h5>
                <p className="text-gray-400 text-sm">
                  Vía Panamericana 6 Sur – 195, Valle del Cauca
                </p>
              </div>
              <div>
                <h5 className="text-white font-medium mb-1">Popayán</h5>
                <p className="text-gray-400 text-sm">
                  Bodega E13 Parque Industrial, Cauca
                </p>
              </div>
              <div>
                <h5 className="text-white font-medium mb-1">Villa Rica</h5>
                <p className="text-gray-400 text-sm">
                  Vía Puerto Tejada, Cauca
                </p>
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto Rápido</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <p className="text-gray-400 text-sm">
                  <span className="text-white font-medium">+57 (2) 312 0050</span><br />
                  <span className="text-xs">Lun-Vie: 7AM-5PM</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <p className="text-gray-400 text-sm">
                  <span className="text-white">contacto@meisa.com.co</span><br />
                  <span className="text-xs">Respuesta en 24h</span>
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Link 
                href="/contacto"
                className="inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                Solicitar Cotización
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} MEISA Metálicas e Ingeniería S.A.S. ® Todos los derechos reservados Colombia</p>
            <div className="mt-2 space-x-4">
              <a 
                href="https://meisa.com.co/politica-tratamiento-datos/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Política de Tratamiento de Datos
              </a>
              <span>|</span>
              <a 
                href="https://meisa.com.co/manual-sagrilaft/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Manual SAGRILAFT
              </a>
              <span>|</span>
              <Link 
                href="/calidad"
                className="hover:text-white transition-colors"
              >
                Sistema Integrado de Gestión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}