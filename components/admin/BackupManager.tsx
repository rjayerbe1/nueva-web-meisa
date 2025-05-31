"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Download, 
  Upload, 
  Database, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  HardDrive,
  Trash2,
  Settings,
  Calendar,
  RotateCcw,
  Package,
  Image,
  Users,
  Archive,
  ExternalLink
} from 'lucide-react'

interface Backup {
  name: string
  size: number
  created: string
  modified: string
  type?: 'database' | 'complete'
  includes?: {
    database: boolean
    projectImages: boolean
    clientLogos: boolean
  }
}

interface ScheduleConfig {
  dailyBackup: {
    enabled: boolean
    time: string
    retentionDays: number
  }
  weeklyBackup: {
    enabled: boolean
    day: string
    time: string
    retentionWeeks: number
  }
}

export function BackupManager() {
  const [backups, setBackups] = useState<Backup[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingComplete, setLoadingComplete] = useState(false)
  const [restoring, setRestoring] = useState(false)
  const [restoringComplete, setRestoringComplete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [cleaning, setCleaning] = useState(false)
  const [confirmPhrase, setConfirmPhrase] = useState('')
  const [deleteConfirmPhrase, setDeleteConfirmPhrase] = useState('')
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null)
  const [selectedBackupToDelete, setSelectedBackupToDelete] = useState<string | null>(null)
  const [showRestoreDialog, setShowRestoreDialog] = useState(false)
  const [showRestoreCompleteDialog, setShowRestoreCompleteDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [schedule, setSchedule] = useState<ScheduleConfig>({
    dailyBackup: { enabled: false, time: '02:00', retentionDays: 7 },
    weeklyBackup: { enabled: false, day: 'sunday', time: '01:00', retentionWeeks: 4 }
  })
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    loadBackups()
    loadSchedule()
  }, [])

  const loadBackups = async () => {
    try {
      const response = await fetch('/api/admin/backup')
      const data = await response.json()
      if (data.backups) {
        setBackups(data.backups)
      }
    } catch (error) {
      console.error('Error cargando backups:', error)
    }
  }

  const createBackup = async (backupType: 'database' | 'complete' = 'database') => {
    const isComplete = backupType === 'complete'
    
    if (isComplete) {
      setLoadingComplete(true)
    } else {
      setLoading(true)
    }
    setMessage(null)
    
    try {
      const response = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'manual',
          backupType 
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        const message = isComplete 
          ? `Backup completo creado exitosamente (${(data.backup.size / 1024 / 1024).toFixed(2)} MB)`
          : 'Backup de base de datos creado exitosamente'
        setMessage({ type: 'success', text: message })
        loadBackups()
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al crear backup' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión' })
    } finally {
      if (isComplete) {
        setLoadingComplete(false)
      } else {
        setLoading(false)
      }
    }
  }

  const restoreBackup = async () => {
    if (!selectedBackup || confirmPhrase !== 'CONFIRMO RESTAURAR BASE DE DATOS') {
      setMessage({ type: 'error', text: 'Debe escribir exactamente: CONFIRMO RESTAURAR BASE DE DATOS' })
      return
    }

    setRestoring(true)
    setMessage(null)
    
    try {
      const response = await fetch('/api/admin/backup/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          backupName: selectedBackup,
          confirmPhrase 
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: `Base de datos restaurada. Backup de seguridad: ${data.safetyBackup}` 
        })
        setShowRestoreDialog(false)
        setConfirmPhrase('')
        setSelectedBackup(null)
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al restaurar backup' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión' })
    } finally {
      setRestoring(false)
    }
  }

  const restoreCompleteBackup = async () => {
    if (!selectedBackup || confirmPhrase !== 'CONFIRMO RESTAURAR BACKUP COMPLETO') {
      setMessage({ type: 'error', text: 'Debe escribir exactamente: CONFIRMO RESTAURAR BACKUP COMPLETO' })
      return
    }

    setRestoringComplete(true)
    setMessage(null)
    
    try {
      const response = await fetch('/api/admin/backup/restore-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          backupName: selectedBackup,
          confirmPhrase 
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        const components = []
        if (data.restored.database) components.push('Base de datos')
        if (data.restored.projectImages) components.push(`${data.stats.imagesRestored} imágenes`)
        if (data.restored.clientLogos) components.push(`${data.stats.logosRestored} logos`)
        
        setMessage({ 
          type: 'success', 
          text: `Backup completo restaurado: ${components.join(', ')}` 
        })
        setShowRestoreCompleteDialog(false)
        setConfirmPhrase('')
        setSelectedBackup(null)
        loadBackups()
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al restaurar backup completo' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión' })
    } finally {
      setRestoringComplete(false)
    }
  }

  const loadSchedule = async () => {
    try {
      const response = await fetch('/api/admin/backup/schedule')
      const data = await response.json()
      if (response.ok) {
        setSchedule(data)
      }
    } catch (error) {
      console.error('Error cargando configuración:', error)
    }
  }

  const saveSchedule = async () => {
    try {
      const response = await fetch('/api/admin/backup/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schedule)
      })
      
      const data = await response.json()
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Configuración guardada exitosamente' })
        setShowScheduleDialog(false)
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al guardar configuración' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión' })
    }
  }

  const deleteBackup = async () => {
    if (!selectedBackupToDelete || deleteConfirmPhrase !== 'CONFIRMO ELIMINAR BACKUP') {
      setMessage({ type: 'error', text: 'Debe escribir exactamente: CONFIRMO ELIMINAR BACKUP' })
      return
    }

    setDeleting(true)
    setMessage(null)
    
    try {
      const response = await fetch('/api/admin/backup/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          backupName: selectedBackupToDelete,
          confirmPhrase: deleteConfirmPhrase 
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Backup eliminado exitosamente' })
        setShowDeleteDialog(false)
        setDeleteConfirmPhrase('')
        setSelectedBackupToDelete(null)
        loadBackups()
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al eliminar backup' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión' })
    } finally {
      setDeleting(false)
    }
  }

  const cleanupOldBackups = async () => {
    setCleaning(true)
    setMessage(null)
    
    try {
      const response = await fetch('/api/admin/backup/cleanup', {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (data.success) {
        setMessage({ type: 'success', text: data.message })
        loadBackups()
      } else {
        setMessage({ type: 'error', text: data.error || 'Error en limpieza' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión' })
    } finally {
      setCleaning(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const downloadBackup = async (backupName: string) => {
    try {
      const response = await fetch(`/api/admin/backup/download?backup=${encodeURIComponent(backupName)}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        setMessage({ type: 'error', text: errorData.error || 'Error al descargar backup' })
        return
      }
      
      // Crear URL del blob y descargar
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = backupName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      setMessage({ type: 'success', text: 'Backup descargado exitosamente' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión al descargar backup' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Backups</h2>
          <p className="text-gray-600">Administra copias de seguridad completas (base de datos + archivos)</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setShowScheduleDialog(true)}
            variant="outline"
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            <Settings className="h-4 w-4 mr-2" />
            Configurar
          </Button>
          <Button
            onClick={cleanupOldBackups}
            disabled={cleaning}
            variant="outline"
            className="border-orange-200 text-orange-600 hover:bg-orange-50"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            {cleaning ? 'Limpiando...' : 'Limpiar'}
          </Button>
          <Button 
            onClick={() => createBackup('database')} 
            disabled={loading || loadingComplete}
            variant="outline"
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <Database className="h-4 w-4 mr-2" />
            {loading ? 'Creando...' : 'Solo Base de Datos'}
          </Button>
          <Button 
            onClick={() => createBackup('complete')} 
            disabled={loading || loadingComplete}
            className="bg-green-600 hover:bg-green-700"
          >
            <Package className="h-4 w-4 mr-2" />
            {loadingComplete ? 'Creando Completo...' : 'Backup Completo'}
          </Button>
        </div>
      </div>

      {/* Mensaje de estado */}
      {message && (
        <Card className={`p-4 ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            )}
            <span className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message.text}
            </span>
          </div>
        </Card>
      )}

      {/* Información de backup completo */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start">
          <Package className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-800">Backup Completo Disponible</h3>
            <p className="text-sm text-blue-700 mt-1">
              El backup completo incluye base de datos, imágenes de proyectos y logos de clientes. 
              Ideal para migraciones o restauraciones completas del sistema.
            </p>
          </div>
        </div>
      </Card>

      {/* Advertencia de seguridad */}
      <Card className="p-4 bg-yellow-50 border-yellow-200">
        <div className="flex items-start">
          <Shield className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800">Advertencia de Seguridad</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Restaurar un backup reemplazará completamente la base de datos actual. 
              Se creará automáticamente un backup de seguridad antes de la restauración.
            </p>
          </div>
        </div>
      </Card>

      {/* Lista de backups */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Backups Disponibles ({backups.length})
        </h3>

        {backups.length === 0 ? (
          <div className="text-center py-8">
            <HardDrive className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay backups disponibles</p>
            <p className="text-sm text-gray-400 mt-1">Crea tu primer backup usando el botón de arriba</p>
          </div>
        ) : (
          <div className="space-y-3">
            {backups.map((backup) => (
              <div 
                key={backup.name}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  {backup.name.endsWith('.zip') || backup.type === 'complete' ? (
                    <Package className="h-5 w-5 text-green-600" />
                  ) : (
                    <Database className="h-5 w-5 text-blue-600" />
                  )}
                  <div>
                    <div className="flex items-center space-x-2">
                      <div className="font-medium text-gray-900">{backup.name}</div>
                      {(backup.name.endsWith('.zip') || backup.type === 'complete') && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                          Completo
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center space-x-4">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(backup.created)}
                      </span>
                      <span className="flex items-center">
                        <HardDrive className="h-3 w-3 mr-1" />
                        {formatFileSize(backup.size)}
                      </span>
                    </div>
                    {backup.includes && (
                      <div className="text-xs text-gray-400 flex items-center space-x-3 mt-1">
                        {backup.includes.database && (
                          <span className="flex items-center">
                            <Database className="h-3 w-3 mr-1" />
                            BD
                          </span>
                        )}
                        {backup.includes.projectImages && (
                          <span className="flex items-center">
                            <Image className="h-3 w-3 mr-1" />
                            Proyectos
                          </span>
                        )}
                        {backup.includes.clientLogos && (
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            Logos
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {backup.name.endsWith('.zip') || backup.type === 'complete' ? (
                    // Para backups completos (ZIP): restaurar completo, descargar y eliminar
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedBackup(backup.name)
                          setShowRestoreCompleteDialog(true)
                        }}
                        className="text-green-600 border-green-200 hover:bg-green-50"
                      >
                        <Package className="h-4 w-4 mr-1" />
                        Restaurar Completo
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadBackup(backup.name)}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Descargar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedBackupToDelete(backup.name)
                          setShowDeleteDialog(true)
                        }}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Eliminar
                      </Button>
                    </>
                  ) : (
                    // Para backups de base de datos (JSON/SQL): restaurar y eliminar
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedBackup(backup.name)
                          setShowRestoreDialog(true)
                        }}
                        className="text-orange-600 border-orange-200 hover:bg-orange-50"
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Restaurar BD
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedBackupToDelete(backup.name)
                          setShowDeleteDialog(true)
                        }}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Eliminar
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Dialog de restauración */}
      {showRestoreDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Confirmar Restauración</h3>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Estás a punto de restaurar el backup: <strong>{selectedBackup}</strong>
              </p>
              
              <div className="bg-red-50 border border-red-200 p-3 rounded">
                <p className="text-sm text-red-800 font-medium">
                  ⚠️ ESTA ACCIÓN NO SE PUEDE DESHACER
                </p>
                <p className="text-sm text-red-700 mt-1">
                  Todos los datos actuales serán reemplazados por los del backup seleccionado.
                </p>
              </div>
              
              <div>
                <Label htmlFor="confirm-phrase" className="text-sm font-medium">
                  Para continuar, escriba exactamente:
                </Label>
                <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-1 mb-2">
                  CONFIRMO RESTAURAR BASE DE DATOS
                </p>
                <Input
                  id="confirm-phrase"
                  value={confirmPhrase}
                  onChange={(e) => setConfirmPhrase(e.target.value)}
                  placeholder="Escriba la frase de confirmación"
                  className="font-mono"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRestoreDialog(false)
                  setConfirmPhrase('')
                  setSelectedBackup(null)
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={restoreBackup}
                disabled={restoring || confirmPhrase !== 'CONFIRMO RESTAURAR BASE DE DATOS'}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {restoring ? 'Restaurando...' : 'Restaurar'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Dialog de restauración completa */}
      {showRestoreCompleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <Package className="h-6 w-6 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Confirmar Restauración Completa</h3>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Estás a punto de restaurar el backup completo: <strong>{selectedBackup}</strong>
              </p>
              
              <div className="bg-green-50 border border-green-200 p-3 rounded">
                <p className="text-sm text-green-800 font-medium">
                  📦 RESTAURACIÓN COMPLETA
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Se restaurarán: base de datos, imágenes de proyectos y logos de clientes.
                </p>
              </div>
              
              <div className="bg-red-50 border border-red-200 p-3 rounded">
                <p className="text-sm text-red-800 font-medium">
                  ⚠️ ESTA ACCIÓN NO SE PUEDE DESHACER
                </p>
                <p className="text-sm text-red-700 mt-1">
                  Todos los datos y archivos actuales serán reemplazados por los del backup.
                </p>
              </div>
              
              <div>
                <Label htmlFor="confirm-phrase-complete" className="text-sm font-medium">
                  Para continuar, escriba exactamente:
                </Label>
                <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-1 mb-2">
                  CONFIRMO RESTAURAR BACKUP COMPLETO
                </p>
                <Input
                  id="confirm-phrase-complete"
                  value={confirmPhrase}
                  onChange={(e) => setConfirmPhrase(e.target.value)}
                  placeholder="Escriba la frase de confirmación"
                  className="font-mono"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRestoreCompleteDialog(false)
                  setConfirmPhrase('')
                  setSelectedBackup(null)
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={restoreCompleteBackup}
                disabled={restoringComplete || confirmPhrase !== 'CONFIRMO RESTAURAR BACKUP COMPLETO'}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {restoringComplete ? 'Restaurando...' : 'Restaurar Completo'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Dialog de eliminación */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <Trash2 className="h-6 w-6 text-red-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Eliminar Backup</h3>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Estás a punto de eliminar el backup: <strong>{selectedBackupToDelete}</strong>
              </p>
              
              <div className="bg-red-50 border border-red-200 p-3 rounded">
                <p className="text-sm text-red-800 font-medium">
                  ⚠️ ESTA ACCIÓN NO SE PUEDE DESHACER
                </p>
              </div>
              
              <div>
                <Label htmlFor="delete-confirm-phrase" className="text-sm font-medium">
                  Para continuar, escriba exactamente:
                </Label>
                <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-1 mb-2">
                  CONFIRMO ELIMINAR BACKUP
                </p>
                <Input
                  id="delete-confirm-phrase"
                  value={deleteConfirmPhrase}
                  onChange={(e) => setDeleteConfirmPhrase(e.target.value)}
                  placeholder="Escriba la frase de confirmación"
                  className="font-mono"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteDialog(false)
                  setDeleteConfirmPhrase('')
                  setSelectedBackupToDelete(null)
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={deleteBackup}
                disabled={deleting || deleteConfirmPhrase !== 'CONFIRMO ELIMINAR BACKUP'}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Dialog de configuración de programación */}
      {showScheduleDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center mb-6">
              <Calendar className="h-6 w-6 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Configurar Backups Programados</h3>
            </div>
            
            <div className="space-y-6">
              {/* Backup Diario */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Backup Diario</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={schedule.dailyBackup.enabled}
                      onChange={(e) => setSchedule(prev => ({
                        ...prev,
                        dailyBackup: { ...prev.dailyBackup, enabled: e.target.checked }
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                {schedule.dailyBackup.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Hora</Label>
                      <Input
                        type="time"
                        value={schedule.dailyBackup.time}
                        onChange={(e) => setSchedule(prev => ({
                          ...prev,
                          dailyBackup: { ...prev.dailyBackup, time: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Retención (días)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="30"
                        value={schedule.dailyBackup.retentionDays}
                        onChange={(e) => setSchedule(prev => ({
                          ...prev,
                          dailyBackup: { ...prev.dailyBackup, retentionDays: parseInt(e.target.value) || 7 }
                        }))}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Backup Semanal */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Backup Semanal</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={schedule.weeklyBackup.enabled}
                      onChange={(e) => setSchedule(prev => ({
                        ...prev,
                        weeklyBackup: { ...prev.weeklyBackup, enabled: e.target.checked }
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
                
                {schedule.weeklyBackup.enabled && (
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Día</Label>
                      <select
                        value={schedule.weeklyBackup.day}
                        onChange={(e) => setSchedule(prev => ({
                          ...prev,
                          weeklyBackup: { ...prev.weeklyBackup, day: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="sunday">Domingo</option>
                        <option value="monday">Lunes</option>
                        <option value="tuesday">Martes</option>
                        <option value="wednesday">Miércoles</option>
                        <option value="thursday">Jueves</option>
                        <option value="friday">Viernes</option>
                        <option value="saturday">Sábado</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Hora</Label>
                      <Input
                        type="time"
                        value={schedule.weeklyBackup.time}
                        onChange={(e) => setSchedule(prev => ({
                          ...prev,
                          weeklyBackup: { ...prev.weeklyBackup, time: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Retención (semanas)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="12"
                        value={schedule.weeklyBackup.retentionWeeks}
                        onChange={(e) => setSchedule(prev => ({
                          ...prev,
                          weeklyBackup: { ...prev.weeklyBackup, retentionWeeks: parseInt(e.target.value) || 4 }
                        }))}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> Los backups programados requieren configuración adicional del servidor. 
                  Contacte al administrador del sistema para implementar cron jobs o tareas programadas.
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowScheduleDialog(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={saveSchedule}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                Guardar Configuración
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}