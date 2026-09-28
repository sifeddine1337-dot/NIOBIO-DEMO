/**
 * Minimal admin authentication.
 *
 * A single shared password (from `ADMIN_PASSWORD`, falling back to a documented
 * development default) is exchanged for an opaque bearer token kept in memory.
 * Tokens expire after {@link TOKEN_TTL_MS}; restarting the server clears them.
 * This is deliberately simple — the control panel is a single-operator tool.
 */
import { randomBytes, timingSafeEqual } from 'node:crypto'

const DEFAULT_PASSWORD = 'admin123'
const TOKEN_TTL_MS = 1000 * 60 * 60 * 12 // 12 hours

const tokens = new Map()

function adminPassword() {
  return process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD
}

/** True while the server is running on the built-in development password. */
export function usingDefaultPassword() {
  return adminPassword() === DEFAULT_PASSWORD
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a))
  const right = Buffer.from(String(b))
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

/** Validates the submitted password. */
export function checkPassword(password) {
  return typeof password === 'string' && safeEqual(password, adminPassword())
}

/** Issues a fresh bearer token for the admin session. */
export function issueToken() {
  const token = randomBytes(24).toString('hex')
  tokens.set(token, Date.now() + TOKEN_TTL_MS)
  return { token, expiresAt: tokens.get(token) }
}

/** Invalidates a token (used on logout). */
export function revokeToken(token) {
  tokens.delete(token)
}

/** True when the request carries a valid, unexpired `Authorization: Bearer` token. */
export function isAuthorised(req) {
  const header = req.get('authorization') || ''
  const match = /^Bearer\s+(.+)$/i.exec(header.trim())
  if (!match) return false

  const expiresAt = tokens.get(match[1])
  if (!expiresAt) return false
  if (expiresAt < Date.now()) {
    tokens.delete(match[1])
    return false
  }
  return true
}

/** Express middleware guarding admin-only routes. */
export function requireAuth(req, res, next) {
  if (!isAuthorised(req)) {
    res.status(401).json({ error: 'Unauthorised' })
    return
  }
  next()
}