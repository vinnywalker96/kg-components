'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSupabase } from '@/components/providers/supabase-provider'
import { useRouter } from 'next/navigation'

interface AuthFormProps {
  redirectUrl?: string
}

export function AuthForm({ redirectUrl }: AuthFormProps) {
  const { supabase } = useSupabase()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [view, setView] = useState<'sign-in' | 'sign-up' | 'forgot-password'>('sign-in')
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      router.refresh()
      router.push(redirectUrl || '/')
    } catch (error: any) {
      setError(error.message || 'An error occurred during sign in')
    } finally {
      setLoading(false)
    }
  }
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })
      
      if (error) throw error
      
      if (data.user?.identities?.length === 0) {
        setError('An account with this email already exists')
      } else {
        setMessage('Check your email for a confirmation link')
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred during sign up')
    } finally {
      setLoading(false)
    }
  }
  
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      
      if (error) throw error
      
      setMessage('Check your email for a password reset link')
    } catch (error: any) {
      setError(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          {view === 'sign-in' ? 'Sign In' : view === 'sign-up' ? 'Create Account' : 'Reset Password'}
        </CardTitle>
        <CardDescription>
          {view === 'sign-in'
            ? 'Enter your email and password to access your account'
            : view === 'sign-up'
            ? 'Create a new account to get started'
            : 'Enter your email to receive a password reset link'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-100 text-red-800 px-4 py-2 rounded-md mb-4">
            {error}
          </div>
        )}
        
        {message && (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md mb-4">
            {message}
          </div>
        )}
        
        {view === 'sign-in' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                  onClick={() => setView('forgot-password')}
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        )}
        
        {view === 'sign-up' && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="full-name" className="text-sm font-medium">
                Full Name
              </label>
              <Input
                id="full-name"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
        )}
        
        {view === 'forgot-password' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending link...' : 'Send Reset Link'}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter>
        <div className="text-sm text-center w-full">
          {view === 'sign-in' ? (
            <div>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => setView('sign-up')}
              >
                Sign up
              </button>
            </div>
          ) : (
            <div>
              Already have an account?{' '}
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => setView('sign-in')}
              >
                Sign in
              </button>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

