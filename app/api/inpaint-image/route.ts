import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'
import { Storage } from '@google-cloud/storage'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

// Configurar Google Cloud Storage (usa Application Default Credentials)
const storage = new Storage({
  projectId: 'meisa-web-prod-2025'
})

const bucket = storage.bucket('meisa-imagenes')

/**
 * API endpoint para edición de imágenes con IA (inpainting/borrado)
 *
 * POST /api/inpaint-image
 * Body (FormData):
 *   - image: archivo de imagen original
 *   - mask: archivo de máscara (blanco = editar, negro = preservar)
 *   - prompt: (opcional) texto para reemplazar el área
 *   - mode: 'remove' | 'replace' (opcional, por defecto se infiere del prompt)
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get('image') as File
    const maskFile = formData.get('mask') as File
    const prompt = formData.get('prompt') as string || ''
    const mode = (formData.get('mode') as string) || (prompt ? 'replace' : 'remove')

    if (!imageFile || !maskFile) {
      return NextResponse.json(
        { error: 'Se requiere imagen y máscara' },
        { status: 400 }
      )
    }

    console.log(`🎨 [Inpaint] Modo: ${mode}, Prompt: "${prompt || '(ninguno)'}"`)

    // Convertir archivos a base64 para Replicate
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer())
    const maskBuffer = Buffer.from(await maskFile.arrayBuffer())

    const imageBase64 = `data:${imageFile.type};base64,${imageBuffer.toString('base64')}`
    const maskBase64 = `data:${maskFile.type};base64,${maskBuffer.toString('base64')}`

    let output: string

    if (mode === 'remove') {
      // Modo borrado: usar Bria Eraser (~$0.0015 USD por imagen)
      console.log('🧹 [Inpaint] Usando Bria Eraser para borrado inteligente...')

      const result = await replicate.run(
        "bria/eraser",
        {
          input: {
            image: imageBase64,
            mask: maskBase64
          }
        }
      ) as string

      output = result

    } else {
      // Modo reemplazo: usar Bria Genfill para inpainting (~$0.0038 USD por imagen)
      console.log('✨ [Inpaint] Usando Bria Genfill para inpainting con prompt...')

      const result = await replicate.run(
        "bria/genfill",
        {
          input: {
            image: imageBase64,
            mask: maskBase64,
            prompt: prompt || 'seamless fill, high quality',
            negative_prompt: 'blurry, low quality, artifacts'
          }
        }
      ) as string

      output = result
    }

    if (!output) {
      throw new Error('No se recibió resultado del modelo de IA')
    }

    console.log(`📥 [Inpaint] Descargando resultado: ${output}`)

    // Descargar la imagen resultante
    const imageResponse = await fetch(output)
    if (!imageResponse.ok) {
      throw new Error(`Error descargando imagen: ${imageResponse.statusText}`)
    }

    const imageArrayBuffer = await imageResponse.arrayBuffer()
    const imageBlob = Buffer.from(imageArrayBuffer)

    // Subir a Google Cloud Storage
    const fileName = `inpainted-${Date.now()}.png`
    const file = bucket.file(`hero/${fileName}`)

    await file.save(imageBlob, {
      metadata: {
        contentType: 'image/png',
      },
    })

    await file.makePublic()

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/hero/${fileName}`

    console.log(`✅ [Inpaint] Imagen editada guardada: ${publicUrl}`)

    return NextResponse.json({
      success: true,
      url: publicUrl,
      mode,
      prompt: prompt || undefined
    })

  } catch (error: any) {
    console.error('❌ [Inpaint] Error:', error)
    return NextResponse.json(
      {
        error: error.message || 'Error procesando imagen con IA',
        details: error.toString()
      },
      { status: 500 }
    )
  }
}
