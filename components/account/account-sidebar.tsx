'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  User, 
  Package, 
  ShoppingBag, 
  CreditCard, 
  Settings,
  LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSupabase } from '@/components/providers/supabase-provider'

export function AccountSidebar() {
  const pathname = usePathname()
  const { supabase } = useSupabase()
  
  const links = [
    {
      href: '/account',
      label: 'Shop',
      icon: <ShoppingBag className="h-4 w-4 mr-2" />,
      exact: true
    },
    {
      href: '/account/profile',
      label: 'My Profile',
      icon: <User className="h-4 w-4 mr-2" />
    },
    {
      href: '/orders',
      label: 'My Orders',
      icon: <Package className="h-4 w-4 mr-2" />
    },
    {
      href: '/account/payment',
      label: 'Payment Methods',
      icon: <CreditCard className="h-4 w-4 mr-2" />
    },
    {
      href: '/account/settings',
      label: 'Settings',
      icon: <Settings className="h-4 w-4 mr-2" />
    }
  ]
  
  const isActive = (href: string, exact = false) => {
    if (exact) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }
  
  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }
  
  return (
    <div className="bg-card rounded-lg border p-4">
      <h2 className="font-semibold text-lg mb-4">My Account</h2>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link 
            key={link.href} 
            href={link.href}
            className={`flex items-center py-2 px-3 rounded-md transition-colors ${
              isActive(link.href, link.exact) 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'hover:bg-muted'
            }`}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </nav>
      
      <div className="mt-6 pt-6 border-t">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center" 
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}

