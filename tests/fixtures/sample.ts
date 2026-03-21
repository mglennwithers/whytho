// Sample TypeScript file for parser testing

export interface AuthToken {
  value: string
  expiresAt: number
  ttl: number
}

export type TokenRotationResult = {
  rotated: boolean
  newToken?: AuthToken
}

export const DEFAULT_TTL = 3600

export function generateToken(userId: string, ttl = DEFAULT_TTL): AuthToken {
  return {
    value: `token-${userId}-${Date.now()}`,
    expiresAt: Date.now() + ttl * 1000,
    ttl,
  }
}

export async function rotateTokenIfNeeded(
  token: AuthToken,
  threshold = 0.2,
): Promise<TokenRotationResult> {
  const remaining = token.expiresAt - Date.now()
  const windowMs = token.ttl * 1000 * threshold

  if (remaining > windowMs) {
    return { rotated: false }
  }

  const newToken = generateToken('user', token.ttl)
  return { rotated: true, newToken }
}

export class TokenService {
  private tokens: Map<string, AuthToken> = new Map()

  store(key: string, token: AuthToken): void {
    this.tokens.set(key, token)
  }

  retrieve(key: string): AuthToken | undefined {
    return this.tokens.get(key)
  }
}
