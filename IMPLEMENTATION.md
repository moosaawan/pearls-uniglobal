# Pearls UniGlobal - Enterprise Dashboard Implementation Guide

## ✅ Completed Components

### 1. **Database Schema** (`src/lib/db-schema.sql`)
Complete PostgreSQL schema with:
- User & Profile tables with role-based structure
- Student & Staff profiles with specialized fields
- Universities, Applications, and Application Statuses
- Documents with verification workflow
- Consultations scheduling system
- Tickets & Support system
- Real-time Messaging with Conversations
- Payments & Invoicing system
- Notifications queue
- Activity Logs for audit trail
- CRM Leads management
- Settings configuration
- **RLS Policies** for row-level security
- **Indexes** for query performance
- **Default roles** pre-populated

### 2. **TypeScript Types** (`src/types/database.ts`)
Comprehensive types for all entities:
- UserRole enum (student, staff, admin, super_admin)
- All status types (ApplicationStatus, DocumentStatus, etc.)
- Full interface definitions for every table
- Proper null handling and optional fields

### 3. **Server Actions** (`src/app/actions.ts`)
Production-ready server actions:
- User authentication & role checking
- Profile management (Student, Staff, Admin)
- Application CRUD operations
- University management
- Document upload & verification
- Consultation booking
- Ticket creation & replies
- Notifications system
- Leads management
- Payments tracking
- Dashboard statistics

### 4. **RBAC Middleware** (`src/lib/supabase/middleware.ts`)
Complete role-based access control:
- Public route handling
- Protected route authentication
- Role-based route authorization
- Automatic redirects based on role
- Session management
- Public → Auth routes → Protected routes logic

### 5. **Global UI Components**
- **Global Loader** (`src/components/ui/global-loader.tsx`) - Navy + Gold premium loader
- **404 Page** (`src/app/not-found.tsx`) - Animated error page
- **Error Boundary** (`src/app/error.tsx`) - Global error handling

### 6. **Student Dashboard**
- **Layout** (`src/app/(dashboard)/student/layout.tsx`) - Dashboard wrapper
- **Sidebar** (`src/components/dashboard/StudentSidebar.tsx`) - Navigation with 6 sections
- **Top Bar** (`src/components/dashboard/StudentTopBar.tsx`) - Header with notifications & theme toggle

---

## 🚀 Next Steps to Complete

### Step 1: Deploy Database Schema to Supabase

```bash
# 1. Go to Supabase dashboard
# 2. Navigate to SQL Editor
# 3. Copy entire content from src/lib/db-schema.sql
# 4. Paste and execute
# OR use Supabase CLI:

supabase db push
```

### Step 2: Update Environment Variables
Create/update `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

### Step 3: Complete Dashboard Pages

Create the following pages with real data binding:

```
/dashboard/student/
  ├── page.tsx ✅ (create proper implementation)
  ├── applications/
  │   ├── page.tsx (list all applications)
  │   └── [id]/
  │       └── page.tsx (application details)
  ├── documents/
  │   ├── page.tsx (document management)
  │   └── upload/page.tsx (upload form)
  ├── consultations/
  │   ├── page.tsx (view consultations)
  │   └── book/page.tsx (booking form)
  ├── messages/
  │   ├── page.tsx (conversations list)
  │   └── [id]/page.tsx (chat view)
  └── settings/
      └── page.tsx (profile settings)
```

### Step 4: Staff Dashboard Pages

```
/dashboard/staff/
  ├── page.tsx (stats & overview)
  ├── students/
  │   ├── page.tsx (students list)
  │   └── [id]/page.tsx (student profile)
  ├── applications/
  │   └── page.tsx (review applications)
  ├── documents/
  │   └── page.tsx (verify documents)
  ├── consultations/
  │   └── page.tsx (manage meetings)
  ├── messages/
  │   └── page.tsx (staff messaging)
  └── settings/
      └── page.tsx (staff settings)
```

### Step 5: Admin Dashboard Pages

```
/dashboard/admin/
  ├── page.tsx (main dashboard)
  ├── users/
  │   ├── page.tsx (user management)
  │   └── [id]/page.tsx (user profile)
  ├── staff/
  │   ├── page.tsx (staff management)
  │   └── [id]/page.tsx (staff profile)
  ├── applications/
  │   └── page.tsx (all applications)
  ├── crm/
  │   ├── page.tsx (leads pipeline)
  │   └── [id]/page.tsx (lead details)
  ├── finance/
  │   └── page.tsx (revenue analytics)
  ├── cms/
  │   ├── page.tsx (content management)
  │   └── [id]/edit/page.tsx (edit content)
  ├── analytics/
  │   └── page.tsx (charts & reports)
  └── settings/
      ├── page.tsx (system settings)
      ├── roles/page.tsx (role management)
      └── oauth/page.tsx (OAuth config)
```

### Step 6: Real-time Features

Add real-time subscriptions to critical components:

```typescript
// Example: Real-time application status updates
const subscription = supabase
  .channel(`applications:user_id=eq.${userId}`)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'applications',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    // Update UI instantly
  })
  .subscribe()
