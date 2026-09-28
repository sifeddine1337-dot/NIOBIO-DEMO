/**
 * Tiny fetch wrapper for the admin/storefront API.
 *
 * Every call is relative to `/api` — Vite proxies that in development and the
 * Node server serves it in production. The admin bearer token is kept in
 * `localStorage` under {@link TOKEN_KEY} and attached automatically.
 */
export const TOKEN_KEY = 'admin:token'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export const authToken = {
  get: (): string | null => {
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  },
  set: (token: string): void => {
    try {
      localStorage.setItem(TOKEN_KEY, token)
    } catch {
      /* storage unavailable (private mode) — session stays in memory only */
    }
  },
  clear: (): void => {
    try {
      localStorage.removeItem(TOKEN_KEY)
    } catch {
      /* nothing to clean up */
    }
  },
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  const isFormData = init.body instanceof FormData
  if (!isFormData && init.body) headers.set('Content-Type', 'application/json')

  const token = authToken.get()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let response: Response
  try {
    response = await fetch(`/api${path}`, { ...init, headers })
  } catch {
    throw new ApiError('Le serveur est injoignable.', 0)
  }

  if (response.status === 204) return undefined as T

  const raw = await response.text()
  const payload = raw ? (JSON.parse(raw) as unknown) : null

  if (!response.ok) {
    const fromBody =
      payload && typeof payload === 'object' && 'error' in payload
        ? String((payload as { error: unknown }).error)
        : ''
    const message = fromBody || `Erreur ${response.status}`
    throw new ApiError(message, response.status)
  }

  return payload as T
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: body instanceof FormData ? body : body === undefined ? undefined : JSON.stringify(body),
    }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body: body === undefined ? undefined : JSON.stringify(body) }),
  del: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}

/**
 * Uploads an image (or catalogue PDF) and returns the URL it was stored at.
 * Used by the admin panel's image fields.
 */
export async function uploadFile(file: File): Promise<string> {
  const form = new FormData()
  form.append('file', file)

  const payload = await api.post<{ url?: string }>('/upload', form)
  if (!payload?.url) throw new ApiError("L'envoi du fichier a échoué.", 500)
  return payload.url
}