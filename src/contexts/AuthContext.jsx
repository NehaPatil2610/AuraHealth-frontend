import { createContext, useContext, useState, useCallback } from 'react'

// In production the Vite env var points to the Render backend origin.
// Locally it falls back to '' so the Vite dev proxy keeps working.
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

const AuthContext = createContext()

/**
 * Normalizes user data received from any backend endpoint.
 */
function normalizeUser(userData) {
    if (!userData) return null
    return userData
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [authError, setAuthError] = useState(null)

    // ── Direct Login (sets user object from any source) ────────
    const login = useCallback((userData) => {
        setUser(normalizeUser(userData))
        setAuthError(null)
    }, [])

    // ── Session Check (cookie-based JWT validation) ────────────
    // Uses an AbortController timeout so the app never hangs on a cold
    // Render start (free tier queues TCP connections indefinitely, which
    // would keep the black BootSplash visible forever without a timeout).
    const checkSession = useCallback(async () => {
        setIsLoading(true)
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000) // 8-second max wait
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
                credentials: 'include',
                signal: controller.signal,
            })
            clearTimeout(timeoutId)
            if (res.ok) {
                const data = await res.json()
                setUser(normalizeUser(data))
                setAuthError(null)
                return true
            }
        } catch {
            // AbortError (timeout) or network error — no active session, show landing page
        } finally {
            clearTimeout(timeoutId)
            setIsLoading(false)
        }
        return false
    }, [])

    // ── Credential-Based Auth (POST to monolith) ───────────────
    const credentialLogin = useCallback(async (email, password) => {
        setIsLoading(true)
        setAuthError(null)
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            })
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                const msg = errorData.error || errorData.message || 'Invalid credentials';
                throw new Error(msg);
            }
            const data = await res.json()
            setUser(normalizeUser(data.user))
            return true
        } catch (err) {
            setAuthError(err.message || 'Login failed')
            return false
        } finally {
            setIsLoading(false)
        }
    }, [])

    // ── Account Registration ───────────────────────────────────
    const credentialRegister = useCallback(async (payload) => {
        setIsLoading(true)
        setAuthError(null)
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    name: payload.name,
                    email: payload.email,
                    password: payload.password,
                    role: payload.role === 'doctor' ? 'DOCTOR' : 'PATIENT',
                    licenseId: payload.licenseId || null,
                    specialty: payload.specialty || null,
                }),
            })
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                const msg = errorData.error || errorData.message || 'Registration failed';
                throw new Error(msg);
            }
            const data = await res.json()
            setUser(normalizeUser(data.user))
            return true
        } catch (err) {
            setAuthError(err.message || 'Registration failed')
            return false
        } finally {
            setIsLoading(false)
        }
    }, [])

    // ── Logout ─────────────────────────────────────────────────
    const logout = useCallback(async () => {
        try {
            await fetch(`${API_BASE_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            })
        } catch {
            // Logout silently on failure
        }
        setUser(null)
        setAuthError(null)
    }, [])

    // ── Profile Update ─────────────────────────────────────────
    const updateProfile = useCallback((updates) => {
        setUser(prev => prev ? { ...prev, ...updates } : null)
    }, [])

    // ── Google OAuth (Spring Security redirect flow) ───────────
    // Full-page navigation to the backend OAuth2 start endpoint. The
    // backend redirects to Google, handles the callback, sets the HttpOnly
    // JWT cookie, then redirects back to the frontend. checkSession() (run
    // on app mount) then restores the user from that cookie.
    // In production the full Render URL is used so the browser navigates
    // directly to the backend. Locally the Vite dev proxy handles it.
    const loginWithGoogle = useCallback(() => {
        window.location.assign(`${API_BASE_URL}/oauth2/authorization/google`)
    }, [])

    const isPatient = user?.role === 'PATIENT'
    const isDoctor = user?.role === 'DOCTOR'
    const isAdmin = user?.role === 'ADMIN'

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            authError,
            isPatient,
            isDoctor,
            isAdmin,
            login,
            credentialLogin,
            credentialRegister,
            loginWithGoogle,
            logout,
            checkSession,
            updateProfile,
            setAuthError,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}

export default AuthContext
