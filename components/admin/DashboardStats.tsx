"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  FolderOpen, 
  Users, 
  DollarSign, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react"

interface StatsData {
  proyectosActivos: number
  proyectosCompletados: number
  clientesActivos: number
  presupuestoTotal: number
  ingresosMes: number
  proyectosPendientes: number
  tendenciaMes: number
}

const statsCards = [
  {
    title: "Proyectos Activos",
    key: "proyectosActivos" as keyof StatsData,
    icon: FolderOpen,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    format: (value: number) => value.toString()
  },
  {
    title: "Completados",
    key: "proyectosCompletados" as keyof StatsData,
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100",
    format: (value: number) => value.toString()
  },
  {
    title: "Presupuesto Total",
    key: "presupuestoTotal" as keyof StatsData,
    icon: DollarSign,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    format: (value: number) => new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  },
  {
    title: "Clientes Activos",
    key: "clientesActivos" as keyof StatsData,
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    format: (value: number) => value.toString()
  }
]

export function DashboardStats() {
  const [stats, setStats] = useState<StatsData>({
    proyectosActivos: 0,
    proyectosCompletados: 0,
    clientesActivos: 0,
    presupuestoTotal: 0,
    ingresosMes: 0,
    proyectosPendientes: 0,
    tendenciaMes: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
        // Datos de ejemplo para desarrollo
        setStats({
          proyectosActivos: 12,
          proyectosCompletados: 45,
          clientesActivos: 28,
          presupuestoTotal: 2500000000,
          ingresosMes: 450000000,
          proyectosPendientes: 8,
          tendenciaMes: 15.4
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statsCards.map((card, index) => {
        const IconComponent = card.icon
        const value = stats[card.key]
        
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1,
              ease: [0.25, 0.25, 0, 1]
            }}
          >
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={`${card.bgColor} p-2 rounded-lg`}>
                  <IconComponent className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              
              <CardContent>
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.1 + 0.2,
                    type: "spring",
                    stiffness: 200
                  }}
                  className="text-2xl font-bold text-gray-900"
                >
                  {loading ? (
                    <div className="h-8 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    card.format(value)
                  )}
                </motion.div>
                
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-600 font-medium">
                    +{stats.tendenciaMes}% vs mes anterior
                  </span>
                </div>
              </CardContent>

              {/* Animated background decoration */}
              <motion.div
                className={`absolute -right-4 -top-4 w-20 h-20 ${card.bgColor} rounded-full opacity-10`}
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}