"use client"

import dynamic from "next/dynamic"

// El visor se carga SOLO en cliente (ssr:false). Antes el ssr:false estaba sobre
// react-pageflip dentro del visor, lo que rompía el ref hacia su API imperativa
// (los botones/teclado no navegaban). Al mover el límite ssr:false aquí, el visor
// importa react-pageflip de forma estática y el ref queda directo y funcional.
// Nota: ssr:false no se permite en Server Components, por eso este wrapper es "use client".
const PdfFlipbookViewer = dynamic(
  () => import("./PdfFlipbookViewer").then((m) => m.PdfFlipbookViewer),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-black flex items-center justify-center text-white/70 font-lato text-sm uppercase tracking-widest">
        Cargando documento…
      </div>
    ),
  },
)

export function PdfViewerClient(props: { pdfUrl: string; titulo: string }) {
  return <PdfFlipbookViewer {...props} />
}
