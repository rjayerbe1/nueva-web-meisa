"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import HTMLFlipBookBase from "react-pageflip"
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  LayoutGrid,
  X,
} from "lucide-react"

// react-pageflip importado estático. Este componente solo se carga en cliente
// (vía PdfViewerClient con dynamic ssr:false), así el ref a HTMLFlipBook es
// directo y su API imperativa (pageFlip().flip/flipNext) funciona.
const HTMLFlipBook = HTMLFlipBookBase as any

interface PdfFlipbookViewerProps {
  pdfUrl: string
  titulo: string
}

const RENDER_RADIUS = 2

export function PdfFlipbookViewer({ pdfUrl, titulo }: PdfFlipbookViewerProps) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const flipbookRef = useRef<any>(null)
  const pdfRef = useRef<any>(null)

  const [numPages, setNumPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pageDims, setPageDims] = useState<{ width: number; height: number } | null>(null)
  const [pageImages, setPageImages] = useState<Map<number, string>>(new Map())
  const [thumbs, setThumbs] = useState<Map<number, string>>(new Map())
  const [currentPage, setCurrentPage] = useState(1)
  const [showThumbs, setShowThumbs] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [viewport, setViewport] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const onResize = () =>
      setViewport({ w: window.innerWidth, h: window.innerHeight })
    onResize()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const pdfjs: any = await import("pdfjs-dist")
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"
        // Descarga única y completa (sin rangos ni streaming): compatible con el
        // proxy /api/documento que sirve el PDF bufferizado en una sola respuesta.
        const task = pdfjs.getDocument({
          url: pdfUrl,
          disableRange: true,
          disableStream: true,
        })
        const pdf = await task.promise
        if (cancelled) return
        const first = await pdf.getPage(1)
        const vp = first.getViewport({ scale: 1 })
        if (cancelled) return
        pdfRef.current = pdf
        setPageDims({ width: vp.width, height: vp.height })
        setNumPages(pdf.numPages)
        setLoading(false)
      } catch (err: any) {
        console.error("[brochure] PDF load error", err)
        if (!cancelled) {
          setError(err?.message || "No se pudo cargar el PDF")
          setLoading(false)
        }
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [pdfUrl])

  const renderPage = useCallback(
    async (pageNum: number, scale = 1.5): Promise<string | null> => {
      const pdf = pdfRef.current
      if (!pdf) return null
      try {
        const page = await pdf.getPage(pageNum)
        const vp = page.getViewport({ scale })
        const canvas = document.createElement("canvas")
        canvas.width = vp.width
        canvas.height = vp.height
        const ctx = canvas.getContext("2d")
        if (!ctx) return null
        await page.render({ canvasContext: ctx, viewport: vp }).promise
        return canvas.toDataURL("image/jpeg", 0.85)
      } catch (err) {
        console.error(`[brochure] page ${pageNum} render error`, err)
        return null
      }
    },
    [],
  )

  useEffect(() => {
    if (!numPages) return
    const start = Math.max(1, currentPage - RENDER_RADIUS)
    const end = Math.min(numPages, currentPage + RENDER_RADIUS + 1)
    for (let n = start; n <= end; n++) {
      if (!pageImages.has(n)) {
        renderPage(n, 1.6).then((url) => {
          if (url) {
            setPageImages((prev) => {
              if (prev.has(n)) return prev
              const next = new Map(prev)
              next.set(n, url)
              return next
            })
          }
        })
      }
    }
  }, [numPages, currentPage, renderPage, pageImages])

  useEffect(() => {
    if (!numPages) return
    let cancelled = false
    ;(async () => {
      for (let n = 1; n <= numPages; n++) {
        if (cancelled) return
        if (thumbs.has(n)) continue
        const url = await renderPage(n, 0.25)
        if (url && !cancelled) {
          setThumbs((prev) => {
            const next = new Map(prev)
            next.set(n, url)
            return next
          })
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [numPages, renderPage, thumbs])

  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener("fullscreenchange", onFs)
    return () => document.removeEventListener("fullscreenchange", onFs)
  }, [])

  // Solo-lectura: bloquear guardar (Ctrl/Cmd+S) e imprimir (Ctrl/Cmd+P)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if ((e.ctrlKey || e.metaKey) && (k === "s" || k === "p")) {
        e.preventDefault()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const toggleFullscreen = () => {
    const el = containerRef.current
    if (!el) return
    if (!document.fullscreenElement) el.requestFullscreen?.()
    else document.exitFullscreen?.()
  }

  // Cerrar = volver a la página desde donde se abrió el brochure.
  // 1) ?from=<ruta interna> (lo pasa el enlace "Brochure" de la categoría) → ruta
  //    explícita; nunca abandona el sitio y aterriza en la categoría exacta.
  // 2) Si hay histórico de navegación interna → router.back() (pop limpio).
  // 3) Fallback (pestaña nueva del admin / enlace directo) → /proyectos.
  const handleClose = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.()
    }
    const from = new URLSearchParams(window.location.search).get("from")
    if (from && from.startsWith("/") && !from.startsWith("//")) {
      router.push(from)
      return
    }
    if (window.history.length > 1) {
      router.back()
      return
    }
    router.push("/proyectos")
  }, [router])

  const onFlip = (e: any) => setCurrentPage((e?.data ?? 0) + 1)
  const flipApi = () => flipbookRef.current?.pageFlip?.()
  // flipNext()/flipPrev() avanzan/retroceden UN spread sin aritmética de índices
  // (con showCover={false} no hay tapa dura especial, así que funcionan desde la
  // página 1). flip(n) se reserva para saltar a una página concreta (miniaturas).
  const goNext = () => flipApi()?.flipNext()
  const goPrev = () => flipApi()?.flipPrev()
  const goTo = (n: number) => {
    flipApi()?.flip(n - 1)
    setShowThumbs(false)
  }

  // Navegación con teclado (← →) — alternativa fiable a las flechas del footer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault()
        flipbookRef.current?.pageFlip?.()?.flipNext()
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        flipbookRef.current?.pageFlip?.()?.flipPrev()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // Esc cierra el visor. Si está en pantalla completa, dejamos que el navegador
  // gestione el Esc (sale de fullscreen) y NO cerramos: hace falta un 2º Esc.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.fullscreenElement) {
        e.preventDefault()
        handleClose()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [handleClose])

  const aspect = pageDims ? pageDims.height / pageDims.width : 1.414
  const isMobile = viewport.w > 0 && viewport.w < 768
  const headerH = 64
  const footerH = 56
  const sidePad = isMobile ? 16 : 64
  const availH = Math.max(300, viewport.h - headerH - footerH - 32)
  const availW = Math.max(280, viewport.w - sidePad * 2)
  const spreadW = isMobile ? availW : availW * 0.95
  const pageW = isMobile ? spreadW : spreadW / 2
  const pageH = pageW * aspect
  const finalPageH = Math.min(pageH, availH)
  const finalPageW = finalPageH / aspect

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white/70 font-lato text-sm uppercase tracking-widest">
        Cargando brochure…
      </div>
    )
  }

  if (error || !pageDims || !numPages) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white/70 font-lato text-sm">
        {error || "PDF no disponible"}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      onContextMenu={(e) => e.preventDefault()}
      className="relative min-h-screen w-full bg-black overflow-hidden flex flex-col select-none"
    >
      {/* Solo-lectura: ocultar al imprimir */}
      <style
        dangerouslySetInnerHTML={{
          __html: "@media print { body { display: none !important; } }",
        }}
      />
      {/* HEADER */}
      <div
        className="relative z-20 flex items-center justify-between px-4 md:px-6 border-b border-white/10"
        style={{ height: headerH }}
      >
        <h1 className="font-bebas text-white text-base md:text-xl uppercase tracking-[0.15em] truncate pr-4">
          {titulo}
        </h1>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowThumbs((s) => !s)}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 transition"
            title="Miniaturas"
            aria-label="Mostrar miniaturas"
          >
            <LayoutGrid className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)))}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 transition"
            title="Reducir"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.min(2, +(z + 0.1).toFixed(2)))}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 transition"
            title="Ampliar"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 transition"
            title="Pantalla completa"
            aria-label="Pantalla completa"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 md:w-5 md:h-5" />
            ) : (
              <Maximize2 className="w-4 h-4 md:w-5 md:h-5" />
            )}
          </button>

          <div className="w-px h-5 bg-white/15 mx-1" aria-hidden />

          <button
            onClick={handleClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 transition"
            title="Cerrar (Esc)"
            aria-label="Cerrar brochure"
          >
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      {/* FLIPBOOK */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <div
          style={{
            transform: `scale(${zoom})`,
            transition: "transform 0.2s ease-out",
            transformOrigin: "center center",
          }}
        >
          <HTMLFlipBook
            ref={flipbookRef}
            width={finalPageW}
            height={finalPageH}
            size="fixed"
            minWidth={200}
            maxWidth={1200}
            minHeight={300}
            maxHeight={1800}
            drawShadow
            flippingTime={700}
            usePortrait={isMobile}
            startPage={0}
            // showCover desactivado: con showCover la portada es una "tapa dura"
            // especial desde la que react-pageflip NO deja navegar (ni por API ni
            // por clic). Sin él, la página 1 es una página normal y el avance
            // funciona desde el inicio.
            showCover={false}
            mobileScrollSupport
            clickEventForward
            useMouseEvents
            swipeDistance={30}
            showPageCorners
            disableFlipByClick={false}
            maxShadowOpacity={0.4}
            startZIndex={0}
            autoSize={false}
            onFlip={onFlip}
            className="brochure-flipbook"
            style={{}}
          >
            {Array.from({ length: numPages }, (_, i) => i + 1).map((n) => (
              <div key={n} className="bg-white">
                {pageImages.get(n) ? (
                  <img
                    src={pageImages.get(n) as string}
                    alt={`Página ${n}`}
                    className="w-full h-full object-contain pointer-events-none select-none"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 font-lato text-xs uppercase tracking-widest">
                    p. {n}
                  </div>
                )}
              </div>
            ))}
          </HTMLFlipBook>
        </div>
      </div>

      {/* FOOTER */}
      <div
        className="relative z-20 flex items-center justify-center gap-4 md:gap-6 px-4 border-t border-white/10"
        style={{ height: footerH }}
      >
        <button
          onClick={goPrev}
          className="p-2 text-white/80 hover:text-white hover:bg-white/10 transition"
          title="Anterior"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-lato text-white text-xs md:text-sm tabular-nums uppercase tracking-widest">
          {currentPage} / {numPages}
        </span>
        <button
          onClick={goNext}
          className="p-2 text-white/80 hover:text-white hover:bg-white/10 transition"
          title="Siguiente"
          aria-label="Siguiente"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* THUMBS */}
      {showThumbs && (
        <div className="absolute top-0 right-0 bottom-0 w-72 md:w-80 bg-black border-l border-white/10 z-30 flex flex-col">
          <div className="flex items-center justify-between px-4 border-b border-white/10" style={{ height: headerH }}>
            <h2 className="font-bebas text-white text-base uppercase tracking-[0.15em]">
              Páginas
            </h2>
            <button
              onClick={() => setShowThumbs(false)}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 transition"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: numPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => goTo(n)}
                  className={`relative bg-white/5 overflow-hidden transition border ${
                    currentPage === n
                      ? "border-white"
                      : "border-transparent hover:border-white/40"
                  }`}
                  style={{ aspectRatio: `${1 / aspect}` }}
                  aria-label={`Ir a página ${n}`}
                >
                  {thumbs.get(n) ? (
                    <img
                      src={thumbs.get(n) as string}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/30 text-xs">
                      {n}
                    </div>
                  )}
                  <span className="absolute bottom-1 right-1 text-white text-[10px] bg-black/70 px-1 font-lato tabular-nums">
                    {n}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
