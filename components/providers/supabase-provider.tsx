'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

type SupabaseContext = {
  supabase: ReturnType<typeof createClient>
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
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

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
  }, [supabase, router])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
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

export function useSupabase() {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider')
  }
  return context
}

