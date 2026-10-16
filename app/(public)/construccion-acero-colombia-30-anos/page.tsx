// Artículo SEO de los 30 años de MEISA (oct-2026). Texto entregado por mercadeo
// (María Antonia): no reescribir. Mismo lenguaje visual de las guías
// (GuiaTemplate), pero abre con el banner del aniversario a ancho completo —
// es blanco con el logo a la izquierda, así que no va como hero oscuro con el
// título encima.
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { BreadcrumbSchema } from '@/components/seo/JsonLdSchema'
import { OtrasGuias } from '@/components/guias/OtrasGuias'
import { WhatsAppCTA } from '@/components/contacto/WhatsAppCTA'

export const revalidate = 3600

const SITE_URL = 'https://meisa.com.co'
const PATH = '/construccion-acero-colombia-30-anos'
const IMG = 'https://storage.googleapis.com/meisa-imagenes/site/30-anos'
const OG_IMAGE = `${IMG}/og-construccion-acero-colombia-30-anos-meisa.jpg`
const FECHA = '2026-10-16'
const TITULO = 'Construcción en acero en Colombia: lo que aprendimos en 30 años'
const DESCRIPCION =
  'Tres décadas diseñando, fabricando y montando estructuras metálicas en Colombia. Nuestra historia en cinco hitos y lo que aprendimos en el camino.'

export const metadata: Metadata = {
  title: { absolute: 'Construcción en acero en Colombia: 30 años | MEISA' },
  description: DESCRIPCION,
  keywords: [
    'construcción en acero Colombia',
    'estructuras metálicas Colombia',
    'empresa de estructuras metálicas',
    'fabricación y montaje de estructuras metálicas',
    'estructuras metálicas NSR-10',
    'MEISA 30 años',
  ],
  alternates: { canonical: PATH },
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
  openGraph: {
    type: 'article',
    locale: 'es_CO',
    siteName: 'MEISA - Estructuras Metálicas Colombia',
    title: TITULO,
    description:
      'Tres décadas diseñando, fabricando y montando estructuras metálicas en Colombia. Nuestra historia en cinco hitos.',
    url: `${SITE_URL}${PATH}`,
    publishedTime: FECHA,
    modifiedTime: FECHA,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Logo 30 aniversario de MEISA y vista aérea de la Sede Principal Jamundí',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITULO,
    description: 'Tres décadas diseñando, fabricando y montando estructuras metálicas en Colombia.',
    images: [OG_IMAGE],
  },
}

const blogPosting = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: TITULO,
  description: DESCRIPCION,
  image: OG_IMAGE,
  inLanguage: 'es-CO',
  datePublished: FECHA,
  dateModified: FECHA,
  mainEntityOfPage: `${SITE_URL}${PATH}`,
  keywords: 'construcción en acero Colombia, estructuras metálicas Colombia, MEISA 30 años',
  author: { '@type': 'Organization', name: 'MEISA - Metálicas e Ingeniería S.A.S.', url: SITE_URL },
  publisher: {
    '@type': 'Organization',
    name: 'MEISA - Metálicas e Ingeniería S.A.S.',
    url: SITE_URL,
    logo: { '@type': 'ImageObject', url: `${IMG}/logo-30-anos-x-meisa.png` },
  },
}

