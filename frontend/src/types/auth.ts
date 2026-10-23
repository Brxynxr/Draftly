export interface User {
  id: string
  email: string
  full_name: string | null
  default_currency: string
  webhook_token: string
  is_active: boolean
  created_at?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  full_name?: string
  default_currency?: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export interface ApiErrorResponse {
  detail?: string | Array<{ loc: (string | number)[]; msg: string; type: string }>
}
