import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Check for authentication using cookies only (no Supabase in Edge)
  const authCookie = req.cookies.get('sb-auth-token')
  const roleCookie = req.cookies.get('user_role')
  
  // If no auth cookie and trying to access protected routes, redirect to login
  if (!authCookie && (
    req.nextUrl.pathname.startsWith('/admin') || 
    req.nextUrl.pathname.startsWith('/account')
  )) {
    const redirectUrl = new URL('/auth/login', req.url)
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // For admin routes, check role cookie
  if (authCookie && req.nextUrl.pathname.startsWith('/admin')) {
    // If not admin, redirect to account page
    if (!roleCookie || roleCookie.value !== 'admin') {
      return NextResponse.redirect(new URL('/account', req.url))
    }
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

