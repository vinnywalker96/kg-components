'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useSupabase } from '@/components/providers/supabase-provider'
import { Button } from '@/components/ui/button'
import { ShoppingCart, User } from 'lucide-react'

export function MainNav() {
  const pathname = usePathname()
  const { user, session } = useSupabase()

  const routes = [
    {
      href: '/',
      label: 'Home',
      active: pathname === '/',
    },
    {
      href: '/shop',
      label: 'Shop',
      active: pathname === '/shop',
    },
    {
      href: '/about',
      label: 'About',
      active: pathname === '/about',
    },
    {
      href: '/contact',
      label: 'Contact',
      active: pathname === '/contact',
    },
  ]

  return (
    <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            route.active ? 'text-black dark:text-white' : 'text-muted-foreground'
          )}
        >
          {route.label}
        </Link>
      ))}
      
      <div className="ml-auto flex items-center space-x-4">
        {session ? (
          <>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/account">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Link>
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" asChild>
              <Link href="/auth/login">
                Login
              </Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">
                Sign Up
              </Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  )
}

