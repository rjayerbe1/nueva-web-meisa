"use client"

import { useState } from 'react'
import { Paintbrush } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ImageInpaintingEditor } from './ImageInpaintingEditor'

interface InpaintButtonProps {
  imageUrl: string
  onInpaintComplete: (editedUrl: string) => void
  disabled?: boolean
  size?: 'default' | 'sm' | 'lg' | 'icon'
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive'
  className?: string
  showLabel?: boolean
}

export function InpaintButton({
  imageUrl,
  onInpaintComplete,
  disabled = false,
  size = 'sm',
  variant = 'secondary',
  className = '',
  showLabel = true
}: InpaintButtonProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false)

  const handleOpenEditor = () => {
    if (!imageUrl) return
    setIsEditorOpen(true)
  }

  const handleComplete = (editedUrl: string) => {
    onInpaintComplete(editedUrl)
    setIsEditorOpen(false)
  }

  return (
    <>
      <Button
        size={size}
        variant={variant}
        onClick={handleOpenEditor}
        disabled={disabled || !imageUrl}
        className={className}
        title="~$0.0015-0.0038 USD por imagen"
      >
        <Paintbrush className="h-4 w-4" />
        {showLabel && (
          <span className="ml-2 flex flex-col items-start">
            <span className="font-medium">Editar con IA</span>
            <span className="text-xs opacity-70">~$0.0015-$0.004 USD</span>
          </span>
        )}
      </Button>

      {isEditorOpen && (
        <ImageInpaintingEditor
          imageUrl={imageUrl}
          onComplete={handleComplete}
          onClose={() => setIsEditorOpen(false)}
        />
      )}
    </>
  )
}
