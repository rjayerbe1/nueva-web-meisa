/**
 * Deriva la URL del poster (frame estático) de un video del bucket MEISA.
 *
 * Convención: cada `<nombre>.mp4` tiene un `<nombre>.poster.jpg` generado con
 * ffmpeg y subido al mismo path en gs://meisa-imagenes. El poster sirve de
 * fallback cuando el navegador no reproduce el video — sobre todo iOS Safari
 * en Modo de bajo consumo, que bloquea el autoplay y deja el video en blanco.
 *
 * Al subir un video nuevo hay que generar su poster (ver scripts/gen-posters).
 * Si el poster no existe, el atributo apunta a un 404 y el navegador
 * simplemente no muestra nada — el mismo comportamiento que sin poster.
 */
export function videoPoster(videoUrl: string | null | undefined): string | undefined {
  if (!videoUrl || !videoUrl.endsWith('.mp4')) return undefined
  return videoUrl.replace(/\.mp4$/, '.poster.jpg')
}
