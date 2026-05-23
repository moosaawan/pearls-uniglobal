import { create } from 'zustand'
import type { Profile, UserRole } from '@/types/database'

interface AuthState {
  user: Profile | null
  isLoading: boolean
  isAuthenticated: boolean
  role: UserRole | null
  setUser: (user: Profile | null) => void
  setLoading: (loading: boolean) => void
  clearUser: () => void
  hasRole: (roles: UserRole[]) => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  role: null,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      role: user?.role || null,
      isLoading: false,
    }),

  setLoading: (loading) => set({ isLoading: loading }),

  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
      role: null,
      isLoading: false,
    }),

  hasRole: (roles) => {
    const state = get()
    return state.role ? roles.includes(state.role) : false
  },
}))
