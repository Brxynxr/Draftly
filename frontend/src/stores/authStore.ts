import { create } from 'zustand'
import { api } from '../lib/api'
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types/auth'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
  clearError: () => void
}

const getInitialUser = (): User | null => {
  try {
    const raw = localStorage.getItem('draftly_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: getInitialUser(),
  token: localStorage.getItem('draftly_token'),
  isAuthenticated: Boolean(localStorage.getItem('draftly_token')),
  isLoading: true,
  error: null,

  clearError: () => set({ error: null }),

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials)
      localStorage.setItem('draftly_token', response.access_token)
      localStorage.setItem('draftly_user', JSON.stringify(response.user))

      set({
        token: response.access_token,
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión'
      set({ error: message, isLoading: false })
      throw err
    }
  },

  register: async (credentials: RegisterCredentials) => {
    set({ isLoading: true, error: null })
    try {
      // 1. Registrar usuario
      await api.post<User>('/auth/register', credentials)

      // 2. Auto-login inmediato para generar el token JWT
      await get().login({
        email: credentials.email,
        password: credentials.password,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al registrar usuario'
      set({ error: message, isLoading: false })
      throw err
    }
  },

  logout: () => {
    localStorage.removeItem('draftly_token')
    localStorage.removeItem('draftly_user')
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
  },

  checkAuth: async () => {
    const token = localStorage.getItem('draftly_token')
    if (!token) {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      })
      return
    }

    try {
      const user = await api.get<User>('/auth/me')
      localStorage.setItem('draftly_user', JSON.stringify(user))
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch {
      // Si el token es inválido o expiró
      get().logout()
    }
  },
}))
