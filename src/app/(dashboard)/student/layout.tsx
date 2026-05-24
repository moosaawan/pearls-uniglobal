'use client'

import { useState } from 'react'
import StudentSidebar from '@/components/dashboard/StudentSidebar'
import StudentTopBar from '@/components/dashboard/StudentTopBar'
import { motion } from 'framer-motion'

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <StudentSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <StudentTopBar
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Page Content */}
        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-y-auto"
        >
          <div className="p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  )
}
