import { useEffect, useState, Component } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { ThemeProvider } from './contexts/ThemeContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AuthView from './views/patient/AuthView'
import LandingPage from './views/LandingPage'
import DashboardLayout from './layouts/DashboardLayout'

// Catches any render crash and shows the error on-screen instead of a blank page.
class ErrorBoundary extends Component {
    constructor(props) { super(props); this.state = { error: null } }
    static getDerivedStateFromError(error) { return { error } }
    render() {
        if (this.state.error) {
            return (
                <div style={{ padding: 32, color: '#f87171', fontFamily: 'monospace', background: '#09090b', minHeight: '100vh' }}>
                    <h2 style={{ color: '#fca5a5' }}>⚠ AuraHealth crashed on startup</h2>
                    <pre style={{ whiteSpace: 'pre-wrap', marginTop: 16 }}>{this.state.error.toString()}</pre>
                    <pre style={{ whiteSpace: 'pre-wrap', color: '#6b7280', fontSize: 12, marginTop: 12 }}>{this.state.error.stack}</pre>
                </div>
            )
        }
        return this.props.children
    }
}

function useFavicon() {
    useEffect(() => {
        const existingLinks = document.querySelectorAll('link[rel*="icon"]')
        existingLinks.forEach(link => link.remove())

        const link = document.createElement('link')
        link.rel = 'icon'
        link.type = 'image/svg+xml'
        link.href = '/favicon.svg'
        document.head.appendChild(link)

        document.title = 'AuraHealth — Precision Care Platform'
    }, [])
}

function BootSplash() {
    return (
        <div className="h-screen w-screen bg-[#09090b] flex items-center justify-center">
            <Loader2 style={{ width: 28, height: 28 }} className="animate-spin text-[#10b981]" />
        </div>
    )
}

function AppContainer() {
    const { user, checkSession } = useAuth()
    const [booting, setBooting] = useState(true)
    const [showLanding, setShowLanding] = useState(true)
    const [initialAuthMode, setInitialAuthMode] = useState('signin')

    useFavicon()

    // Restore the cookie/JWT session on load. Also the landing point after
    // the Google OAuth redirect-back, where the cookie is already set.
    useEffect(() => {
        // Hard safety timer — guarantees the black screen exits within 10s
        // even if checkSession's AbortController somehow fails to fire.
        const safetyTimer = setTimeout(() => setBooting(false), 10000)
        checkSession().finally(() => {
            clearTimeout(safetyTimer)
            setBooting(false)
        })
        return () => clearTimeout(safetyTimer)
    }, [checkSession])

    if (booting) {
        return <BootSplash />
    }

    // Logged-in users go straight to dashboard
    if (user) {
        return (
            <AnimatePresence mode="wait">
                <motion.div
                    key={user.role}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="h-full w-full"
                >
                    <DashboardLayout />
                </motion.div>
            </AnimatePresence>
        )
    }

    // Not logged in: show landing page or auth view
    if (showLanding) {
        return (
            <LandingPage
                onSignIn={() => {
                    setInitialAuthMode('signin')
                    setShowLanding(false)
                }}
                onGetStarted={() => {
                    setInitialAuthMode('signup')
                    setShowLanding(false)
                }}
            />
        )
    }

    return <AuthView initialMode={initialAuthMode} onBackToLanding={() => setShowLanding(true)} />
}

export default function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <ThemeProvider>
                    <NotificationProvider>
                        <AppContainer />
                    </NotificationProvider>
                </ThemeProvider>
            </AuthProvider>
        </ErrorBoundary>
    )
}