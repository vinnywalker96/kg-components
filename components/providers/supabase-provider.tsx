'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

type SupabaseContext = {
  supabase: ReturnType<typeof createBrowserClient<Database>>
  session: Session | null
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Check if Supabase environment variables are set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // Create a mock client if environment variables are missing
  const supabase = !supabaseUrl || !supabaseAnonKey
    ? createMockClient()
    : createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  
  const router = useRouter()

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event: AuthChangeEvent, session: Session | null) => {
          setSession(session)
          setUser(session?.user ?? null)
          setLoading(false)
          router.refresh()
        }
      )

      return () => {
        subscription.unsubscribe()
      }
    } catch (error) {
      console.error('Error setting up auth state change listener:', error)
      setLoading(false)
      return () => {}
    }
  }, [supabase, router])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const value = {
    supabase,
    session,
    user,
    loading,
    signOut
  }

  return <Context.Provider value={value}>{children}</Context.Provider>
}

// Create a mock Supabase client for development without environment variables
function createMockClient() {
  console.warn('Using mock Supabase client - environment variables are missing')
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ 
        data: { 
          subscription: { 
            unsubscribe: () => {} 
          } 
        } 
      }),
      signOut: () => Promise.resolve({ error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => Promise.resolve({ data: [], error: null }),
        order: () => Promise.resolve({ data: [], error: null }),
      }),
    }),
  } as any
}

export function useSupabase() {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider')
  }
  return context
}