// Orden y años de la línea de tiempo (imagen oficial del aniversario).
const HITOS: Array<{ periodo: string; titulo: string; texto: React.ReactNode; leccion: string }> = [
  {
    periodo: '1996',
    titulo: '1996 · Fundación: un taller de estructuras metálicas en Popayán',
    texto:
      'MEISA nace en Popayán, Cauca, como un taller especializado en estructuras metálicas. Desde el inicio, la visión fue ofrecer soluciones de calidad a la región suroccidental de Colombia.',
    leccion:
      'especializarse es una decisión que se sostiene en el tiempo. Treinta años después, el acero sigue siendo nuestro oficio.',
  },
  {
    periodo: '1998 – 2012',
    titulo: 'Primeras obras: dos coliseos en Popayán',
    texto: (
      <>
        Ese taller asume sus primeros proyectos de gran formato: el coliseo de la Universidad del
        Cauca y el Coliseo Mayor de los Juegos Nacionales en Popayán. Fueron obras que pusieron a
        prueba la capacidad de diseñar, fabricar y montar{' '}
        <TextoLink href="/soluciones/estructura-metalica-escenarios-deportivos">
          estructuras de gran escala
        </TextoLink>
        .
      </>
    ),
    leccion:
      'en acero, la precisión del taller se comprueba en el montaje. Una conexión bien fabricada ahorra días en obra; una mal fabricada los cuesta.',
  },
  {
    periodo: '2011',
    titulo: 'Jamundí: una segunda planta para crecer en escala',
    texto: (
      <>
        La confianza ganada impulsa el crecimiento. MEISA inaugura su segunda planta en Jamundí,
        hoy Sede Principal, y da el salto a{' '}
        <TextoLink href="/soluciones/estructura-metalica-centros-comerciales">
          centros comerciales
        </TextoLink>{' '}
        y <TextoLink href="/soluciones/puentes-metalicos">puentes</TextoLink> en otras regiones.
      </>
    ),
    leccion:
      'tener planta propia es tener control del proceso. Calidad, tiempos y trazabilidad dependen de nosotros, no de terceros.',
  },
  {
    periodo: '2021',
    titulo: 'Un equipo propio',
    texto:
      'Con cada obra crece también la gente. MEISA consolida un equipo propio de ingenieros, soldadores y montajistas que diseña, fabrica y monta cada proyecto de principio a fin. Hoy son más de 200 colaboradores.',
    leccion:
      'sin intermediarios, la responsabilidad no se diluye. Quien diseña conversa con quien fabrica, y quien fabrica conoce a quien monta.',
  },
  {
    periodo: '2026 – presente',
    titulo: 'Consolidación: tres plantas y tecnología BIM',
    texto:
      'Hoy, con la apertura de la Planta Villa Rica, MEISA opera tres plantas propias. En esta etapa incorpora tecnología BIM en proyectos como el Puente Ovejas, en la vía Cali–Popayán, donde se lanzaron 536 toneladas de estructura sobre torres de soporte.',
    leccion:
      'crecer en capacidad exige crecer en método. Cada planta trabaja con los mismos estándares de fabricación y control.',
  },
]

function TextoLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-slate-950 underline decoration-slate-300 underline-offset-4 transition-colors hover:decoration-red-600"
    >
      {children}
    </Link>
  )
}

const P = 'text-base md:text-lg text-slate-700 font-lato leading-relaxed text-pretty hyphens-auto'
const EYEBROW = 'text-slate-400 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4'
const H2 = 'text-4xl md:text-5xl lg:text-6xl font-bebas uppercase leading-[0.95] text-slate-950'

