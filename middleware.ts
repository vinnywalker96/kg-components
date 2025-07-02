import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Check if Supabase environment variables are set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    // If environment variables are missing, just continue without auth checks
    console.warn('Supabase environment variables are missing. Authentication is disabled.')
    return res
  }
  
  // Create a Supabase client for auth using the Edge-compatible approach
  const cookieStore = req.cookies
  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({
            name,
            value,
            ...options,
          })
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({
            name,
            value: '',
            ...options,
          })
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )
  
  try {
    // Check if we have a session
    const { data } = await supabase.auth.getSession()
    const session = data.session

    // If no session and trying to access protected routes, redirect to login
    if (!session && (
      req.nextUrl.pathname.startsWith('/admin') || 
      req.nextUrl.pathname.startsWith('/account')
    )) {
      const redirectUrl = new URL('/auth/login', req.url)
      redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // For admin routes, we'll use a simpler approach that's Edge-compatible
    // Instead of querying the database, we'll check for a role cookie
    if (session && req.nextUrl.pathname.startsWith('/admin')) {
      const roleCookie = req.cookies.get('user_role')
      
      // If not admin, redirect to account page
      if (!roleCookie || roleCookie.value !== 'admin') {
        return NextResponse.redirect(new URL('/account', req.url))
      }
    }
  } catch (error) {
    console.error('Error in auth middleware:', error)
  }

  return res
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/account/:path*',
    '/auth/:path*',
  ],
}

