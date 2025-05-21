import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'

interface User {
  id: string
  email: string
  name?: string
  role: 'user' | 'admin'
}

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  
  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null })
      const supabase = createClient()
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      if (data.user) {
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()
        
        set({
          user: {
            id: data.user.id,
            email: data.user.email || '',
            name: profile?.name || data.user.user_metadata?.name,
            role: profile?.role || 'user',
          },
          isLoading: false,
        })
      }
    } catch (error: any) {
      set({ isLoading: false, error: error.message })
    }
  },
  
  signup: async (email: string, password: string, name: string) => {
    try {
      set({ isLoading: true, error: null })
      const supabase = createClient()
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })
      
      if (error) throw error
      
      if (data.user) {
        // Create user profile
        await supabase.from('profiles').insert({
          id: data.user.id,
          name,
          email: data.user.email,
          role: 'user',
        })
        
        set({
          user: {
            id: data.user.id,
            email: data.user.email || '',
            name,
            role: 'user',
          },
          isLoading: false,
        })
      }
    } catch (error: any) {
      set({ isLoading: false, error: error.message })
    }
  },
  
  logout: async () => {
    try {
      set({ isLoading: true })
      const supabase = createClient()
      
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      set({ user: null, isLoading: false })
    } catch (error: any) {
      set({ isLoading: false, error: error.message })
    }
  },
  
  checkAuth: async () => {
    try {
      set({ isLoading: true })
      const supabase = createClient()
      
      const { data } = await supabase.auth.getSession()
      
      if (data.session?.user) {
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single()
        
        set({
          user: {
            id: data.session.user.id,
            email: data.session.user.email || '',
            name: profile?.name || data.session.user.user_metadata?.name,
            role: profile?.role || 'user',
          },
          isLoading: false,
        })
      } else {
        set({ user: null, isLoading: false })
      }
    } catch (error: any) {
      set({ isLoading: false, error: error.message })
    }
  },
  
  updateProfile: async (data: Partial<User>) => {
    try {
      set({ isLoading: true })
      const supabase = createClient()
      const { user } = useAuthStore.getState()
      
      if (!user) throw new Error('Not authenticated')
      
      // Update auth metadata if name is provided
      if (data.name) {
        await supabase.auth.updateUser({
          data: { name: data.name },
        })
      }
      
      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          // Only admins can update roles
        })
        .eq('id', user.id)
      
      if (error) throw error
      
      set({
        user: { ...user, ...data },
        isLoading: false,
      })
    } catch (error: any) {
      set({ isLoading: false, error: error.message })
    }
  },
}))

