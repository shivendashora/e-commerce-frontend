import { apiFetch } from './client'
import { removeToken, setToken } from './cookies'

export interface User {
    id: number
    username: string
    email: string
    is_active: boolean
}

interface TokenResponse {
    access_token: string
    token_type: string
}

export async function login(username: string, password: string) {
    // /auth/login is an OAuth2 password form, so it expects form-urlencoded data, not JSON
    const data = await apiFetch<TokenResponse>('/auth/login', {
        method: 'POST',
        body: new URLSearchParams({ username, password }),
    })
    setToken(data.access_token)
}

export async function signup(username: string, email: string, password: string) {
    await apiFetch<User>('/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
    })
    // signup only returns the user, so log in right after to get a token
    await login(username, password)
}

export function getMe() {
    return apiFetch<User>('/auth/me')
}

export function logout() {
    removeToken()
}
