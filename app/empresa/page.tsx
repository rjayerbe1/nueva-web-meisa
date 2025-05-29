import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { siteConfig } from '@/lib/site-config'
import { Building2, Target, Eye, Heart, Shield, FileText, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Nuestra Empresa | MEISA',
  description: siteConfig.empresa.descripcion,
}

export default function EmpresaPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-blue-100/20">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              {siteConfig.empresa.nombre}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {siteConfig.empresa.descripcion}
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                href="/contacto"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Contáctanos
              </Link>
              <Link href="/proyectos" className="text-sm font-semibold leading-6 text-gray-900">
                Ver proyectos <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <div className="relative h-[400px] w-[600px] rounded-md bg-gray-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Building2 className="h-24 w-24 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historia */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Nuestra Historia</h2>
          <div className="mt-6 space-y-6 text-lg leading-8 text-gray-600">
            <p>{siteConfig.empresa.historia}</p>
            <p>
              Con el objeto de lograr una mayor competitividad y continuar brindando productos y servicios de calidad, 
              nuestra empresa año a año ha incorporado talento humano altamente competente, máquinas y equipos de última 
              tecnología, permitiéndonos ser cada vez más eficientes en los tiempos de entrega y en la reducción de 
              costos de los proyectos.
            </p>
            <p>
              Se inauguró la segunda planta de producción en la ciudad de Jamundí, duplicando la capacidad de producción 
              a {siteConfig.estadisticas.toneladas} toneladas/mes.
            </p>
          </div>
        </div>
      </div>

      {/* Misión y Visión */}
      <div className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <Target className="h-10 w-10 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Nuestra Misión</h2>
                </div>
                <p className="text-lg leading-8 text-gray-600">
                  {siteConfig.empresa.mision}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <Eye className="h-10 w-10 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Nuestra Visión</h2>
                </div>
                <p className="text-lg leading-8 text-gray-600">
                  {siteConfig.empresa.vision}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Valores */}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Heart className="h-10 w-10 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Nuestros Valores</h2>
          </div>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-4 lg:gap-y-16">
            {siteConfig.empresa.valores.map((valor) => (
              <div key={valor} className="text-center">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  {valor}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Política Integrada */}
      <div className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="flex items-center gap-4 mb-8">
              <Shield className="h-10 w-10 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Política Integrada de Gestión</h2>
            </div>
            <p className="text-lg leading-8 text-gray-600 mb-8">
              {siteConfig.empresa.politicaIntegrada}
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Nuestros Objetivos:</h3>
            <ul className="space-y-4">
              {siteConfig.empresa.objetivos.map((objetivo, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-3">•</span>
                  <span className="text-gray-600">{objetivo}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Gobierno Corporativo */}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="flex items-center gap-4 mb-8">
            <FileText className="h-10 w-10 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Gobierno Corporativo</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Manual de Sagrilaft</h3>
              <p className="text-sm text-gray-600 mb-4">
                Mediante la cual MEISA establece las políticas para la mitigación del riesgo de LAVADO DE ACTIVOS 
                Y FINANCIACIÓN DEL TERRORISMO.
              </p>
              <Link
                href="/manual-sagrilaft"
                className="text-blue-600 hover:text-blue-500 text-sm font-medium"
              >
                Abrir PDF →
              </Link>
            </div>
            
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Política del programa de Transparencia y Ética Empresarial
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Mediante el cual MEISA establece la política para mitigar los riesgos de corrupción y soborno 
                transnacional.
              </p>
              <Link
                href="/politica-programa"
                className="text-blue-600 hover:text-blue-500 text-sm font-medium"
              >
                Abrir PDF →
              </Link>
            </div>
            
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Política de tratamiento de datos</h3>
              <p className="text-sm text-gray-600 mb-4">
                MEISA establece la Política para el Tratamiento de los Datos Personales, la cual refleja los 
                principios y reglas establecidas en el Régimen General de Protección de Datos Personales.
              </p>
              <Link
                href="/politica-tratamiento-datos"
                className="text-blue-600 hover:text-blue-500 text-sm font-medium"
              >
                Abrir PDF →
              </Link>
            </div>
          </div>

          <div className="mt-12 rounded-lg bg-blue-50 border border-blue-200 p-6">
            <div className="flex items-start">
              <AlertCircle className="h-6 w-6 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Canal de Denuncias</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Mediante este formulario colaboradores, clientes y proveedores, podrán informar de manera segura 
                  y confiable cualquier situación ética o reporte de operación sospechosa relacionada con el riesgo 
                  de lavado de activos.
                </p>
                <Link
                  href="/contacto"
                  className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                >
                  Acceder al formulario →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}