"use client"

import { useState } from "react"
import { Download } from "lucide-react"

interface ReportData {
  totalProyectos: number
  proyectosCompletados: number
  proyectosEnProgreso: number
  proyectosPausados: number
  presupuestoTotal: number
  proyectosPorCategoria: Record<string, number>
  contactosPorMes: Record<string, number>
  totalServicios: number
  totalContactos: number
  contactosNoLeidos: number
  totalEquipo: number
}

interface ReportsExportProps {
  data: ReportData
}

export default function ReportsExport({ data }: ReportsExportProps) {
  const [isExporting, setIsExporting] = useState(false)

  const exportToCSV = () => {
    setIsExporting(true)
    
    try {
      // Crear datos CSV
      const csvData = [
        // Header
        ['Métrica', 'Valor'],
        // Datos generales
        ['Total de Proyectos', data.totalProyectos.toString()],
        ['Proyectos Completados', data.proyectosCompletados.toString()],
        ['Proyectos En Progreso', data.proyectosEnProgreso.toString()],
        ['Proyectos Pausados', data.proyectosPausados.toString()],
        ['Presupuesto Total (COP)', data.presupuestoTotal.toString()],
        ['Total de Servicios', data.totalServicios.toString()],
        ['Total de Contactos', data.totalContactos.toString()],
        ['Contactos No Leídos', data.contactosNoLeidos.toString()],
        ['Total del Equipo', data.totalEquipo.toString()],
        [''],
        ['Proyectos por Categoría', ''],
        ...Object.entries(data.proyectosPorCategoria).map(([categoria, count]) => [
          categoria.replace('_', ' '), 
          count.toString()
        ]),
        [''],
        ['Contactos por Mes', ''],
        ...Object.entries(data.contactosPorMes).map(([mes, count]) => [
          mes, 
          count.toString()
        ])
      ]

      // Convertir a CSV
      const csvContent = csvData.map(row => 
        row.map(field => `"${field}"`).join(',')
      ).join('\n')

      // Crear y descargar archivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `reporte-meisa-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
    } catch (error) {
      console.error('Error exporting report:', error)
      alert('Error al exportar el reporte')
    } finally {
      setIsExporting(false)
    }
  }

  const exportToPDF = async () => {
    setIsExporting(true)
    
    try {
      // Crear contenido HTML para PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Reporte MEISA - ${new Date().toLocaleDateString('es-ES')}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 40px; }
            .metric { margin: 10px 0; padding: 10px; border-left: 3px solid #1d4ed8; }
            .section { margin: 30px 0; }
            .section h2 { color: #1d4ed8; border-bottom: 2px solid #1d4ed8; padding-bottom: 10px; }
            .grid { display: flex; flex-wrap: wrap; gap: 20px; }
            .card { flex: 1; min-width: 200px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f8f9fa; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Reporte de Estadísticas MEISA</h1>
            <p>Generado el ${new Date().toLocaleDateString('es-ES', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>

          <div class="section">
            <h2>Métricas Principales</h2>
            <div class="grid">
              <div class="card">
                <h3>Proyectos Totales</h3>
                <p style="font-size: 24px; font-weight: bold; color: #1d4ed8;">${data.totalProyectos}</p>
              </div>
              <div class="card">
                <h3>Presupuesto Total</h3>
                <p style="font-size: 24px; font-weight: bold; color: #059669;">$${new Intl.NumberFormat('es-CO').format(data.presupuestoTotal)} COP</p>
              </div>
              <div class="card">
                <h3>Contactos</h3>
                <p style="font-size: 24px; font-weight: bold; color: #dc2626;">${data.totalContactos}</p>
              </div>
              <div class="card">
                <h3>Equipo</h3>
                <p style="font-size: 24px; font-weight: bold; color: #7c3aed;">${data.totalEquipo}</p>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Estado de Proyectos</h2>
            <table>
              <tr><th>Estado</th><th>Cantidad</th><th>Porcentaje</th></tr>
              <tr><td>Completados</td><td>${data.proyectosCompletados}</td><td>${((data.proyectosCompletados / data.totalProyectos) * 100).toFixed(1)}%</td></tr>
              <tr><td>En Progreso</td><td>${data.proyectosEnProgreso}</td><td>${((data.proyectosEnProgreso / data.totalProyectos) * 100).toFixed(1)}%</td></tr>
              <tr><td>Pausados</td><td>${data.proyectosPausados}</td><td>${((data.proyectosPausados / data.totalProyectos) * 100).toFixed(1)}%</td></tr>
            </table>
          </div>

          <div class="section">
            <h2>Proyectos por Categoría</h2>
            <table>
              <tr><th>Categoría</th><th>Cantidad</th></tr>
              ${Object.entries(data.proyectosPorCategoria).map(([categoria, count]) => 
                `<tr><td>${categoria.replace('_', ' ')}</td><td>${count}</td></tr>`
              ).join('')}
            </table>
          </div>

          <div class="section">
            <h2>Contactos por Mes</h2>
            <table>
              <tr><th>Mes</th><th>Contactos</th></tr>
              ${Object.entries(data.contactosPorMes).map(([mes, count]) => 
                `<tr><td>${mes}</td><td>${count}</td></tr>`
              ).join('')}
            </table>
          </div>
        </body>
        </html>
      `

      // Abrir ventana para imprimir/guardar como PDF
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(htmlContent)
        printWindow.document.close()
        printWindow.focus()
        setTimeout(() => {
          printWindow.print()
        }, 500)
      }
      
    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('Error al exportar el PDF')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="relative">
      <button 
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-meisa-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-meisa-blue transition-colors"
        onClick={() => {
          const menu = document.getElementById('export-menu')
          if (menu) {
            menu.classList.toggle('hidden')
          }
        }}
        disabled={isExporting}
      >
        <Download className="h-5 w-5 mr-2" />
        {isExporting ? 'Exportando...' : 'Exportar Reporte'}
      </button>

      {/* Dropdown menu */}
      <div 
        id="export-menu"
        className="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10"
      >
        <div className="py-1">
          <button
            onClick={() => {
              document.getElementById('export-menu')?.classList.add('hidden')
              exportToCSV()
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar como CSV
          </button>
          <button
            onClick={() => {
              document.getElementById('export-menu')?.classList.add('hidden')
              exportToPDF()
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar como PDF
          </button>
        </div>
      </div>
    </div>
  )
}