"use client"

import { useRef } from "react"
import { Film, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Media } from "@prisma/client"

/**
 * Thumbnail compartida entre MediaManager y MediaPicker.
 * - Imágenes: object-cover con aspect-ratio capado entre 3:4 y 5:3.
 * - Videos: <video> real con preload="metadata" (muestra primer frame);
 *   al hover reproduce en silencio.
 * - Documentos: icono FileText.
 */
export function MediaThumb({
  media,
  className,
}: {
  media: Media
  className?: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  const w = media.width ?? 0
  const h = media.height ?? 0
  // Cap aspect ratio para no tener columnas desproporcionadas
  const ratio = w && h ? Math.max(3 / 4, Math.min(5 / 3, w / h)) : 1

  const onMouseEnter = () => {
    videoRef.current?.play().catch(() => {})
  }
  const onMouseLeave = () => {
    const v = videoRef.current
    if (!v) return
    v.pause()
    v.currentTime = 0
  }

  if (media.kind === "VIDEO") {
    return (
      <div
        className={cn("relative w-full overflow-hidden bg-slate-950", className)}
        style={{ aspectRatio: "16 / 9" }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <video
          ref={videoRef}
          src={media.url}
          muted
          playsInline
          loop
          preload="metadata"
          className="h-full w-full object-cover"
        />
        <span className="absolute left-2 top-2 flex items-center gap-1 rounded-none bg-black/70 px-1.5 py-0.5 font-lato text-[9px] font-bold uppercase tracking-wider text-white">
          <Film className="h-2.5 w-2.5" />
          Video
        </span>
      </div>
    )
  }

  if (media.kind === "DOC") {
    return (
      <div
        className={cn(
          "flex w-full items-center justify-center bg-slate-100 text-slate-400",
          className,
        )}
        style={{ aspectRatio: "4 / 3" }}
      >
        <FileText className="h-10 w-10" />
      </div>
    )
  }

  return (
    <div
      className={cn("relative w-full overflow-hidden bg-slate-100", className)}
      style={{ aspectRatio: `${ratio}` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={media.url}
        alt={media.altText ?? ""}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-300"
      />
    </div>
  )
}
