import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: DO NOT remove this getUser() call
  // It refreshes the auth token and keeps the session alive
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Role-based route protection
  const path = request.nextUrl.pathname

  // Protected routes that require authentication
  const protectedRoutes = ['/student', '/staff', '/admin', '/settings']
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  )

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', path)
    return NextResponse.redirect(url)
  }

  // Redirect logged-in users away from auth pages
  const authRoutes = ['/login', '/register', '/forgot-password']
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route))

  if (isAuthRoute && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/student'
    return NextResponse.redirect(url)
  }

  // Role-based access control
  if (user) {
    // Fetch user role from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role || 'student'

    if (path.startsWith('/admin') && !['admin', 'super_admin'].includes(role)) {
      const url = request.nextUrl.clone()
      url.pathname = '/unauthorized'
      return NextResponse.redirect(url)
    }

    if (
      path.startsWith('/staff') &&
      !['staff', 'admin', 'super_admin'].includes(role)
    ) {
      const url = request.nextUrl.clone()
      url.pathname = '/unauthorized'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
