'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Section {
  id: string
  label: string
}

const sections: Section[] = [
  { id: 'quienes-somos', label: 'Quiénes Somos' },
  { id: 'instalaciones', label: 'Instalaciones' },
  { id: 'compromiso', label: 'Compromiso' },
  { id: 'contacto', label: 'Contacto' }
]

export function EmpresaNavigation() {
  const [activeSection, setActiveSection] = useState<string>('quienes-somos')
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Check if navigation should be sticky
      const scrollY = window.scrollY
      setIsSticky(scrollY > window.innerHeight - 100)

      // Determine active section based on scroll position
      const sectionElements = sections.map(section => ({
        id: section.id,
        element: document.getElementById(section.id)
      }))

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const { id, element } = sectionElements[i]
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 150) {
            setActiveSection(id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const navHeight = 80
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition - navHeight,
        behavior: 'smooth'
      })
    }
  }

  return (
    <nav
      className={`sticky top-[72px] z-40 transition-all duration-300 ${
        isSticky
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-center py-3 overflow-x-auto scrollbar-hide">
          <div className="flex gap-1 sm:gap-2 p-1 bg-gray-100 rounded-full">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="relative px-4 sm:px-6 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-colors duration-200"
              >
                {activeSection === section.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-blue-600 rounded-full shadow-lg"
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
                <span
                  className={`relative z-10 transition-colors duration-200 ${
                    activeSection === section.id
                      ? 'text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {section.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-gray-100">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-700"
            style={{
              width: `${((sections.findIndex(s => s.id === activeSection) + 1) / sections.length) * 100}%`
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </nav>
  )
}
