"use client"

import { useState, useCallback } from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface ImageUploaderProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

export function ImageUploader({ 
  images, 
  onImagesChange, 
  maxImages = 10 
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setIsUploading(true)

    try {
      // En producción, aquí subirías a Uploadcare
      // Por ahora, simulamos con URLs locales
      const newImages = files.map(file => URL.createObjectURL(file))
      
      const updatedImages = [...images, ...newImages].slice(0, maxImages)
      onImagesChange(updatedImages)
    } catch (error) {
      console.error("Error uploading images:", error)
    } finally {
      setIsUploading(false)
    }
  }, [images, maxImages, onImagesChange])

  const removeImage = useCallback((index: number) => {
    const updatedImages = images.filter((_, i) => i !== index)
    onImagesChange(updatedImages)
  }, [images, onImagesChange])

  const moveImage = useCallback((from: number, to: number) => {
    const updatedImages = [...images]
    const [removed] = updatedImages.splice(from, 1)
    updatedImages.splice(to, 0, removed)
    onImagesChange(updatedImages)
  }, [images, onImagesChange])

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="image-upload"
          disabled={isUploading || images.length >= maxImages}
        />
        <label
          htmlFor="image-upload"
          className={`cursor-pointer ${
            images.length >= maxImages ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {isUploading
              ? "Subiendo..."
              : images.length >= maxImages
              ? `Máximo ${maxImages} imágenes`
              : "Click para subir o arrastra imágenes aquí"}
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG, GIF hasta 10MB
          </p>
        </label>
      </div>

      {/* Images grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden"
            >
              {image.startsWith("blob:") ? (
                <img
                  src={image}
                  alt={`Imagen ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={image}
                  alt={`Imagen ${index + 1}`}
                  fill
                  className="object-cover"
                />
              )}
              
              {/* Overlay con opciones */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {/* Mover izquierda */}
                {index > 0 && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => moveImage(index, index - 1)}
                  >
                    ←
                  </Button>
                )}
                
                {/* Eliminar */}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
                
                {/* Mover derecha */}
                {index < images.length - 1 && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => moveImage(index, index + 1)}
                  >
                    →
                  </Button>
                )}
              </div>
              
              {/* Número de orden */}
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contador */}
      <p className="text-sm text-gray-500 text-center">
        {images.length} / {maxImages} imágenes
      </p>
    </div>
  )
}