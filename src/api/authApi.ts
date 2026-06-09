import { apiRequest } from '../lib/apiClient'
import { decodeJwt } from '../lib/jwt'
import type { AuthResponse, SessionUser } from '../types/api'

export async function loginApi(email: string, password: string): Promise<SessionUser> {
  const data = await apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  })

  const claims = decodeJwt(data.accessToken)
  return {
    userId: Number(claims.userId),
    email: claims.sub || email,
    role: claims.role,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  }
}
