'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, MessageSquare } from 'lucide-react'
import { sendGAEvent } from '@next/third-parties/google'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Contacto {
  id: string
  nombre: string
  cargo: string
  telefono: string
  mensajePredeterminado: string
  avatar: string | null
  orden: number
}

interface Configuracion {
  horarioAtencion: string
  mensajeIntroduccion: string
  tituloWidget: string
  activo: boolean
}

interface WhatsAppData {
  contactos: Contacto[]
  configuracion: Configuracion
}

export function WhatsAppFloatingWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<WhatsAppData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  // Exclusión mutua entre widgets flotantes: si otro (el chat) se abre, cerrar este.
  useEffect(() => {
    const onOtroWidget = (e: Event) => {
      if ((e as CustomEvent).detail !== 'whatsapp') setIsOpen(false)
    }
    window.addEventListener('meisa:widget-open', onOtroWidget)
    return () => window.removeEventListener('meisa:widget-open', onOtroWidget)
  }, [])

  const toggleOpen = () => {
    const next = !isOpen
    setIsOpen(next)
    if (next) {
      // Avisar al chat para que se cierre y no se solapen los paneles.
      try {
        window.dispatchEvent(new CustomEvent('meisa:widget-open', { detail: 'whatsapp' }))
      } catch {
        /* noop */
      }
    }
  }

  const fetchData = async () => {
    try {
      const response = await fetch('/api/contactos-whatsapp')
      if (response.ok) {
        const result = await response.json()
        setData(result)
      }
    } catch (error) {
      console.error('Error al cargar contactos de WhatsApp:', error)
    } finally {
      setLoading(false)
    }
  }

  // No mostrar el widget si está cargando, no hay data, no está activo o no hay contactos
  if (loading || !data || !data.configuracion.activo || data.contactos.length === 0) {
    return null
  }

  const handleContactoClick = (contacto: Contacto) => {
    const telefonoLimpio = contacto.telefono.replace(/\D/g, '')
    const mensaje = encodeURIComponent(contacto.mensajePredeterminado)
    const url = `https://wa.me/${telefonoLimpio}?text=${mensaje}`
    // Medición: contar el contacto por WhatsApp como lead (dejar de medir a ciegas).
    sendGAEvent('event', 'generate_lead', {
      metodo: 'whatsapp',
      origen: 'widget-flotante',
    })
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      {/* Botón flotante */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <motion.button
          onClick={toggleOpen}
          className="bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow-xl transition-all duration-200 flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isOpen ? 'Cerrar WhatsApp' : 'Abrir WhatsApp'}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="whatsapp"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* Popup con contactos */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-40 w-full max-w-sm"
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-sm border border-gray-200">
              {/* Header simple */}
              <div className="px-6 py-5 border-b border-gray-100">
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-1 font-lato">Contacto Directo</p>
                <h3 className="text-2xl font-light text-gray-900 font-lato">
                  WhatsApp
                </h3>
              </div>

              {/* Lista de contactos minimalista */}
              <div className="p-6">
                {data.contactos.map((contacto, index) => (
                  <motion.button
                    key={contacto.id}
                    onClick={() => handleContactoClick(contacto)}
                    className="w-full flex items-center gap-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors rounded-lg px-4 text-left last:border-b-0"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="h-10 w-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-medium text-sm flex-shrink-0">
                      {contacto.nombre
                        .split(' ')
                        .map(n => n.charAt(0))
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 font-lato">{contacto.nombre}</p>
                      <p className="text-sm text-gray-500 font-lato">{contacto.cargo}</p>
                      <p className="text-xs text-gray-400 mt-0.5 font-lato">{contacto.telefono}</p>
                    </div>
                    <div className="text-green-600 flex-shrink-0">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
