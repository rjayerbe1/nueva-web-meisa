"use client"

import { useState, useEffect } from "react"
import { Save, Check, AlertCircle } from "lucide-react"

interface Settings {
  companyName: string
  siteUrl: string
  description: string
  contactEmail: string
  notificationEmail: string
  emailNotifications: boolean
  twoFactorAuth: boolean
  lastBackup: string
}

export default function ConfigurationForm() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [settings, setSettings] = useState<Settings>({
    companyName: '',
    siteUrl: '',
    description: '',
    contactEmail: '',
    notificationEmail: '',
    emailNotifications: true,
    twoFactorAuth: false,
    lastBackup: '',
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings')
        if (response.ok) {
          const data = await response.json()
          setSettings(data)
        } else {
          setMessage({ type: 'error', text: 'Error al cargar la configuración' })
        }
      } catch (error) {
        console.error('Error:', error)
        setMessage({ type: 'error', text: 'Error al cargar la configuración' })
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Configuración guardada exitosamente' })
        setTimeout(() => setMessage(null), 5000)
      } else {
        setMessage({ type: 'error', text: 'Error al guardar la configuración' })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage({ type: 'error', text: 'Error al guardar la configuración' })
    } finally {
      setSaving(false)
    }
  }

  const handleBackup = async () => {
    try {
      // Simular backup
      setMessage({ type: 'success', text: 'Backup iniciado exitosamente' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al iniciar el backup' })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-meisa-blue"></div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <Check className="h-5 w-5 mr-2" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2" />
          )}
          {message.text}
        </div>
      )}

      {/* General Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Configuración General</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Empresa
            </label>
            <input
              type="text"
              value={settings.companyName}
              onChange={(e) => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meisa-blue focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL del Sitio
            </label>
            <input
              type="url"
              value={settings.siteUrl}
              onChange={(e) => setSettings(prev => ({ ...prev, siteUrl: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meisa-blue focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              rows={3}
              value={settings.description}
              onChange={(e) => setSettings(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meisa-blue focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Email Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Configuración de Email</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email de Contacto
            </label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meisa-blue focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email de Notificaciones
            </label>
            <input
              type="email"
              value={settings.notificationEmail}
              onChange={(e) => setSettings(prev => ({ ...prev, notificationEmail: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meisa-blue focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="email-notifications"
              checked={settings.emailNotifications}
              onChange={(e) => setSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
              className="h-4 w-4 text-meisa-blue border-gray-300 rounded focus:ring-meisa-blue"
            />
            <label htmlFor="email-notifications" className="ml-2 text-sm text-gray-700">
              Recibir notificaciones por email de nuevos contactos
            </label>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Seguridad</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <p className="text-sm font-medium text-gray-900">Autenticación de dos factores</p>
              <p className="text-sm text-gray-500">Añade una capa extra de seguridad</p>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="two-factor"
                checked={settings.twoFactorAuth}
                onChange={(e) => setSettings(prev => ({ ...prev, twoFactorAuth: e.target.checked }))}
                className="h-4 w-4 text-meisa-blue border-gray-300 rounded focus:ring-meisa-blue mr-3"
              />
              <button 
                type="button"
                className="px-4 py-2 text-sm font-medium text-meisa-blue border border-meisa-blue rounded-md hover:bg-blue-50"
              >
                Configurar
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <p className="text-sm font-medium text-gray-900">Sesiones activas</p>
              <p className="text-sm text-gray-500">Gestiona las sesiones abiertas</p>
            </div>
            <button 
              type="button"
              className="px-4 py-2 text-sm font-medium text-meisa-blue border border-meisa-blue rounded-md hover:bg-blue-50"
            >
              Ver sesiones
            </button>
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">Cambiar contraseña</p>
              <p className="text-sm text-gray-500">Actualiza tu contraseña regularmente</p>
            </div>
            <button 
              type="button"
              className="px-4 py-2 text-sm font-medium text-meisa-blue border border-meisa-blue rounded-md hover:bg-blue-50"
            >
              Cambiar
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="space-y-3">
          <button 
            type="button"
            onClick={handleBackup}
            className="w-full flex items-center justify-between p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">Backup de datos</span>
            </div>
            <span className="text-xs text-gray-500">Último: {settings.lastBackup}</span>
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button 
          type="submit"
          disabled={saving}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-meisa-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-meisa-blue transition-colors disabled:opacity-50"
        >
          <Save className="h-5 w-5 mr-2" />
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  )
}