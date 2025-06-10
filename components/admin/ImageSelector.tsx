'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  Image as ImageIcon, 
  Upload,
  X,
  Search
} from 'lucide-react'
import MediaManager from './MediaManager'
import Image from 'next/image'

interface ImageSelectorProps {
  value?: string
  onChange: (url: string) => void
  label: string
  placeholder?: string
  className?: string
}

export default function ImageSelector({ 
  value, 
  onChange, 
  label, 
  placeholder = "URL de la imagen o seleccionar...",
  className = ""
}: ImageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelectImage = (url: string) => {
    onChange(url)
    setIsOpen(false)
  }

  const handleClearImage = () => {
    onChange('')
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      
      {/* Preview de la imagen actual */}
      {value && (
        <div className="relative group">
          <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden border">
            <Image
              src={value}
              alt="Imagen seleccionada"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleClearImage}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Input manual + botón selector */}
      <div className="flex gap-2">
        <Input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" type="button">
              <Search className="w-4 h-4 mr-2" />
              Seleccionar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Seleccionar Imagen</DialogTitle>
              <DialogDescription>
                Elige una imagen de tu biblioteca multimedia o sube una nueva
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex-1 overflow-auto">
              <MediaManager 
                onSelectImage={handleSelectImage}
                selectedImage={value}
                showSelector={true}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Indicador de estado */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        {value ? (
          <>
            <ImageIcon className="w-3 h-3" />
            Imagen seleccionada
          </>
        ) : (
          <>
            <Upload className="w-3 h-3" />
            Sin imagen seleccionada
          </>
        )}
      </div>
    </div>
  )
}