'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'

interface VideoDestacadoProps {
  videoId: string
  poster: string
  title: string
}

/**
 * Embed "facade" de YouTube para performance/SEO:
 * muestra solo el póster (imagen) + botón de play; el iframe pesado de
 * YouTube (youtube-nocookie) se monta únicamente cuando el usuario da play.
 * Así la página no carga el reproductor en el LCP inicial.
 */
export function VideoDestacado({ videoId, poster, title }: VideoDestacadoProps) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-slate-950 border border-slate-200">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Reproducir video: ${title}`}
          className="group absolute inset-0 h-full w-full"
        >
          <Image
            src={poster}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 1280px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/25 transition-colors duration-300 group-hover:bg-slate-950/10" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-20 w-20 items-center justify-center bg-red-600 transition-colors duration-300 group-hover:bg-red-700 md:h-24 md:w-24">
              <Play className="ml-1 h-8 w-8 fill-white text-white md:h-10 md:w-10" />
            </span>
          </span>
        </button>
      )}
    </div>
  )
}
