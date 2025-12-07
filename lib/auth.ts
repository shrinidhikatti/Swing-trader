import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'default-secret-key-please-change-in-production'
)

export interface SessionData {
  username: string
  isAdmin: boolean
  iat: number
  exp: number
}

/**
 * Create a JWT token for the session
 */
export async function createSession(username: string): Promise<string> {
  const token = await new SignJWT({ username, isAdmin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)

  return token
}

/**
 * Verify and decode a JWT token
 */
export async function verifySession(token: string): Promise<SessionData | null> {
  try {
    const verified = await jwtVerify(token, secret)
    return verified.payload as SessionData
  } catch (error) {
    return null
  }
}

/**
 * Get the current session from cookies
 */
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value

  if (!token) {
    return null
  }

  return verifySession(token)
}

/**
 * Check if the current user is authenticated as admin
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return session !== null && session.isAdmin
}

/**
 * Verify admin credentials
 */
export function verifyCredentials(username: string, password: string): boolean {
  const adminUsername = process.env.ADMIN_USERNAME || 'admin'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin'

  return username === adminUsername && password === adminPassword
}

/**
 * Middleware helper to check authentication from request
 */
export async function isAuthenticatedFromRequest(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('session')?.value

  if (!token) {
    return false
  }

  const session = await verifySession(token)
  return session !== null && session.isAdmin
}
