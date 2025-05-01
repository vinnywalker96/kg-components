
import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Profile } from "@/types";
import { toast } from "@/hooks/use-toast";

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAdmin: boolean;
  isLoading: boolean;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<Profile>) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  isAdmin: false,
  isLoading: true,
  initialized: false,

  initialize: async () => {
    try {
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          const currentState = get();

          if (event === "SIGNED_OUT") {
            set({ user: null, session: null, profile: null, isAdmin: false });
            return;
          }

          if (session && session.user && session.user.id !== currentState?.user?.id) {
            set({ session, user: session.user });
            
            // Fetch the user's profile
            setTimeout(async () => {
              const { data: profile } = await supabase
                .from("user_profiles")
                .select("*")
                .eq("id", session.user.id)
                .single();
              
              set({ 
                profile,
                isAdmin: profile?.is_admin || false,
                isLoading: false
              });
            }, 0);
          }
        }
      );

      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session && session.user) {
        set({ session, user: session.user });
        
        // Fetch the user's profile
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        
        set({ 
          profile,
          isAdmin: profile?.is_admin || false
        });
      }

      set({ isLoading: false, initialized: true });
      return () => authListener.subscription.unsubscribe();
      
    } catch (error) {
      console.error("Error initializing auth:", error);
      set({ isLoading: false, initialized: true });
    }
  },

  signIn: async (email, password) => {
    try {
      set({ isLoading: true });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
        set({ isLoading: false });
        return;
      }

      toast({
        title: "Signed in successfully",
        description: "Welcome back to KG Components!",
      });

    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  signUp: async (email, password, fullName) => {
    try {
      set({ isLoading: true });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
        set({ isLoading: false });
        return;
      }

      toast({
        title: "Account created",
        description: "Welcome to KG Components!",
      });

    } catch (error) {
      console.error("Sign up error:", error);
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true });
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
      });
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Sign out failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (profileData) => {
    try {
      const { user } = get();
      if (!user) return;

      set({ isLoading: true });
      const { data, error } = await supabase
        .from("user_profiles")
        .update(profileData)
        .eq("id", user.id)
        .select();

      if (error) {
        toast({
          title: "Update failed",
          description: error.message,
          variant: "destructive",
        });
        set({ isLoading: false });
        return;
      }

      set({ profile: data[0] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      console.error("Update profile error:", error);
      toast({
        title: "Update failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
