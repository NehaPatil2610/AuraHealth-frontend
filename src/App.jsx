import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { ThemeProvider } from './contexts/ThemeContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AuthView from './views/patient/AuthView'
import DashboardLayout from './layouts/DashboardLayout'

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

    useFavicon()

    // Restore the cookie/JWT session on load. Also the landing point after
    // the Google OAuth redirect-back, where the cookie is already set.
    useEffect(() => {
        checkSession().finally(() => setBooting(false))
    }, [checkSession])

    if (booting) {
        return <BootSplash />
    }

    if (!user) {
        return <AuthView />
    }

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

export default function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <NotificationProvider>
                    <AppContainer />
                </NotificationProvider>
            </ThemeProvider>
        </AuthProvider>
    )
}