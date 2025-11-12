import { supabase } from './client'
import type { User } from '@supabase/supabase-js'

export interface AuthUser extends User {
  profile?: {
    full_name: string | null
    avatar_url: string | null
  }
}

export interface SignUpData {
  email: string
  password: string
  fullName?: string
}

export interface SignInData {
  email: string
  password: string
}

export interface UpdateProfileData {
  first_name?: string
  last_name?: string
  avatar_url?: string
}

// Sign up new user
export async function signUp({ email, password, fullName }: SignUpData) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      }
    }
  })

  if (error) {
    throw error
  }

  // Rely on DB trigger to create profile; avoid client-side inserts that can hit RLS
  // Ensure session is established before returning
  const { data: sessionData } = await supabase.auth.getSession()
  if (!sessionData.session) {
    // Wait briefly for session propagation (email confirmation flows may not create an immediate session)
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  return data
}

// Sign in existing user
export async function signIn({ email, password }: SignInData) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw error
  }

  return data
}

// Sign out user
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw error
  }
}

// Get current user with profile
export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', user.id)
    .single()

  return {
    ...user,
    profile: profile || undefined
  }
}

// Update user profile
export async function updateProfile(userId: string, updates: UpdateProfileData) {
  const updateData: any = {
    updated_at: new Date().toISOString(),
  }

  if (updates.first_name !== undefined || updates.last_name !== undefined) {
    const firstName = updates.first_name ?? ''
    const lastName = updates.last_name ?? ''
    updateData.full_name = `${firstName} ${lastName}`.trim()
  }

  if (updates.avatar_url !== undefined) {
    updateData.avatar_url = updates.avatar_url
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// Reset password
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })

  if (error) {
    throw error
  }
}

// Update password
export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (error) {
    throw error
  }
}

// Listen to auth state changes
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const user = await getCurrentUser()
      callback(user)
    } else {
      callback(null)
    }
  })
}