```

---

## 📊 Feature Checklist

### Authentication ✅
- [x] Login with email/password
- [x] Register new account
- [x] Forgot password flow
- [x] OAuth login ready
- [ ] Email verification
- [ ] Session persistence
- [ ] 2FA setup (optional)

### Student Features
- [ ] Dashboard with live stats
- [ ] Application forms & status tracking
- [ ] Document upload with verification
- [ ] Consultation booking
- [ ] IELTS package purchase
- [ ] Tickets & support
- [ ] Real-time messaging
- [ ] Payment & invoices
- [ ] Settings & profile management

### Staff Features
- [ ] Dashboard with assignments
- [ ] Student list with search/filter
- [ ] Application review workflow
- [ ] Document verification
- [ ] Consultation scheduling
- [ ] Ticket replies
- [ ] Analytics dashboard
- [ ] Commission tracking

### Admin Features
- [ ] User management (CRUD)
- [ ] Staff management & role assignment
- [ ] Application workflow management
- [ ] CRM leads pipeline
- [ ] Document bucket management
- [ ] Finance reports
- [ ] CMS editing
- [ ] System analytics
- [ ] Security settings

---

## 🔒 Security Implementation

### Already Done
- ✅ RLS Policies on all tables
- ✅ Middleware role checking
- ✅ Protected routes

### TODO
- [ ] CSRF protection
- [ ] Rate limiting
- [ ] Input validation on all forms
- [ ] XSS protection
- [ ] Secure file uploads
- [ ] Session timeout
- [ ] Audit logging
- [ ] Data encryption

---

## ⚡ Performance Optimization

### Code Splitting
```typescript
// Dynamic imports for heavy components
const StaffDashboard = dynamic(() => import('@/components/StaffDashboard'), {
  loading: () => <GlobalLoader isLoading={true} />,
})
```

### Image Optimization
```typescript
// Use Next.js Image component
<Image 
  src={university.logo_url} 
  alt="University" 
  width={200} 
  height={200}
  priority={isPriority}
/>
```

### Database Query Optimization
- Use select() to fetch only needed columns
- Implement pagination for large result sets
- Create database views for complex queries
- Add caching for frequently accessed data

---

## 📝 Installation Instructions

### 1. Install Dependencies
```bash
npm install
# or
yarn install
```

### 2. Setup Supabase Project
```bash
# Install Supabase CLI
npm install -g supabase

# Link to project
supabase link --project-ref your_project_ref
```

### 3. Deploy Schema
```bash
# Copy schema from src/lib/db-schema.sql to Supabase SQL editor OR use:
supabase db push
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Access Dashboard
- Login: `http://localhost:3000/login`
- Student Portal: `http://localhost:3000/dashboard/student`
- Staff Portal: `http://localhost:3000/dashboard/staff`
- Admin Portal: `http://localhost:3000/dashboard/admin`

---

## 🎨 Design System

### Colors
- Navy: `#001f3f`
- Gold: `#FFD700`
- Orange: `#FFA500`
- Blue: `#0066cc`
- White: `#ffffff`
- Black: `#000000`

### Typography
- Font: Inter / System fonts
- H1: 4xl, bold
- H2: 2xl, bold
- Body: base, regular
- Small: sm, regular

### Components
- Card: Glassmorphism with backdrop blur
- Buttons: Rounded pill shape
- Forms: Border focus state
- Icons: Lucide React

---

## 🚨 Common Issues & Solutions

### Issue: RLS Policies blocking data access
**Solution**: Check that user ID in auth.uid() matches profile table. Make sure user is logged in.

### Issue: Real-time subscriptions not working
**Solution**: Ensure RLS policies allow SELECT for real-time. Check channel names match table structure.

### Issue: Images not loading from Supabase Storage
**Solution**: Make sure storage bucket is public and signed URLs are correct. Check CORS settings.

### Issue: Middleware redirects not working
**Solution**: Ensure middleware.ts is at `src/middleware.ts` (not in lib). Check route patterns match your file structure.

---

## 📞 Support

For issues or questions:
1. Check the Supabase documentation: https://supabase.com/docs
2. Check Next.js 15 docs: https://nextjs.org/docs
3. Check error messages in browser console
4. Check Supabase logs in dashboard

---

## 🎯 Architecture Overview

```
┌─────────────────────────────────────────┐
│       Next.js 15 App Router             │
│   (Client & Server Components)          │
└──────────────┬──────────────────────────┘
               │
        ┌──────┴──────┐
        │             │
   ┌────▼────┐   ┌───▼──────┐
   │ Client  │   │  Server  │
   │  Pages  │   │ Actions  │
   └────┬────┘   └───┬──────┘
        │            │
   ┌────▼────────────▼────────┐
   │  Supabase SDK (JS/SSR)    │
   │  - Authentication         │
   │  - Database               │
   │  - Real-time Subscriptions│
   │  - Storage                │
   └────┬─────────────────────┘
        │
   ┌────▼──────────────────────┐
   │  PostgreSQL Database       │
   │  - Tables with RLS         │
   │  - Relationships           │
   │  - Triggers & Functions    │
   └────────────────────────────┘
```

---

## Version Info
- Next.js: 16.2.6
- React: 19.2.4
- TypeScript: 5
- Supabase: ^2.106.1
- Tailwind CSS: 4
- Framer Motion: ^12.40.0

**Last Updated**: May 24, 2026
**Status**: Core infrastructure complete, pages in progress
