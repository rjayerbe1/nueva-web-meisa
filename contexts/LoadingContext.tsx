'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface LoadingContextType {
  loadedCount: number
  totalResources: number
  registerResource: () => void
  markResourceLoaded: (resourceId: string) => void
  isAllLoaded: boolean
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loadedResources, setLoadedResources] = useState<Set<string>>(new Set())
  const [totalResources, setTotalResources] = useState(0)

  const registerResource = useCallback(() => {
    setTotalResources(prev => prev + 1)
  }, [])

  const markResourceLoaded = useCallback((resourceId: string) => {
    setLoadedResources(prev => {
      if (prev.has(resourceId)) return prev
      const newSet = new Set(prev)
      newSet.add(resourceId)
      console.log(`✅ Recurso cargado: ${resourceId} (${newSet.size}/${totalResources})`)
      return newSet
    })
  }, [totalResources])

  const isAllLoaded = loadedResources.size >= totalResources && totalResources > 0

  return (
    <LoadingContext.Provider
      value={{
        loadedCount: loadedResources.size,
        totalResources,
        registerResource,
        markResourceLoaded,
        isAllLoaded,
      }}
    >
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}
