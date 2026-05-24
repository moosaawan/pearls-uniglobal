# 🚀 Pearls UniGlobal - Quick Start Guide

## What Has Been Built ✅

### Core Infrastructure
- ✅ **Complete PostgreSQL Database Schema** with 16 tables, RLS policies, indexes
- ✅ **RBAC Middleware** - Role-based access control for all routes
- ✅ **Server Actions** - 30+ server functions for data operations
- ✅ **TypeScript Types** - Full type safety across the app
- ✅ **Global UI Components** - Premium loader, 404 page, error boundary
- ✅ **Sidebar Navigation** - Student, Staff, and Admin sidebars
- ✅ **Reusable Components** - StatCard, DataTable, DashboardForm

### Admin Server Actions (30 total)
- Profile management (CRUD, suspend, role assignment)
- Application management
- Lead CRM operations
- Payment tracking
- Ticket management
- System statistics & revenue reports

---

## 🎯 Next Steps (Priority Order)

### Step 1: Setup Supabase (5 minutes)

**1.1 Create a new Supabase Project**
```bash
# Option A: Via web dashboard (recommended for first time)
Visit: https://app.supabase.com → New Project

# Option B: Via CLI
npm install -g supabase
supabase login
supabase projects create --name "pearls-uniglobal"
```

**1.2 Deploy the Database Schema**
```bash
# Copy the entire content from:
src/lib/db-schema.sql

# Go to Supabase Dashboard → SQL Editor → New Query
# Paste and execute the entire SQL file
```

**1.3 Update Environment Variables**
```bash
# Create .env.local file in project root
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Get these from:
# Supabase Dashboard → Settings → API
```

### Step 2: Setup Authentication (10 minutes)

**2.1 Enable Email/Password Auth**
- Go to Supabase Dashboard → Authentication → Providers
- Enable "Email" provider
- Configure email settings (optional)

**2.2 Add OAuth Providers (Optional)**
- Google OAuth: Get credentials from Google Cloud Console
- Facebook OAuth: Get credentials from Facebook Developers
- Add keys to Supabase Authentication settings

**2.3 Test Login**
```bash
npm run dev
# Visit: http://localhost:3000/login
# Test with email/password signup and login
```

### Step 3: Create Dashboard Page Routes (30 minutes)

The complete directory structure needed:

```
src/app/
  (dashboard)/
    admin/
      page.tsx ← Create
      analytics/page.tsx ← Create
      users/page.tsx ← Create
      staff/page.tsx ← Create
      applications/page.tsx ← Create
      crm/page.tsx ← Create
      finance/page.tsx ← Create
      cms/page.tsx ← Create
      settings/page.tsx ← Create
      layout.tsx ← Create
    staff/
      page.tsx ← Create
      students/page.tsx ← Create
      applications/page.tsx ← Create
      consultations/page.tsx ← Create
      messages/page.tsx ← Create
      analytics/page.tsx ← Create
      settings/page.tsx ← Create
      layout.tsx ← Create
    student/
      page.tsx ✅ (partially done)
      applications/page.tsx ← Create
      documents/page.tsx ← Create
      consultations/page.tsx ← Create
      messages/page.tsx ← Create
      settings/page.tsx ← Create
      layout.tsx ✅ (done)
```

### Step 4: Implement Dashboard Pages (2-3 hours)

**Use the template in `src/lib/DASHBOARD_TEMPLATES.md`**

Example for Student Applications Page:
```typescript
// src/app/(dashboard)/student/applications/page.tsx

import { getStudentApplications } from '@/app/actions'
import { getCurrentUser } from '@/app/actions'
import DataTable from '@/components/dashboard/DataTable'
import StatCard from '@/components/dashboard/StatCard'
import { FileText } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export const metadata = {
  title: 'Applications | Pearls UniGlobal',
}

export default async function ApplicationsPage() {
  const user = await getCurrentUser()
  const applications = await getStudentApplications(user?.id || '')

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Applications</h1>
          <p className="text-white/60">Manage your university applications</p>
        </div>
        <Link href="/dashboard/student/applications/new">
          <Button className="bg-yellow hover:bg-yellow-600 text-black gap-2">
            <Plus size={20} />
            New Application
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total"
          value={applications.length}
          icon={FileText}
          color="blue"
        />
        <StatCard
          label="Accepted"
          value={applications.filter(a => a.status === 'accepted').length}
          icon={FileText}
          color="green"
        />
        <StatCard
          label="Pending"
          value={applications.filter(a => a.status !== 'accepted' && a.status !== 'rejected').length}
          icon={FileText}
          color="yellow"
        />
      </div>

      <DataTable
        columns={[
          {
            header: 'University',
            accessor: (row) => row.university?.name || 'Unknown',
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
              <span className={`px-3 py-1 rounded-full text-sm ${
                status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                'bg-blue-500/20 text-blue-400'
              }`}>
                {status.replace('_', ' ')}
              </span>
            ),
            width: '150px',
          },
        ]}
        data={applications}
        searchFields={['program_name']}
      />
    </div>
  )
}
```

### Step 5: Add Real-time Subscriptions (1 hour)

Example: Real-time application status updates
```typescript
// src/components/RealtimeApplicationStatus.tsx

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Application } from '@/types/database'

export default function RealtimeApplicationStatus({
  userId,
}: {
  userId: string
}) {
  const [applications, setApplications] = useState<Application[]>([])

  useEffect(() => {
    const supabase = createClient()

    // Subscribe to real-time changes
    const subscription = supabase
      .channel(`applications:user_id=eq.${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'applications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          // Update UI instantly
          setApplications((prev) =>
            prev.map((app) =>
              app.id === payload.new.id ? { ...app, ...payload.new } : app
            )
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [userId])

  return <>{/* Render applications */}</>
}
```

### Step 6: Setup File Uploads (30 minutes)

**6.1 Create Supabase Storage Bucket**
```sql
-- Go to Supabase Dashboard → Storage
-- Create bucket: "documents"
-- Make it private (for RLS protection)
```

**6.2 Create Upload Component**
```typescript
// src/components/DocumentUpload.tsx

