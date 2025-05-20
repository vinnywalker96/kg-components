import { AuthForm } from '@/components/auth/auth-form'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In | KG-Components',
  description: 'Sign in to your KG-Components account.',
}

interface AuthPageProps {
  searchParams: {
    redirect?: string
  }
}

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const supabase = createClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (session) {
    redirect(searchParams.redirect || '/')
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <AuthForm redirectUrl={searchParams.redirect} />
      </div>
    </div>
  )
}

