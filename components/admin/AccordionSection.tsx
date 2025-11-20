"use client"

import { useState, ReactNode } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface AccordionSectionProps {
  title: string
  icon?: ReactNode
  defaultOpen?: boolean
  statusIndicator?: ReactNode
  children: ReactNode
}

export function AccordionSection({
  title,
  icon,
  defaultOpen = false,
  statusIndicator,
  children
}: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-xl">{icon}</span>}
          <span className="font-medium text-gray-900">{title}</span>
          {statusIndicator && (
            <span className="text-sm text-gray-600">{statusIndicator}</span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {/* Content */}
      {isOpen && (
        <div className="p-6 bg-white border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  )
}
