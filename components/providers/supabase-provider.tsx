'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { type User } from '@supabase/supabase-js'
import { type Database } from '@/types/supabase'

interface SupabaseContextType {
  supabase: ReturnType<typeof createBrowserClient<Database>>
  user: User | null
  loading: boolean
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setLoading(false)
      
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setUser(session?.user || null)
        }
      )
      
      return () => {
        authListener.subscription.unsubscribe()
      }
    }
    
    getUser()
  }, [supabase])
  
  return (
    <SupabaseContext.Provider value={{ supabase, user, loading }}>
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}

