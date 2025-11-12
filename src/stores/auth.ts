import { create } from 'zustand';
import type { User } from '@/types';
import { loginSchema, signupSchema } from '@/lib/schema';
import { signIn, signUp, signOut, getCurrentUser, onAuthStateChange } from '@/lib/supabase/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: any) => Promise<boolean>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

// Convert Supabase user to app user format
function convertToAppUser(authUser: any): User {
  const fullName = authUser.profile?.full_name ?? ''
  const nameParts = fullName.split(' ')
  const firstName = nameParts[0] ?? ''
  const lastName = nameParts.slice(1).join(' ') ?? ''
  return {
    id: authUser.id,
    email: authUser.email,
    firstName,
    lastName,
    createdAt: authUser.created_at,
  };
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isInitialized: false,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true });
      
      // Validate input
      loginSchema.parse({ email, password });
      
      const data = await signIn({ email, password });
      const authUser = await getCurrentUser();
      
      if (authUser) {
        const user = convertToAppUser(authUser);
        set({ user, isLoading: false });
        return true;
      }
      
      set({ isLoading: false });
      return false;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signup: async (data: any) => {
    try {
      set({ isLoading: true });
      
      // Validate input
      signupSchema.parse(data);
      
      const fullName = `${data.firstName} ${data.lastName}`;
      await signUp({
        email: data.email,
        password: data.password,
        fullName,
      });
      
      const authUser = await getCurrentUser();
      if (authUser) {
        const user = convertToAppUser(authUser);
        set({ user, isLoading: false });
        return true;
      }
      
      set({ isLoading: false });
      return false;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    await signOut();
    set({ user: null });
  },

  loadUser: async () => {
    try {
      const authUser = await getCurrentUser();
      if (authUser) {
        const user = convertToAppUser(authUser);
        set({ user, isInitialized: true });
      } else {
        set({ user: null, isInitialized: true });
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      set({ user: null, isInitialized: true });
    }
  },
}));
