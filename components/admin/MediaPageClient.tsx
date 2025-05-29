"use client"

import { useState } from "react"
import { Upload } from "lucide-react"
import MediaUploadImproved from "./MediaUploadImproved"

interface Project {
  id: string
  titulo: string
}

interface MediaPageClientProps {
  projects: Project[]
}

export default function MediaPageClient({ projects }: MediaPageClientProps) {
  const [showUpload, setShowUpload] = useState(false)

  return (
    <>
      <button 
        onClick={() => setShowUpload(true)}
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-meisa-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-meisa-blue transition-colors"
      >
        <Upload className="h-5 w-5 mr-2" />
        Subir Archivos
      </button>

      {showUpload && (
        <MediaUploadImproved 
          projects={projects} 
          onClose={() => setShowUpload(false)} 
        />
      )}
    </>
  )
}