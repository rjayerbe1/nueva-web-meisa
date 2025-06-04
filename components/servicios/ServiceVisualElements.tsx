'use client'

import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building2,
  Shield,
  Award,
  Clock,
  Target
} from 'lucide-react'

interface StatCardProps {
  icon: React.ElementType
  value: string
  label: string
  color: string
  delay?: number
}

export function StatCard({ icon: Icon, value, label, color, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center mb-4`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
      <p className="text-gray-600">{label}</p>
    </motion.div>
  )
}

interface ProgressBarProps {
  label: string
  percentage: number
  color: string
  delay?: number
}

export function ProgressBar({ label, percentage, color, delay = 0 }: ProgressBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="mb-6"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-700 font-medium">{label}</span>
        <span className="text-gray-600">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: delay + 0.2 }}
          viewport={{ once: true }}
          className={`h-full ${color} rounded-full`}
        />
      </div>
    </motion.div>
  )
}

interface TimelineItemProps {
  phase: string
  title: string
  description: string
  isActive?: boolean
  isCompleted?: boolean
  index: number
}

export function TimelineItem({ phase, title, description, isActive, isCompleted, index }: TimelineItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`relative pl-8 pb-12 ${index === 0 ? '' : 'border-l-2 border-gray-300'}`}
    >
      <div className={`absolute -left-3 w-6 h-6 rounded-full ${
        isCompleted ? 'bg-green-500' : isActive ? 'bg-blue-600' : 'bg-gray-400'
      } border-4 border-white shadow-md`} />
      
      <div className={`bg-white rounded-xl p-6 shadow-md ${
        isActive ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      }`}>
        <div className="flex items-center gap-3 mb-3">
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
            isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
          }`}>
            {phase}
          </span>
          {isCompleted && (
            <span className="text-green-500 text-sm font-medium">Completado</span>
          )}
        </div>
        <h4 className="text-lg font-bold text-gray-900 mb-2">{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  )
}

interface CapabilityChartProps {
  capabilities: Array<{
    name: string
    level: number
  }>
  color: string
}

export function CapabilityChart({ capabilities, color }: CapabilityChartProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <BarChart3 className="w-6 h-6 text-blue-600" />
        Niveles de Capacidad
      </h3>
      
      <div className="space-y-4">
        {capabilities.map((capability, index) => (
          <ProgressBar
            key={index}
            label={capability.name}
            percentage={capability.level}
            color={color}
            delay={index * 0.1}
          />
        ))}
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: React.ElementType
  color: string
}

export function MetricCard({ title, value, change, trend, icon: Icon, color }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          <TrendingUp className={`w-4 h-4 ${trend === 'down' ? 'rotate-180' : ''}`} />
          {change}
        </div>
      </div>
      
      <h4 className="text-gray-600 text-sm mb-1">{title}</h4>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </motion.div>
  )
}

interface ProcessFlowProps {
  steps: Array<{
    title: string
    description: string
    icon: React.ElementType
  }>
  color: string
}

export function ProcessFlow({ steps, color }: ProcessFlowProps) {
  return (
    <div className="relative">
      {/* Connection line */}
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 hidden lg:block" />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                <div className={`w-20 h-20 ${color} rounded-full flex items-center justify-center mx-auto mb-4 relative z-10`}>
                  <Icon className="w-10 h-10 text-white" />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                    <span className="text-sm font-bold text-gray-700">{index + 1}</span>
                  </div>
                </div>
                
                <h4 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h4>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
              
              {/* Arrow connector */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M8 16L24 16M24 16L18 10M24 16L18 22" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

interface RadarChartProps {
  data: Array<{
    label: string
    value: number
  }>
  color: string
}

export function RadarChart({ data, color }: RadarChartProps) {
  const maxValue = 100
  const centerX = 150
  const centerY = 150
  const radius = 120
  const angleStep = (2 * Math.PI) / data.length

  const points = data.map((item, index) => {
    const angle = index * angleStep - Math.PI / 2
    const x = centerX + (radius * item.value / maxValue) * Math.cos(angle)
    const y = centerY + (radius * item.value / maxValue) * Math.sin(angle)
    return { x, y, angle, ...item }
  })

  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ') + ' Z'

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
        Evaluación de Competencias
      </h3>
      
      <div className="relative w-full max-w-sm mx-auto">
        <svg viewBox="0 0 300 300" className="w-full h-full">
          {/* Grid circles */}
          {[20, 40, 60, 80, 100].map((percentage) => (
            <circle
              key={percentage}
              cx={centerX}
              cy={centerY}
              r={radius * percentage / 100}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          ))}
          
          {/* Grid lines */}
          {data.map((_, index) => {
            const angle = index * angleStep - Math.PI / 2
            const x2 = centerX + radius * Math.cos(angle)
            const y2 = centerY + radius * Math.sin(angle)
            return (
              <line
                key={index}
                x1={centerX}
                y1={centerY}
                x2={x2}
                y2={y2}
                stroke="#E5E7EB"
                strokeWidth="1"
              />
            )
          })}
          
          {/* Data polygon */}
          <motion.path
            d={pathData}
            fill={color}
            fillOpacity="0.3"
            stroke={color}
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, type: "spring" }}
          />
          
          {/* Data points */}
          {points.map((point, index) => (
            <motion.circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="5"
              fill={color}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            />
          ))}
          
          {/* Labels */}
          {points.map((point, index) => {
            const labelRadius = radius + 20
            const x = centerX + labelRadius * Math.cos(point.angle)
            const y = centerY + labelRadius * Math.sin(point.angle)
            
            return (
              <text
                key={index}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-medium fill-gray-700"
              >
                {point.label}
              </text>
            )
          })}
        </svg>
      </div>
      
      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{item.label}:</span>
            <span className="font-medium text-gray-900">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

interface ComparisonTableProps {
  title: string
  headers: string[]
  rows: Array<{
    feature: string
    values: (string | boolean)[]
  }>
  highlightColumn?: number
}

export function ComparisonTable({ title, headers, rows, highlightColumn }: ComparisonTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Característica
              </th>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className={`px-6 py-4 text-center text-sm font-semibold ${
                    highlightColumn === index + 1
                      ? 'bg-blue-50 text-blue-900'
                      : 'text-gray-900'
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-gray-100">
                <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                  {row.feature}
                </td>
                {row.values.map((value, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-6 py-4 text-center ${
                      highlightColumn === colIndex + 1 ? 'bg-blue-50' : ''
                    }`}
                  >
                    {typeof value === 'boolean' ? (
                      value ? (
                        <div className="w-6 h-6 bg-green-500 rounded-full mx-auto flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-6 h-6 bg-gray-300 rounded-full mx-auto flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                      )
                    ) : (
                      <span className="text-sm text-gray-700">{value}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}