import type { JwtClaims } from '../types/api'

export function decodeJwt(token: string): JwtClaims {
  const parts = token.split('.')
  if (parts.length !== 3) {
    throw new Error('Invalid JWT received from server')
  }

  const payload = parts[1]
  const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
  const decoded = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='))
  return JSON.parse(decoded) as JwtClaims
}
