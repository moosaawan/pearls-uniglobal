import { create } from 'zustand'
import type { Profile, UserRole } from '@/types/database'

type AccountStatus = 'pending' | 'approved' | 'rejected'

interface AuthState {
  user: Profile | null
  isLoading: boolean
  isAuthenticated: boolean
  role: UserRole | null
  accountStatus: AccountStatus | null
  setUser: (user: Profile | null) => void
  setLoading: (loading: boolean) => void
  clearUser: () => void
  hasRole: (roles: UserRole[]) => boolean
  isApproved: () => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  role: null,
  accountStatus: null,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      role: user?.role || null,
      accountStatus: user?.account_status || null,
      isLoading: false,
    }),

  setLoading: (loading) => set({ isLoading: loading }),

  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
      role: null,
      accountStatus: null,
      isLoading: false,
    }),

  hasRole: (roles) => {
    const state = get()
    return state.role ? roles.includes(state.role) : false
  },

  isApproved: () => {
    const state = get()
    return state.accountStatus === 'approved'
  },
}))
