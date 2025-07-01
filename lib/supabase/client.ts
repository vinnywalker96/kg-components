import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'

// Create a singleton instance of the Supabase client
let supabaseInstance: ReturnType<typeof createBrowserClient<Database>> | null = null

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window !== 'undefined') {
      console.error('Supabase URL or Anon Key is missing')
    }
    // Return a mock client for SSR
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
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

  // Return the existing instance if it exists
  if (supabaseInstance) {
    return supabaseInstance
  }

  // Create a new instance if it doesn't exist
  supabaseInstance = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)

  return supabaseInstance
}

