import type { ApiErrorResponse } from '../types/auth'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>
}

class ApiClient {
  private getHeaders(customHeaders?: HeadersInit): Headers {
    const headers = new Headers(customHeaders)
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }

    const token = localStorage.getItem('draftly_token')
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    return headers
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 401) {
      // Si recibimos 401 no autorizado, limpiar token si existe
      localStorage.removeItem('draftly_token')
      localStorage.removeItem('draftly_user')
    }

    if (!response.ok) {
      let message = `Error ${response.status}: ${response.statusText}`
      try {
        const errorData: ApiErrorResponse = await response.json()
        if (typeof errorData.detail === 'string') {
          message = errorData.detail
        } else if (Array.isArray(errorData.detail) && errorData.detail.length > 0) {
          message = errorData.detail[0]?.msg || message
        }
      } catch {
        // En caso de que la respuesta no sea JSON
      }
      throw new Error(message)
    }

    // Para respuestas 204 No Content
    if (response.status === 204) {
      return {} as T
    }

    return response.json() as Promise<T>
  }

  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, headers, ...rest } = options
    let url = `${BASE_URL}${endpoint}`

    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, val]) => {
        searchParams.append(key, String(val))
      })
      url += `?${searchParams.toString()}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(headers),
      ...rest,
    })

    return this.handleResponse<T>(response)
  }

  async post<T>(endpoint: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
    const { headers, ...rest } = options
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(headers),
      body: body ? JSON.stringify(body) : undefined,
      ...rest,
    })

    return this.handleResponse<T>(response)
  }

  async put<T>(endpoint: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
    const { headers, ...rest } = options
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(headers),
      body: body ? JSON.stringify(body) : undefined,
      ...rest,
    })

    return this.handleResponse<T>(response)
  }

  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { headers, ...rest } = options
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(headers),
      ...rest,
    })

    return this.handleResponse<T>(response)
  }
}

export const api = new ApiClient()
