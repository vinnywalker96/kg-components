import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@/lib/supabase/client';

interface User {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          const supabase = createClient();
          
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (error) throw error;
          
          if (data.user) {
            // Fetch user profile from profiles table
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();
            
            set({
              user: {
                id: data.user.id,
                email: data.user.email!,
                name: profileData?.name,
                role: profileData?.role || 'user',
              },
              isLoading: false,
            });
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      
      signup: async (email, password, name) => {
        set({ isLoading: true, error: null });
        
        try {
          const supabase = createClient();
          
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });
          
          if (error) throw error;
          
          if (data.user) {
            // Create user profile
            await supabase.from('profiles').insert({
              id: data.user.id,
              email: data.user.email,
              name,
              role: 'user',
            });
            
            set({
              user: {
                id: data.user.id,
                email: data.user.email!,
                name,
                role: 'user',
              },
              isLoading: false,
            });
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      
      logout: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const supabase = createClient();
          
          const { error } = await supabase.auth.signOut();
          
          if (error) throw error;
          
          set({ user: null, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      
      updateProfile: async (data) => {
        set({ isLoading: true, error: null });
        
        try {
          const supabase = createClient();
          const { user } = get();
          
          if (!user) throw new Error('Not authenticated');
          
          const { error } = await supabase
            .from('profiles')
            .update(data)
            .eq('id', user.id);
          
          if (error) throw error;
          
          set({
            user: { ...user, ...data },
            isLoading: false,
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      
      checkAuth: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const supabase = createClient();
          
          const { data } = await supabase.auth.getSession();
          
          if (data.session?.user) {
            // Fetch user profile from profiles table
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.session.user.id)
              .single();
            
            set({
              user: {
                id: data.session.user.id,
                email: data.session.user.email!,
                name: profileData?.name,
                role: profileData?.role || 'user',
              },
              isLoading: false,
            });
          } else {
            set({ user: null, isLoading: false });
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false, user: null });
        }
      },
    }),
    {
      name: 'kg-components-auth',
    }
  )
);