'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { uploadDocument } from '@/app/actions'
import { toast } from 'sonner'

export default function DocumentUpload() {
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error('Please login first')
        return
      }

      // Upload to Supabase Storage
      const filePath = `${user.id}/${file.name}`
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file, { upsert: true })

      if (error) throw error

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath)

      // Save document record
      await uploadDocument(
        user.id,
        'other',
        publicUrlData.publicUrl,
        file.name,
        file.size,
        file.type
      )

      toast.success('Document uploaded successfully!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
      <input
        type="file"
        onChange={handleFileChange}
        disabled={isUploading}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer text-white/60 hover:text-white"
      >
        {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
      </label>
    </div>
  )
}
```

---

## 📋 Priority Implementation Checklist

### Phase 1: Core Dashboard Pages (Week 1)
- [ ] Student Dashboard (main page)
- [ ] Student Applications (list + create)
- [ ] Student Documents (upload)
- [ ] Staff Dashboard
- [ ] Admin Dashboard

### Phase 2: Advanced Features (Week 2)
- [ ] Consultations booking
- [ ] Real-time messaging
- [ ] Document verification workflow
- [ ] Admin user management
- [ ] CRM leads pipeline

### Phase 3: Polish & Optimization (Week 3)
- [ ] Analytics dashboards
- [ ] Payment integration
- [ ] Email notifications
- [ ] Performance optimization
- [ ] Security hardening

---

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm build

# Start production server
npm start

# Run linting
npm lint

# Open Supabase dashboard
supabase studios
```

---

## 🔐 Security Checklist

- [ ] Enable RLS on all tables (✅ done in schema)
- [ ] Setup CORS for API requests
- [ ] Add rate limiting to API routes
- [ ] Implement CSRF protection
- [ ] Add input validation on all forms
- [ ] Use environment variables for secrets
- [ ] Enable SSL/TLS in production
- [ ] Setup security headers in Next.js
- [ ] Implement audit logging
- [ ] Add 2FA for admin accounts (optional)

---

## 📞 Support Resources

1. **Supabase Docs**: https://supabase.com/docs
2. **Next.js 15 Docs**: https://nextjs.org/docs
3. **TypeScript Docs**: https://www.typescriptlang.org/docs/
4. **Tailwind CSS**: https://tailwindcss.com/docs
5. **Framer Motion**: https://www.framer.com/motion/

---

## ⚡ Common Issues & Solutions

### Issue: "User not found" when accessing dashboard
**Solution**: Make sure user profile was created in the `profiles` table during signup

### Issue: RLS policies blocking data
**Solution**: Check that `auth.uid()` matches the user's `id` in the profiles table

### Issue: Real-time subscriptions not working
**Solution**: Ensure table has RLS enabled and user has SELECT permission

### Issue: File uploads failing
**Solution**: Check that storage bucket exists and user has INSERT permission

---

## 📦 What's Included

- **Database Schema**: 16 tables, 40+ columns, full relationships
- **Server Actions**: 30+ production-ready functions
- **UI Components**: Reusable dashboards components
- **Middleware**: RBAC protected routes
- **TypeScript**: Full type safety
- **Animations**: Framer Motion smooth transitions
- **Styling**: Tailwind CSS + gradient design system

---

## 🎓 Learning Path

1. **Start Here**: Read `IMPLEMENTATION.md` for complete overview
2. **Setup**: Follow this guide step-by-step
3. **Templates**: Use `src/lib/DASHBOARD_TEMPLATES.md` for page patterns
4. **Build**: Create pages following the templates
5. **Deploy**: Test locally, then deploy to Vercel

---

## 🚀 Deployment to Production

### Vercel (Recommended)

```bash
# 1. Push code to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. Go to vercel.com → Import Project
# 3. Select your GitHub repo
# 4. Add environment variables
# 5. Deploy!
```

### Environment Variables for Production
```
NEXT_PUBLIC_SUPABASE_URL=your_prod_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_prod_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_prod_service_key
```

---

## 📊 Architecture

```
┌─────────────────────────────┐
│   Next.js 15 Frontend       │
│  (Client & Server Rendering)│
└──────────────┬──────────────┘
               │
        ┌──────┴──────────┐
        │                 │
   ┌────▼─────┐    ┌─────▼──────┐
   │  Layouts  │    │ Server     │
   │ Components│    │ Actions    │
   └────┬─────┘    └─────┬──────┘
        │                │
   ┌────▼────────────────▼────┐
   │ Supabase SDK (JS/SSR)     │
   │ - Auth & Sessions         │
   │ - Database                │
   │ - Real-time              │
   │ - Storage                │
   └────┬────────────────────┘
        │
   ┌────▼────────────────────┐
   │ PostgreSQL              │
   │ - 16 tables             │
   │ - RLS Policies          │
   │ - Relationships         │
   └────────────────────────┘
```

---

## ✨ Next: Build Your First Page!

**Ready to get started?** Pick one page from the priority list and follow the template in `src/lib/DASHBOARD_TEMPLATES.md`.

**Questions?** Check the errors in browser console and Supabase dashboard logs.

**Need help?** Refer to the documentation links at the bottom of this file.

---

**Last Updated**: May 24, 2026  
**Status**: Infrastructure complete, pages ready to be built  
**Estimated Completion**: 1-2 weeks with full feature implementation
