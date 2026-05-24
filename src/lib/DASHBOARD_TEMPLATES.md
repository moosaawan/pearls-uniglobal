// ============================================
// DASHBOARD PAGE TEMPLATES
// ============================================

/**
 * STUDENT DASHBOARD PAGE TEMPLATE
 * Copy and customize for each page
 */

// File: src/app/(dashboard)/student/[section]/page.tsx

export const metadata = {
  title: 'Section Name | Pearls UniGlobal',
  description: 'Manage your section content',
}

export default async function SectionPage() {
  // 1. Get current user
  // const user = await getCurrentUser()

  // 2. Fetch data
  // const data = await fetchData(user?.id)

  // 3. Render page
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Section Title</h1>
        <p className="text-white/60">Description here</p>
      </div>

      {/* Content */}
      {/* Add your components here */}
    </div>
  )
}

/**
 * CREATING A LIST PAGE WITH REAL DATA
 * Example: Applications list
 */

import { getStudentApplications } from '@/app/actions'
import DataTable from '@/components/dashboard/DataTable'
import { Badge } from '@/components/ui/badge'

export default async function ApplicationsPage() {
  const applications = await getStudentApplications(userId)

  return (
    <DataTable
      columns={[
        {
          header: 'University',
          accessor: (row) => row.university?.name || 'N/A',
          width: '200px',
        },
        {
          header: 'Program',
          accessor: 'program_name',
          width: '200px',
        },
        {
          header: 'Status',
          accessor: 'status',
          render: (value) => (
            <Badge
              className={
                value === 'accepted'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-blue-500/20 text-blue-400'
              }
            >
              {value}
            </Badge>
          ),
          width: '150px',
        },
        {
          header: 'Submitted',
          accessor: 'submitted_at',
          render: (value) =>
            value ? new Date(value).toLocaleDateString() : '-',
          width: '150px',
        },
      ]}
      data={applications}
      searchFields={['program_name']}
      onRowClick={(row) => {
        // Navigate to details page
      }}
    />
  )
}

/**
 * CREATING A FORM PAGE
 * Example: Application form
 */

import DashboardForm from '@/components/dashboard/DashboardForm'
import { createApplication } from '@/app/actions'

export default function NewApplicationPage() {
  return (
    <DashboardForm
      fields={[
        {
          name: 'university_id',
          label: 'Select University',
          type: 'select',
          options: universities.map((u) => ({
            label: u.name,
            value: u.id,
          })),
          required: true,
        },
        {
          name: 'program_name',
          label: 'Program Name',
          type: 'text',
          placeholder: 'e.g., Bachelor of Science in Computer Science',
          required: true,
        },
      ]}
      onSubmit={async (data) => {
        await createApplication(userId, data.university_id, data.program_name)
      }}
      submitLabel="Create Application"
    />
  )
}

/**
 * COMMON PATTERNS
 */

// Pattern 1: Loading state
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <PageContent />
    </Suspense>
  )
}

// Pattern 2: Error handling with try-catch
export default async function Page() {
  try {
    const data = await fetchData()
    return <Content data={data} />
  } catch (error) {
    return <ErrorComponent error={error} />
  }
}

// Pattern 3: Real-time data with subscription
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function RealtimePage() {
  const [data, setData] = useState([])

  useEffect(() => {
    const supabase = createClient()
    
    // Subscribe to changes
    const subscription = supabase
      .channel('table_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'table_name',
      }, (payload) => {
        // Update data in real-time
        setData((prev) => [...prev, payload.new])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [])

  return <Content data={data} />
}

// Pattern 4: Animated list with motion
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
}

export default function ListPage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-4"
    >
      {items.map((item) => (
        <motion.div key={item.id} variants={itemVariants}>
          {/* Item content */}
        </motion.div>
      ))}
    </motion.div>
  )
}

/**
 * HELPER FUNCTIONS
 */

// Format date
export function formatDate(date: string | null) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Format currency
export function formatCurrency(amount: number, currency = 'PKR') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

// Format percentage
export function formatPercentage(value: number) {
  return `${(value * 100).toFixed(1)}%`
}

// Get status color
export function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    accepted: 'bg-green-500/20 text-green-400',
    rejected: 'bg-red-500/20 text-red-400',
    pending: 'bg-yellow-500/20 text-yellow-400',
    submitted: 'bg-blue-500/20 text-blue-400',
    draft: 'bg-gray-500/20 text-gray-400',
  }
  return colors[status] || 'bg-gray-500/20 text-gray-400'
}

/**
 * EXAMPLE: Complete page with all patterns
 */

import { motion } from 'framer-motion'
import { Suspense } from 'react'
import StatCard from '@/components/dashboard/StatCard'
import DataTable from '@/components/dashboard/DataTable'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, FileText } from 'lucide-react'

export const metadata = {
  title: 'Applications | Pearls UniGlobal',
}

async function ApplicationsContent() {
  const applications = await getStudentApplications(userId)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header with action */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Applications</h1>
          <p className="text-white/60">Track all your university applications</p>
        </div>
        <Link href="/dashboard/student/applications/new">
          <Button className="bg-yellow hover:bg-yellow-600 text-black gap-2">
            <Plus size={20} />
            New Application
          </Button>
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total"
          value={applications.length}
          icon={FileText}
          color="blue"
        />
        <StatCard
          label="Accepted"
          value={applications.filter((a) => a.status === 'accepted').length}
          icon={FileText}
          color="green"
        />
        <StatCard
          label="Pending"
          value={applications.filter((a) => a.status === 'submitted').length}
          icon={FileText}
          color="yellow"
        />
      </div>

      {/* Table */}
      <DataTable
        columns={[
          {
            header: 'University',
            accessor: (row) => row.university?.name,
            width: '200px',
          },
          {
            header: 'Program',
            accessor: 'program_name',
            width: '200px',
          },
          {
            header: 'Status',
            accessor: 'status',
            render: (status) => (
              <Badge className={getStatusColor(status)}>
                {status.replace('_', ' ')}
              </Badge>
            ),
            width: '150px',
          },
          {
            header: 'Submitted',
            accessor: 'submitted_at',
            render: (date) => formatDate(date),
            width: '150px',
          },
        ]}
        data={applications}
        searchFields={['program_name']}
        emptyMessage="No applications yet. Create one to get started!"
      />
    </motion.div>
  )
}

function ApplicationsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-20 bg-white/5 rounded-lg animate-pulse" />
      <div className="grid grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-white/5 rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  )
}

export default function ApplicationsPage() {
  return (
    <Suspense fallback={<ApplicationsSkeleton />}>
      <ApplicationsContent />
    </Suspense>
  )
}