export default function Construccion30AnosPage() {
  return (
    <main className="bg-stone-50 text-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPosting) }}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Inicio', url: SITE_URL },
          { name: 'MEISA 30 años', url: `${SITE_URL}${PATH}` },
        ]}
      />

      <article>
        <header>
          {/* Banner del aniversario: completo, sin recorte (el logo va a la izquierda) */}
          <div className="bg-white">
            <Image
              src={`${IMG}/banner-30-anos-meisa-sede-jamundi.jpg`}
              alt="Logo 30 aniversario de MEISA junto a la vista aérea de la Sede Principal Jamundí, planta de fabricación de estructuras metálicas"
              width={1920}
              height={1080}
              priority
              sizes="100vw"
              className="w-full h-auto"
            />
          </div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 pt-16 md:pt-24">
            <p className={EYEBROW}>1996 — 2026 · 30 años de MEISA</p>
            <h1 className="max-w-5xl font-bebas uppercase leading-[0.95] text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-slate-950">
              Construcción en acero en Colombia:{' '}
              <span className="text-slate-300">lo que aprendimos en 30 años</span>
            </h1>
          </div>
        </header>

        {/* Introducción */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <div className="max-w-3xl space-y-5" lang="es">
              <p className={P}>
                MEISA nació en Popayán en 1996. Treinta años después, diseñamos, fabricamos y
                montamos estructuras metálicas desde{' '}
                <TextoLink href="/empresa">tres plantas propias</TextoLink>: Sede Principal
                Jamundí, Planta Popayán y Planta Villa Rica. Somos más de 200 colaboradores y hemos
                ejecutado <TextoLink href="/proyectos">más de 250 proyectos</TextoLink> en todo el
                país.
              </p>
              <p className={P}>
                Este recorrido también cuenta cómo ha cambiado la construcción en acero en
                Colombia. Pasamos del plano en papel a la ingeniería de detalle en BIM, del corte
                manual al corte CNC y de la soldadura de oficio a la soldadura calificada bajo
                norma AWS.
              </p>
              <p className={P}>
                Estos son los cinco momentos que nos trajeron hasta aquí y lo que aprendimos en
                cada uno.
              </p>
            </div>
          </div>
        </section>

        {/* Hitos */}
        <section className="pb-20 md:pb-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <div className="mb-10 md:mb-14 max-w-4xl">
              <p className={EYEBROW}>Nuestra historia</p>
              <h2 className={H2}>De Popayán a tres plantas: nuestra historia en cinco hitos</h2>
            </div>

            <ol className="border-t border-slate-200">
              {HITOS.map((hito, i) => (
                <li
                  key={hito.titulo}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-16 py-10 md:py-12 border-b border-slate-200"
                >
                  <div className="lg:col-span-4">
                    <span className="block font-bebas text-5xl md:text-6xl leading-none text-slate-300">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="mt-3 text-red-600 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.2em]">
                      {hito.periodo}
                    </p>
                  </div>
                  <div className="lg:col-span-8 space-y-4" lang="es">
                    <h3 className="text-2xl md:text-3xl font-bebas uppercase leading-[0.95] text-slate-950">
                      {hito.titulo}
                    </h3>
                    <p className={P}>{hito.texto}</p>
                    <p className={P}>
                      <strong className="text-slate-950">Lo que aprendimos:</strong> {hito.leccion}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <figure className="mt-14 md:mt-20">
              <Image
                src={`${IMG}/linea-de-tiempo-meisa-30-anos.jpg`}
                alt="Línea de tiempo 30 años de estructura de MEISA: fundación en Popayán en 1996, primeras obras entre 1998 y 2012, planta de Jamundí en 2011, un equipo propio en 2021 y la consolidación con tres plantas hasta hoy"
                width={2400}
                height={1200}
                sizes="(max-width: 1280px) 100vw, 1200px"
                className="w-full h-auto border border-slate-200 bg-white"
              />
              <figcaption className="mt-4 text-slate-500 font-lato text-sm md:text-base">
                30 años de estructura: los cinco hitos de MEISA. Conozca el detalle año a año en{' '}
                <TextoLink href="/trayectoria">nuestra trayectoria</TextoLink>.
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Qué ha cambiado */}
        <section className="pb-20 md:pb-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
              <div className="lg:col-span-5">
                <p className={EYEBROW}>Tres décadas de cambio</p>
                <h2 className={H2}>Qué ha cambiado en la construcción en acero en Colombia</h2>
              </div>
              <div className="lg:col-span-7 lg:pt-6 space-y-5" lang="es">
                <p className={P}>
                  En tres décadas, la estructura metálica pasó de ser una alternativa a ser la
                  solución de muchos puentes, cubiertas, naves industriales y centros comerciales
                  del país. Lo vimos desde la planta y desde la obra.
                </p>
                <p className={P}>
                  El primer gran cambio llegó a la ingeniería. Los planos en 2D dieron paso a
                  modelos 3D en BIM, con herramientas como Tekla, donde cada pieza, conexión y
                  perno queda definido antes de fabricar. Así se reducen las interferencias y los
                  reprocesos en obra.
                </p>
                <p className={P}>
                  En el taller, el corte manual dio paso al{' '}
                  <TextoLink href="/procesos-tecnologias">
                    corte por control numérico (CNC)
                  </TextoLink>
                  , que lleva a la lámina la geometría exacta del modelo. Esa precisión se nota en
                  el montaje: las conexiones encajan a la primera y los tiempos en sitio se
                  acortan.
                </p>
                <p className={P}>
                  La soldadura también se profesionalizó. Hoy se ejecuta con procedimientos y
                  soldadores calificados bajo la norma AWS D1.1, y la{' '}
                  <TextoLink href="/calidad">calidad</TextoLink> de cada cordón se especifica, se
                  inspecciona y se documenta.
                </p>
                <p className={P}>
                  Las exigencias técnicas crecieron con el país. Colombia tiene amenaza sísmica y
                  el Título F de la NSR-10 regula el diseño de estructuras metálicas. La ductilidad
                  del acero lo hace adecuado para estructuras que deben responder ante un sismo.
                </p>
                <p className={P}>
                  Por último, cada vez más trabajo se resuelve en planta. Fabricar y premontar
                  antes de llegar a obra acorta los tiempos en sitio, mejora la seguridad y
                  convierte el montaje en un ensamble planificado.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Integralidad */}
        <section className="pb-20 md:pb-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <div className="mb-10 md:mb-14 max-w-4xl space-y-5" lang="es">
              <p className={EYEBROW}>Una sola responsabilidad</p>
              <h2 className={H2}>Diseño, fabricación y montaje bajo una sola responsabilidad</h2>
              <p className={P}>
                La lección que atraviesa estos 30 años es que un proyecto en acero funciona mejor
                cuando una sola empresa responde por todo el proceso. En MEISA,{' '}
                <TextoLink href="/servicios/consultoria-en-diseno-estructural">ingeniería</TextoLink>
                ,{' '}
                <TextoLink href="/servicios/fabricacion-de-estructuras-metalicas">planta</TextoLink>{' '}
                y <TextoLink href="/servicios/montaje-de-estructuras">montaje</TextoLink> son
                equipos propios.
              </p>
              <p className={P}>Para el cliente, eso se traduce en:</p>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200">
              {[
                ['Un solo interlocutor', 'desde el diseño hasta la entrega en obra.'],
                ['Coordinación directa', 'entre quien modela la estructura y quien la fabrica.'],
                ['Trazabilidad', 'de cada pieza, desde la lámina hasta el montaje.'],
                ['Responsabilidad clara', 'sobre plazos, calidad y seguridad.'],
              ].map(([fuerte, resto], i) => (
                <li key={fuerte} className="bg-white p-8 md:p-10">
                  <span className="block text-slate-300 font-bebas text-4xl md:text-5xl leading-none mb-4">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-slate-700 font-lato text-sm md:text-base leading-relaxed">
                    <strong className="block text-xl md:text-2xl font-bebas uppercase font-normal leading-[0.95] text-slate-950 mb-2">
                      {fuerte}
                    </strong>
                    {resto}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Lo que viene + cierre */}
        <section className="pb-20 md:pb-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
              <div className="lg:col-span-5">
                <p className={EYEBROW}>Hacia adelante</p>
                <h2 className={H2}>Lo que viene</h2>
              </div>
              <div className="lg:col-span-7 lg:pt-6 space-y-5" lang="es">
                <p className={P}>
                  Los próximos años de MEISA siguen la misma línea: más ingeniería de detalle, más
                  control en planta y más proyectos que mueven al país. Seguimos invirtiendo en
                  tecnología, en nuestras plantas y en nuestra gente para asumir proyectos de mayor
                  complejidad.
                </p>
                <p className={P}>
                  Treinta años de estructura nos dejan una convicción: la confianza se construye
                  con entregas, no con adjetivos.
                </p>
              </div>
            </div>

            {/* Logo combinado: fondo blanco, nunca sobre color ni foto */}
            <div className="mt-14 md:mt-20 bg-white border border-slate-200 flex justify-center py-10 md:py-14 px-6">
              <Image
                src={`${IMG}/logo-30-anos-x-meisa.png`}
                alt="Logo 30 aniversario y logo de MEISA, Metálicas e Ingeniería S.A.S."
                width={1200}
                height={675}
                sizes="(max-width: 640px) 90vw, 560px"
                className="w-full max-w-[560px] h-auto"
              />
            </div>
          </div>
        </section>
      </article>

      <OtrasGuias currentPath={PATH} />

      {/* CTA final — mismo patrón oscuro de las guías */}
      <section className="relative bg-slate-950 text-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="max-w-4xl mb-10 md:mb-12">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas uppercase leading-[0.95]">
              ¿Tiene un proyecto en estructura metálica?
            </h2>
            <p className="mt-6 text-white/60 font-lato text-base md:text-lg max-w-2xl leading-relaxed">
              Envíenos sus planos y reciba una cotización de nuestro equipo de ingeniería.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Link
              href="/contacto"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-red-600 text-white font-lato font-bold text-sm md:text-base uppercase tracking-wider transition-colors duration-300 hover:bg-red-700"
            >
              Solicitar cotización
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <WhatsAppCTA
              origen={`articulo:${PATH}`}
              mensaje="Hola MEISA, leí el artículo de los 30 años y quisiera cotizar un proyecto."
            />
          </div>
        </div>
      </section>
    </main>
  )
}
