import Link from "next/link"
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react"
import { siteConfig } from "@/lib/site-config"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Información de la empresa */}
          <div>
            <h3 className="text-2xl font-bold mb-4">MEISA</h3>
            <p className="text-gray-400 mb-4">
              Metálicas e Ingeniería S.A.S. - Líderes en diseño, fabricación y montaje de estructuras metálicas.
              <span className="text-blue-400 font-semibold"> Más de {siteConfig.aniosExperiencia} años</span> construyendo el futuro de Colombia.
            </p>
            
            {/* Trust badges */}
            <div className="mb-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-blue-400 font-bold">600</span>
                <span>Ton/Mes de capacidad</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-blue-400 font-bold">3</span>
                <span>Plantas de producción</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-blue-400 font-bold">320+</span>
                <span>Personas en nuestro equipo</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/Metalicaseingenieria" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/meisa.s.a.s" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Instagram className="w-5 h-5" />
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

          {/* Servicios */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Servicios</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Diseño Estructural con BIM</li>
              <li>Fabricación 600 Ton/Mes</li>
              <li>Montaje Especializado</li>
              <li>Obra Civil Integral</li>
            </ul>
            
            <div className="mt-4 pt-4 border-t border-gray-800">
              <h5 className="text-sm font-semibold text-gray-300 mb-2">Sectores que Atendemos:</h5>
              <ul className="space-y-1 text-xs text-gray-400">
                <li>• Centros Comerciales</li>
                <li>• Infraestructura Vial</li>
                <li>• Industria y Energía</li>
                <li>• Edificios Institucionales</li>
              </ul>
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
            
            <div className="mt-4 pt-4 border-t border-gray-800">
              <h5 className="text-sm font-semibold text-gray-300 mb-2">Ubicaciones:</h5>
              <ul className="space-y-1 text-xs text-gray-400">
                <li>📍 Popayán, Cauca</li>
                <li>📍 Jamundí, Valle</li>
                <li>📍 Villa Rica, Cauca</li>
              </ul>
            </div>

            <div className="mt-4">
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
          
          {/* Trust Elements */}
          <div className="mt-4 flex flex-wrap justify-center items-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <span className="text-green-400">✓</span>
              <span>+{siteConfig.aniosExperiencia} años de experiencia</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-green-400">✓</span>
              <span>600 Ton/Mes capacidad</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-green-400">✓</span>
              <span>3 plantas de producción</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-green-400">✓</span>
              <span>Sistema Integrado de Gestión</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-green-400">✓</span>
              <span>Normas NSR-10</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}