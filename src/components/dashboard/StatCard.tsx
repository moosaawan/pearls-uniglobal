'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'orange'
  subtext?: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

const colorMap = {
  blue: 'from-blue/20 to-blue/5 hover:border-blue/30',
  green: 'from-green/20 to-green/5 hover:border-green/30',
  purple: 'from-purple/20 to-purple/5 hover:border-purple/30',
  yellow: 'from-yellow/20 to-yellow/5 hover:border-yellow/30',
  red: 'from-red/20 to-red/5 hover:border-red/30',
  orange: 'from-orange/20 to-orange/5 hover:border-orange/30',
}

const iconColorMap = {
  blue: 'text-blue-400',
  green: 'text-green-400',
  purple: 'text-purple-400',
  yellow: 'text-yellow-400',
  red: 'text-red-400',
  orange: 'text-orange-400',
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  color,
  subtext,
  trend,
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br ${colorMap[color]} p-6 backdrop-blur transition-all group`}
    >
      {/* Background blur */}
      <div className={`absolute -right-8 -top-8 h-24 w-24 bg-${color}/10 rounded-full blur-2xl group-hover:bg-${color}/20 transition-colors`} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-white/60 text-sm font-medium">{label}</p>
          <Icon size={20} className={iconColorMap[color]} />
        </div>

        {/* Value */}
        <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>

        {/* Subtext */}
        {subtext && <p className="text-xs text-white/50">{subtext}</p>}

        {/* Trend */}
        {trend && (
          <div className="mt-3 flex items-center gap-1 text-xs">
            <span className={trend.isPositive ? 'text-green-400' : 'text-red-400'}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}%
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
