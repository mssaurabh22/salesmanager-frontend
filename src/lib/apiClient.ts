import { API_BASE_URL } from '../config'
import type { ApiResponse, SessionUser } from '../types/api'

type HttpMethod = 'GET' | 'POST' | 'PUT'

export async function apiRequest<T>(
  path: string,
  options: {
    method?: HttpMethod
    body?: unknown
    session?: SessionUser | null
  } = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.session?.accessToken
        ? { Authorization: `Bearer ${options.session.accessToken}` }
        : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  let payload: ApiResponse<T> | null = null
  try {
    payload = (await response.json()) as ApiResponse<T>
  } catch {
    payload = null
  }

  if (!response.ok) {
    throw new Error(payload?.message || `Request failed with status ${response.status}`)
  }

  if (!payload) {
    throw new Error('Empty response from server')
  }

  return payload.data
}
