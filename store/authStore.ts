import { create } from 'zustand'
import { supabase } from '@/integrations/supabase/client'
import { User } from '@supabase/supabase-js'

interface Profile {
  id: string
  full_name: string | null
  email: string | null
  address: string | null
  phone: string | null
  is_admin: boolean
  created_at: string
}

interface AuthState {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  error: string | null
  
  // Actions
  initialize: () => Promise<void>
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<Profile>) => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  error: null,
  
  initialize: async () => {
    try {
      set({ isLoading: true })
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        set({ user: null, profile: null, isLoading: false })
        return
      }
      
      // Get user profile
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      
      if (error) {
        console.error('Error fetching profile:', error)
        set({ user: session.user, profile: null, isLoading: false })
        return
      }
      
      set({ 
        user: session.user, 
        profile: profile as Profile, 
        isLoading: false 
      })
    } catch (error) {
      console.error('Auth initialization error:', error)
      set({ user: null, profile: null, isLoading: false })
    }
  },
  
  signIn: async (email, password) => {
    try {
      set({ isLoading: true, error: null })
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        set({ isLoading: false, error: error.message })
        return { success: false, error: error.message }
      }
      
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()
      
      if (profileError) {
        console.error('Error fetching profile:', profileError)
      }
      
      set({ 
        user: data.user, 
        profile: profile as Profile, 
        isLoading: false 
      })
      
      return { success: true }
    } catch (error: any) {
      set({ isLoading: false, error: error.message })
      return { success: false, error: error.message }
    }
  },
  
  signUp: async (email, password, fullName) => {
    try {
      set({ isLoading: true, error: null })
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })
      
      if (error) {
        set({ isLoading: false, error: error.message })
        return { success: false, error: error.message }
      }
      
      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([
            {
              id: data.user.id,
              full_name: fullName,
              email: email,
              is_admin: false,
            },
          ])
        
        if (profileError) {
          console.error('Error creating profile:', profileError)
        }
      }
      
      set({ 
        user: data.user, 
        profile: data.user ? {
          id: data.user.id,
          full_name: fullName,
          email: email,
          address: null,
          phone: null,
          is_admin: false,
          created_at: new Date().toISOString(),
        } : null, 
        isLoading: false 
      })
      
      return { success: true }
    } catch (error: any) {
      set({ isLoading: false, error: error.message })
      return { success: false, error: error.message }
    }
  },
  
  signOut: async () => {
    try {
      set({ isLoading: true })
      await supabase.auth.signOut()
      set({ user: null, profile: null, isLoading: false })
    } catch (error) {
      console.error('Sign out error:', error)
      set({ isLoading: false })
    }
  },
  
  updateProfile: async (data) => {
    try {
      const { profile } = get()
      
      if (!profile) {
        throw new Error('No profile found')
      }
      
      set({ isLoading: true })
      
      const { error } = await supabase
        .from('user_profiles')
        .update(data)
        .eq('id', profile.id)
      
      if (error) {
        throw error
      }
      
      set({ 
        profile: { ...profile, ...data },
        isLoading: false 
      })
    } catch (error) {
      console.error('Update profile error:', error)
      set({ isLoading: false })
    }
  },
}))

