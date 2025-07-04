'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  ShoppingCart, 
  Users, 
  Settings 
} from 'lucide-react'
import { useLanguage } from '@/lib/i18n/language-context'

export function AdminSidebar() {
  const pathname = usePathname()
  const { t } = useLanguage()
  
  const links = [
    {
      name: t('dashboard'),
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      name: t('products'),
      href: '/admin/products',
      icon: Package,
    },
    {
      name: t('categories'),
      href: '/admin/categories',
      icon: Tags,
    },
    {
      name: t('orders'),
      href: '/admin/orders',
      icon: ShoppingCart,
    },
    {
      name: t('users'),
      href: '/admin/users',
      icon: Users,
    },
    {
      name: t('settings'),
      href: '/admin/settings',
      icon: Settings,
    },
  ]
  
  return (
    <div className="space-y-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold">Admin Panel</h2>
        <div className="space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                pathname === link.href
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
