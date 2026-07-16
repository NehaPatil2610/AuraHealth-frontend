import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import ModernAuth from '../../components/ui/modern-login-signup'

export default function AuthView({ initialMode = 'signin', onBackToLanding }) {
    const { loginWithGoogle, credentialLogin, credentialRegister, isLoading: contextLoading, authError, setAuthError } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [mode, setMode] = useState(initialMode)

    // Surface an OAuth failure the backend signalled via ?error= on the
    // redirect-back, then strip the query so a refresh doesn't re-show it.
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        if (params.has('error')) {
            setAuthError('Google sign-in failed. Please try again or use email.')
            window.history.replaceState({}, '', window.location.pathname)
        }
    }, [setAuthError])

    const handleLogin = async (email, password) => {
        setIsLoading(true)
        setAuthError(null)
        await credentialLogin(email, password)
        setIsLoading(false)
    }

    const handleRegister = async (name, email, password, role) => {
        setIsLoading(true)
        setAuthError(null)
        await credentialRegister({ name, email, password, role })
        setIsLoading(false)
    }

    return (
        <ModernAuth
            initialMode={mode}
            isLoading={isLoading || contextLoading}
            authError={authError}
            onBackToLanding={onBackToLanding}
            onLogin={handleLogin}
            onRegister={handleRegister}
            onGoogleLogin={loginWithGoogle}
            onSwitchMode={(newMode) => {
                setMode(newMode)
                setAuthError(null)
            }}
        />
    )
}
