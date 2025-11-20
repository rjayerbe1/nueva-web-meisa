"use client"

import { useState } from 'react'
import { Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ImageExpansionEditor } from './ImageExpansionEditor'

interface ExpandImageButtonProps {
  imageUrl: string
  onExpandComplete: (expandedUrl: string) => void
  disabled?: boolean
  size?: 'default' | 'sm' | 'lg' | 'icon'
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive'
  className?: string
  showLabel?: boolean
  suggestedRatio?: string // Ej: "3:5"
}

export function ExpandImageButton({
  imageUrl,
  onExpandComplete,
  disabled = false,
  size = 'sm',
  variant = 'secondary',
  className = '',
  showLabel = true,
  suggestedRatio
}: ExpandImageButtonProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false)

  const handleOpenEditor = () => {
    if (!imageUrl) return
    setIsEditorOpen(true)
  }

  const handleComplete = (expandedUrl: string) => {
    onExpandComplete(expandedUrl)
    setIsEditorOpen(false)
  }

  return (
    <>
      <Button
        type="button"
        size={size}
        variant={variant}
        onClick={handleOpenEditor}
        disabled={disabled || !imageUrl}
        className={className}
        title="~$0.04 USD por imagen"
      >
        <Maximize2 className="h-4 w-4" />
        {showLabel && (
          <span className="ml-2 flex flex-col items-start">
            <span className="font-medium">Expand</span>
            <span className="text-xs opacity-70">~$0.04 USD</span>
          </span>
        )}
      </Button>

      {isEditorOpen && (
        <ImageExpansionEditor
          imageUrl={imageUrl}
          onComplete={handleComplete}
          onClose={() => setIsEditorOpen(false)}
          suggestedRatio={suggestedRatio}
        />
      )}
    </>
  )
}
