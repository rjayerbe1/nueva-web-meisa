import Link from "next/link"
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Información de la empresa */}
          <div>
            <h3 className="text-2xl font-bold mb-4">MEISA</h3>
            <p className="text-gray-400 mb-4">
              Metálicas e Ingeniería S.A.S. - Especialistas en brindar un servicio integral 
              al cliente con más de 29 años de experiencia desde 1996.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/Metalicaseingenieria" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/meisa.s.a.s" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/servicios" className="text-gray-400 hover:text-white transition-colors">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="/proyectos" className="text-gray-400 hover:text-white transition-colors">
                  Proyectos
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="text-gray-400 hover:text-white transition-colors">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-400 hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Servicios */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Nuestros Servicios</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Consultoría en Diseño Estructural</li>
              <li>Fabricación de Estructuras Metálicas</li>
              <li>Montaje de Estructuras Metálicas</li>
              <li>Construcción de Obras Civiles</li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <p className="text-gray-400 text-sm">
                  Vía Panamericana 6 Sur – 195<br />
                  Jamundí, Valle del Cauca<br />
                  <span className="text-xs">(Sede Principal)</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <p className="text-gray-400 text-sm">
                  PBX: +57 (2) 312 0050-51-52-53<br />
                  Móvil: +57 (310) 432 7227
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <p className="text-gray-400 text-sm">contacto@meisa.com.co</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} MEISA - Metálicas e Ingeniería S.A.S. Todos los derechos reservados.</p>
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
          </div>
        </div>
      </div>
    </footer>
  )
}