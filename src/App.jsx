import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

function AppContainer() {
    const { user } = useAuth()
    
    useFavicon()

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