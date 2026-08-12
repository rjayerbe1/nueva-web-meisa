import { execFile } from "node:child_process"
import { promisify } from "node:util"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"

const exec = promisify(execFile)

/**
 * Conversión de hojas de vida en Word a PDF.
 *
 * El formulario público acepta .doc/.docx, pero **Vertex AI NO admite esos
 * mimeType como `inlineData`** y devuelve 400. El efecto era silencioso y feo:
 * el candidato quedaba guardado, con su CV a salvo, pero sin analizar — y por
 * lo tanto sin puntaje y FUERA de los informes de comparación. Un candidato
 * bueno podía perderse solo por mandar el CV en Word.
 *
 * Se convierte EN MEMORIA para analizar; el archivo original NO se toca (es el
 * documento que entregó la persona y debe conservarse tal cual).
 *
 * Estrategia: LibreOffice headless (respeta el formato) y, si no está
 * instalado, `textutil` + `cupsfilter` de macOS, que pierde maquetación pero
 * conserva el texto — que es lo único que necesita el modelo.
 */

const MIMES_WORD = new Set([
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
])

export function esWord(mimeType: string | null | undefined): boolean {
  return MIMES_WORD.has((mimeType ?? "").toLowerCase())
}

const SOFFICE = "/Applications/LibreOffice.app/Contents/MacOS/soffice"

async function existe(p: string): Promise<boolean> {
  try {
    await fs.access(p)
    return true
  } catch {
    return false
  }
}

/**
 * Devuelve el PDF equivalente, o `null` si no se pudo convertir (sin
 * herramientas disponibles o documento ilegible). Nunca lanza: el llamador
 * decide si sigue sin análisis.
 */
export async function wordAPdf(
  contenido: Buffer,
  nombreArchivo = "cv.docx",
): Promise<Buffer | null> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "meisa-cv-"))
  const ext = path.extname(nombreArchivo) || ".docx"
  const entrada = path.join(dir, `doc${ext}`)

  try {
    await fs.writeFile(entrada, contenido)

    if (await existe(SOFFICE)) {
      // -env:UserInstallation aísla el perfil: sin esto, dos conversiones
      // simultáneas chocan contra el mismo perfil de usuario y una falla.
      await exec(SOFFICE, [
        "--headless",
        `-env:UserInstallation=file://${path.join(dir, "profile")}`,
        "--convert-to",
        "pdf",
        "--outdir",
        dir,
        entrada,
      ])
      const salida = path.join(dir, "doc.pdf")
      if (await existe(salida)) return await fs.readFile(salida)
    }

    // Fallback macOS: texto plano → PDF. Pierde formato, conserva contenido.
    const txt = path.join(dir, "doc.txt")
    await exec("textutil", ["-convert", "txt", "-output", txt, entrada])
    const pdf = path.join(dir, "doc-fallback.pdf")
    await exec("/bin/sh", ["-c", `cupsfilter ${JSON.stringify(txt)} > ${JSON.stringify(pdf)} 2>/dev/null`])
    if (await existe(pdf)) return await fs.readFile(pdf)

    return null
  } catch (e) {
    console.error(`[documentos] no se pudo convertir ${nombreArchivo}:`, (e as Error).message.slice(0, 120))
    return null
  } finally {
    await fs.rm(dir, { recursive: true, force: true }).catch(() => {})
  }
}
