import { create } from 'zustand'
import { createBrowserClient } from '@supabase/ssr'
import Cookies from 'js-cookie'

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

// Create a Supabase client for the browser
const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase environment variables are missing')
    throw new Error('Supabase environment variables are missing')
  }
  
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
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
        
        const role = (profileData?.role as 'user' | 'admin') || 'user'
        
        // Set role cookie for middleware
        Cookies.set('user_role', role, { 
          expires: 7, // 7 days
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        })
        
        set({
          user: {
            id: data.user.id,
            email: data.user.email!,
            name: profileData?.name || 'User',
            role
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
        
        // Set role cookie for middleware
        Cookies.set('user_role', 'user', { 
          expires: 7, // 7 days
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
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
    try {
      const supabase = createClient()
      // Remove role cookie
      Cookies.remove('user_role', { path: '/' })
      await supabase.auth.signOut()
      set({ user: null })
    } catch (error) {
      console.error('Error during logout:', error)
    }
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
        
        const role = (profileData?.role as 'user' | 'admin') || 'user'
        
        // Update role cookie
        Cookies.set('user_role', role, { 
          expires: 7, // 7 days
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        })
        
        set({
          user: {
            id: data.user.id,
            email: data.user.email!,
            name: profileData?.name || 'User',
            role
          }
        })
        
        return true
      }
      
      // Clear role cookie if not authenticated
      Cookies.remove('user_role', { path: '/' })
      set({ user: null })
      return false
    } catch (error) {
      // Clear role cookie on error
      Cookies.remove('user_role', { path: '/' })
      set({ user: null })
      return false
    } finally {
      set({ isLoading: false })
    }
  }
}))
