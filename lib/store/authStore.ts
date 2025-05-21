import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'

interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
}

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => Promise<void>
  checkAuth: () => Promise<boolean>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  
  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null })
      const supabase = createClient()
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        set({ error: error.message, isLoading: false })
        return false
      }
      
      if (data.user) {
        // Get user profile data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('name, role')
          .eq('id', data.user.id)
          .single()
        
        set({
          user: {
            id: data.user.id,
            email: data.user.email!,
            name: profileData?.name || 'User',
            role: (profileData?.role as 'user' | 'admin') || 'user'
          },
          isLoading: false
        })
        
        return true
      }
      
      set({ isLoading: false })
      return false
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      return false
    }
  },
  
  signup: async (email, password, name) => {
    try {
      set({ isLoading: true, error: null })
      const supabase = createClient()
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })
      
      if (error) {
        set({ error: error.message, isLoading: false })
        return false
      }
      
      if (data.user) {
        // Create user profile
        await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name,
            role: 'user'
          })
        
        set({
          user: {
            id: data.user.id,
            email: data.user.email!,
            name,
            role: 'user'
          },
          isLoading: false
        })
        
        return true
      }
      
      set({ isLoading: false })
      return false
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      return false
    }
  },
  
  logout: async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    set({ user: null })
  },
  
  checkAuth: async () => {
    try {
      set({ isLoading: true })
      const supabase = createClient()
      
      const { data } = await supabase.auth.getUser()
      
      if (data.user) {
        // Get user profile data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('name, role')
          .eq('id', data.user.id)
          .single()
        
        set({
          user: {
            id: data.user.id,
            email: data.user.email!,
            name: profileData?.name || 'User',
            role: (profileData?.role as 'user' | 'admin') || 'user'
          }
        })
        
        return true
      }
      
      set({ user: null })
      return false
    } catch (error) {
      set({ user: null })
      return false
    } finally {
      set({ isLoading: false })
    }
  }
}))

