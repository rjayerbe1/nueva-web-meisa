'use client'

import { motion } from 'framer-motion'

interface StatCardProps {
  number: string
  label: string
  suffix?: string
  index?: number
  variant?: 'default' | 'large' | 'compact'
  colorScheme?: 'blue' | 'gray' | 'gradient'
}

export function UnifiedStatsCard({ 
  number, 
  label, 
  suffix = '', 
  index = 0,
  variant = 'default',
  colorScheme = 'blue'
}: StatCardProps) {
  const getCardClasses = () => {
    switch (variant) {
      case 'large':
        return 'p-12'
      case 'compact':
        return 'p-6'
      default:
        return 'p-10'
    }
  }

  const getNumberClasses = () => {
    switch (variant) {
      case 'large':
        return 'text-7xl lg:text-8xl'
      case 'compact':
        return 'text-4xl lg:text-5xl'
      default:
        return 'text-6xl lg:text-7xl'
    }
  }

  const getSuffixClasses = () => {
    switch (variant) {
      case 'large':
        return 'text-3xl lg:text-4xl'
      case 'compact':
        return 'text-lg lg:text-xl'
      default:
        return 'text-xl lg:text-2xl'
    }
  }

  const getBackgroundNumberClasses = () => {
    switch (variant) {
      case 'large':
        return 'text-[100px]'
      case 'compact':
        return 'text-[60px]'
      default:
        return 'text-[90px]'
    }
  }

  const getGradientColors = () => {
    switch (colorScheme) {
      case 'gray':
        return 'from-gray-600 to-gray-800'
      case 'gradient':
        return 'from-blue-600 via-blue-700 to-blue-800'
      default:
        return 'from-blue-600 to-blue-800'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="relative"
    >
      <div className={`relative bg-white rounded-3xl ${getCardClasses()} h-full group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl`}>
        {/* Gradient overlay on hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getGradientColors()} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

        {/* Inner white background */}
        <div className="absolute inset-[2px] bg-white rounded-3xl shadow-inner" />
        
        {/* Content */}
        <div className="relative">
          {/* Number container with background effect */}
          <div className={`mb-3 relative ${suffix ? 'h-32' : 'h-28'}`}>
            {/* Large background number - always centered */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.07]">
              <span className={`${getBackgroundNumberClasses()} font-black text-gray-900`}>
                {number}
              </span>
            </div>

            {/* Main number display - also absolute, perfectly centered */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`${getNumberClasses()} font-black bg-gradient-to-br ${getGradientColors()} bg-clip-text text-transparent`}>
                {number}
              </span>
            </div>

            {/* Suffix below - positioned at bottom */}
            {suffix && (
              <div className="absolute bottom-0 left-0 right-0 text-center">
                <span className={`${getSuffixClasses()} font-semibold text-gray-500`}>
                  {suffix}
                </span>
              </div>
            )}
          </div>
          
          {/* Label */}
          <p className="text-gray-700 font-semibold text-lg text-center leading-snug">
            {label}
          </p>
          
          {/* Decorative line */}
          <div className="h-1 bg-blue-100 mx-auto mt-4 rounded-full" style={{ width: '4rem' }} />
        </div>
      </div>
    </motion.div>
  )
}

interface StatsGridProps {
  title?: string
  subtitle?: string
  stats: Array<{
    number: string
    label: string
    suffix?: string
  }>
  variant?: 'default' | 'large' | 'compact'
  colorScheme?: 'blue' | 'gray' | 'gradient'
  columns?: 2 | 3 | 4
  showDecorator?: boolean
}

export function UnifiedStatsGrid({ 
  title,
  subtitle,
  stats, 
  variant = 'default',
  colorScheme = 'blue',
  columns = 4,
  showDecorator = true
}: StatsGridProps) {
  const getGridClasses = () => {
    switch (columns) {
      case 2:
        return 'grid-cols-1 md:grid-cols-2'
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    }
  }

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      {(title || subtitle) && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          {title && (
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              {subtitle}
            </p>
          )}
          <div className="w-24 h-1 bg-blue-100 mx-auto rounded-full" />
        </motion.div>
      )}
      
      {/* Stats Grid */}
      <div className={`grid ${getGridClasses()} gap-8 lg:gap-12`}>
        {stats.map((stat, index) => (
          <UnifiedStatsCard
            key={index}
            number={stat.number}
            label={stat.label}
            suffix={stat.suffix}
            index={index}
            variant={variant}
            colorScheme={colorScheme}
          />
        ))}
      </div>
      
      {/* Decorative element */}
      {showDecorator && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 flex justify-center"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-[2px] bg-blue-100" />
            <div className="w-3 h-3 bg-blue-100 rounded-full" />
            <div className="w-12 h-[2px] bg-blue-100" />
          </div>
        </motion.div>
      )}
    </div>
  )
}