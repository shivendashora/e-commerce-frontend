import { getToken } from './cookies'

// Vite proxies /api to the backend (see vite.config.ts)
const BASE_URL = '/api'

// FastAPI returns "detail" as a string, or as a list of validation errors
function errorMessage(body: unknown, status: number): string {
    const detail = (body as { detail?: unknown } | null)?.detail
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail) && detail.length > 0) {
        return detail.map((d: { loc?: string[]; msg?: string }) => `${d.loc?.at(-1) ?? ''}: ${d.msg ?? ''}`).join(', ')
    }
    return `Request failed (${status})`
}

// Use this for every API call: it adds "Authorization: Bearer <token>" when a token cookie exists
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers)
    const token = getToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)

    const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
    const body = await res.json().catch(() => null)

    if (!res.ok) throw new Error(errorMessage(body, res.status))
    return body as T
}
