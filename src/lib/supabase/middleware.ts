import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function updateSession(request: NextRequest) {
  const cookieStore = await cookies()

  let supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // ============================================
  // PUBLIC ROUTES (no authentication required)
  // ============================================
  const publicRoutes = [
    '/',
    '/about',
    '/contact',
    '/services',
    '/blog',
    '/faqs',
    '/free-assessment',
    '/ielts-academy',
    '/study-in-uk',
    '/team',
  ]

  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'))

  // ============================================
  // AUTH ROUTES (redirect authenticated users away)
  // ============================================
  const authRoutes = ['/login', '/register', '/forgot-password', '/callback']

  const isAuthRoute = authRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'))

  // ============================================
  // PROTECTED ROUTES (require authentication)
  // ============================================

  // Student routes
  const studentRoutes = ['/student']

  // Staff routes
  const staffRoutes = ['/staff']

  // Admin routes
  const adminRoutes = ['/admin']

  // Determine user role
  let userRole: string | null = null

  if (user) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      userRole = profile?.role || null
    } catch (error) {
      console.error('Error fetching user role:', error)
    }
  }

  // ============================================
  // ROUTE PROTECTION LOGIC
  // ============================================

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (user && isAuthRoute) {
    // Redirect based on role
    const redirectPath =
      userRole === 'admin' || userRole === 'super_admin'
        ? '/admin'
        : userRole === 'staff'
          ? '/staff'
          : '/student'

    return NextResponse.redirect(new URL(redirectPath, request.url))
  }

  // Public routes - always allow
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // If user is not authenticated and trying to access protected routes
  if (!user && (studentRoutes.some((route) => pathname.startsWith(route)) ||
    staffRoutes.some((route) => pathname.startsWith(route)) ||
    adminRoutes.some((route) => pathname.startsWith(route)))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // ============================================
  // ROLE-BASED ACCESS CONTROL
  // ============================================

  // Student routes - only students can access
  if (studentRoutes.some((route) => pathname.startsWith(route))) {
    if (user && userRole === 'student') {
      return NextResponse.next()
    }
    // Redirect to appropriate dashboard or login
    if (user) {
      const redirectPath =
        userRole === 'admin' || userRole === 'super_admin'
          ? '/admin'
          : userRole === 'staff'
            ? '/staff'
            : '/login'
      return NextResponse.redirect(new URL(redirectPath, request.url))
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Staff routes - staff and admin can access
  if (staffRoutes.some((route) => pathname.startsWith(route))) {
    if (user && (userRole === 'staff' || userRole === 'admin' || userRole === 'super_admin')) {
      return NextResponse.next()
    }
    // Redirect non-staff users
    if (user) {
      const redirectPath =
        userRole === 'admin' || userRole === 'super_admin'
          ? '/admin'
          : '/student'
      return NextResponse.redirect(new URL(redirectPath, request.url))
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Admin routes - only admin and super_admin can access
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (user && (userRole === 'admin' || userRole === 'super_admin')) {
      return NextResponse.next()
    }
    // Redirect non-admin users
    if (user) {
      const redirectPath =
        userRole === 'staff' ? '/staff' : '/student'
      return NextResponse.redirect(new URL(redirectPath, request.url))
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}
