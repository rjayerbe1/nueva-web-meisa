'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Bold, Italic, List, ListOrdered, Link2, Quote } from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [selection, setSelection] = useState({ start: 0, end: 0 })

  const handleFormat = (format: string) => {
    const textarea = document.getElementById('rich-editor') as HTMLTextAreaElement
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    
    let newText = ''
    let newCursorPos = end

    switch (format) {
      case 'bold':
        newText = `**${selectedText}**`
        newCursorPos = end + 4
        break
      case 'italic':
        newText = `*${selectedText}*`
        newCursorPos = end + 2
        break
      case 'list':
        newText = `\n- ${selectedText}`
        newCursorPos = end + 3
        break
      case 'orderedList':
        newText = `\n1. ${selectedText}`
        newCursorPos = end + 4
        break
      case 'quote':
        newText = `\n> ${selectedText}`
        newCursorPos = end + 3
        break
      case 'link':
        newText = `[${selectedText}](url)`
        newCursorPos = end + 7
        break
    }

    const newValue = value.substring(0, start) + newText + value.substring(end)
    onChange(newValue)

    // Restaurar la selección
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-1 p-1 border rounded-md bg-gray-50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleFormat('bold')}
          className="h-8 w-8 p-0"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleFormat('italic')}
          className="h-8 w-8 p-0"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <div className="w-px bg-gray-300 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleFormat('list')}
          className="h-8 w-8 p-0"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleFormat('orderedList')}
          className="h-8 w-8 p-0"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="w-px bg-gray-300 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleFormat('quote')}
          className="h-8 w-8 p-0"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleFormat('link')}
          className="h-8 w-8 p-0"
        >
          <Link2 className="h-4 w-4" />
        </Button>
      </div>
      <Textarea
        id="rich-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={10}
        className="font-mono text-sm"
        onSelect={(e) => {
          const target = e.target as HTMLTextAreaElement
          setSelection({ start: target.selectionStart, end: target.selectionEnd })
        }}
      />
      <p className="text-xs text-gray-500">
        Usa Markdown para formatear el texto: **negrita**, *cursiva*, [enlace](url), etc.
      </p>
    </div>
  )
}