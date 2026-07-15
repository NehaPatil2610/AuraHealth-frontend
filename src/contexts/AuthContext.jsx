import { createContext, useContext, useState, useCallback } from 'react'

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
    const checkSession = useCallback(async () => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/auth/me', { credentials: 'include' })
            if (res.ok) {
                const data = await res.json()
                setUser(normalizeUser(data))
                setAuthError(null)
                return true
            }
        } catch {
            // No active session — stay on auth screen
        } finally {
            setIsLoading(false)
        }
        return false
    }, [])

    // ── Credential-Based Auth (POST to monolith) ───────────────
    const credentialLogin = useCallback(async (email, password) => {
        setIsLoading(true)
        setAuthError(null)
        try {
            const res = await fetch('/api/auth/login', {
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
            const res = await fetch('/api/auth/register', {
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
            await fetch('/api/auth/logout', {
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

    // ── Mock Auth Bypass ───────────────────────────────────────
    const mockAuthBypass = useCallback(async (payload) => {
        setIsLoading(true)
        setAuthError(null)
        try {
            const res = await fetch('/api/auth/oauth-mock-bypass', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    email: payload.email,
                    name: payload.name || 'Mock User',
                    role: payload.role === 'doctor' ? 'DOCTOR' : 'PATIENT',
                }),
            })
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Mock bypass failed');
            }
            const data = await res.json()
            setUser(normalizeUser(data.user))
            return true
        } catch (err) {
            setAuthError(err.message || 'Mock bypass failed')
            return false
        } finally {
            setIsLoading(false)
        }
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
            mockAuthBypass,
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
