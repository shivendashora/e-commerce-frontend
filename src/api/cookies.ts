const TOKEN_COOKIE = 'access_token'

// Reads the "exp" claim from the JWT so the cookie expires together with the token.
function tokenMaxAge(token: string): number | null {
    try {
        const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
        return typeof payload.exp === 'number' ? Math.max(0, payload.exp - Math.floor(Date.now() / 1000)) : null
    } catch {
        return null
    }
}

export function setToken(token: string) {
    const maxAge = tokenMaxAge(token)
    document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; SameSite=Strict`
        + (maxAge !== null ? `; max-age=${maxAge}` : '')
}

export function getToken(): string | null {
    const match = document.cookie.split('; ').find((c) => c.startsWith(`${TOKEN_COOKIE}=`))
    return match ? decodeURIComponent(match.split('=')[1]) : null
}

export function removeToken() {
    document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0`
}
