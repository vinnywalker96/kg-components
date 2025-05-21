'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { useSupabase } from '@/components/providers/supabase-provider'
import { useAuthStore } from '@/lib/store/authStore'
import { useCartStore } from '@/lib/store/cartStore'
import { ShoppingCart, Menu, X, User, LogOut } from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()
  const { supabase } = useSupabase()
  const { user } = useAuthStore()
  const { getItemCount } = useCartStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(0)
  
  useEffect(() => {
    // Close menus when route changes
    setIsMenuOpen(false)
    setIsUserMenuOpen(false)
  }, [pathname])
  
  useEffect(() => {
    // Update cart count from store
    setCartItemCount(getItemCount())
  }, [getItemCount])
  
  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }
  
  const isAdmin = user?.role === 'admin'
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold mr-8">
              KG-Components
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === '/' ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                Home
              </Link>
              <Link
                href="/shop"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === '/shop' ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                Shop
              </Link>
              <Link
                href="/about"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === '/about' ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                About
              </Link>
              <Link
                href="/contact"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === '/contact' ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                Contact
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {user ? (
              <>
                <Link href="/cart">
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </Button>
                </Link>
                
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    <User className="h-5 w-5" />
                  </Button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg border overflow-hidden">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/account"
                          className="block px-4 py-2 text-sm hover:bg-muted"
                        >
                          My Account
                        </Link>
                        <Link
                          href="/orders"
                          className="block px-4 py-2 text-sm hover:bg-muted"
                        >
                          My Orders
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="block px-4 py-2 text-sm hover:bg-muted"
                          >
                            Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Button asChild variant="default" size="sm">
                <Link href="/auth">Sign In</Link>
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link
              href="/"
              className="block py-2 text-base font-medium"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="block py-2 text-base font-medium"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="block py-2 text-base font-medium"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block py-2 text-base font-medium"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

