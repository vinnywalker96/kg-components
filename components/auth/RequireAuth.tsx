'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

interface RequireAuthProps {
  children: React.ReactNode
  adminOnly?: boolean
}

const RequireAuth: React.FC<RequireAuthProps> = ({ 
  children, 
  adminOnly = false 
}) => {
  const router = useRouter()
  const { user, profile, isLoading } = useAuthStore()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth?redirect=' + encodeURIComponent(window.location.pathname))
    } else if (!isLoading && adminOnly && !profile?.is_admin) {
      router.push('/')
    }
  }, [user, profile, isLoading, router, adminOnly])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (adminOnly && !profile?.is_admin) {
    return null
  }

  return <>{children}</>
}

export default RequireAuth

