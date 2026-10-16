// Bloque de campaña de los 30 años (oct-2026): lleva al artículo
// /construccion-acero-colombia-30-anos. Se enciende/apaga desde
// /admin/home → Orden de secciones (clave 'aniversario-30').
import Image from 'next/image'
import Link from 'next/link'

const LOGO =
  'https://storage.googleapis.com/meisa-imagenes/site/30-anos/logo-30-anos-x-meisa.png'

export function Aniversario30Section() {
  return (
    <div className="bg-white border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 py-14 md:py-24 flex flex-col lg:flex-row items-center gap-8 lg:gap-20">
        {/* Logo combinado: fondo blanco, nunca sobre color ni foto */}
        <Image
          src={LOGO}
          alt="Logo 30 aniversario y logo de MEISA, Metálicas e Ingeniería S.A.S."
          width={1200}
          height={675}
          sizes="(max-width: 1024px) 90vw, 520px"
          className="w-full max-w-[520px] h-auto flex-none"
        />
        <div className="max-w-xl w-full">
          <p className="text-red-600 font-lato font-bold text-xs md:text-sm uppercase tracking-[0.25em] mb-4">
            1996 — 2026
          </p>
          <h2 className="font-bebas uppercase leading-[0.95] text-5xl md:text-6xl lg:text-7xl text-slate-950 mb-5">
            30 años de estructura
          </h2>
          <p className="text-slate-600 font-lato text-base md:text-lg leading-relaxed mb-8">
            De un taller en Popayán a tres plantas propias. Nuestra historia en cinco hitos y lo
            que aprendimos en el camino.
          </p>
          <Link
            href="/construccion-acero-colombia-30-anos"
            className="group inline-flex items-center gap-3 bg-slate-950 text-white px-7 py-4 font-lato font-bold text-sm uppercase tracking-[0.18em] transition-colors duration-300 hover:bg-slate-800"
          >
            Leer la historia
            <span className="text-red-600 transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
