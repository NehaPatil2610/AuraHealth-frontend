import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'

const NotificationContext = createContext()

// ── Mock notification seed data ────────────────────────────────
const INITIAL_NOTIFICATIONS = [
    {
        id: 'n-001',
        type: 'appointment_requested',
        title: 'New Appointment Request',
        message: 'Patient Riya Sharma has requested a slot for July 15, 10:30 AM.',
        timestamp: Date.now() - 120_000,
        read: false,
    },
    {
        id: 'n-002',
        type: 'appointment_confirmed',
        title: 'Appointment Confirmed',
        message: 'Your appointment with Dr. Marcus Hale has been confirmed for July 16, 2:00 PM.',
        timestamp: Date.now() - 600_000,
        read: false,
    },
    {
        id: 'n-003',
        type: 'feedback_received',
        title: 'New Feedback',
        message: 'You received a 5-star review from patient Alex Morgan.',
        timestamp: Date.now() - 3_600_000,
        read: true,
    },
]

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
    const [toasts, setToasts] = useState([])
    const toastIdRef = useRef(0)

    const unreadCount = notifications.filter(n => !n.read).length

    const pushNotification = useCallback((notification) => {
        const id = `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
        const newNotif = {
            id,
            timestamp: Date.now(),
            read: false,
            ...notification,
        }
        setNotifications(prev => [newNotif, ...prev])

        // Show toast
        const toastId = ++toastIdRef.current
        setToasts(prev => [...prev, { ...newNotif, toastId }])
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.toastId !== toastId))
        }, 4000)
    }, [])

    const markAsRead = useCallback((id) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        )
    }, [])

    const markAllRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    }, [])

    const clearNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id))
    }, [])

    // ── Simulate incoming notifications every 45 seconds ───────
    useEffect(() => {
        const mockEvents = [
            { type: 'appointment_requested', title: 'Appointment Requested', message: 'Patient Meera Kapoor wants a slot on July 18, 9:00 AM.' },
            { type: 'appointment_confirmed', title: 'Slot Confirmed', message: 'Dr. Priya Nair confirmed your July 17 session.' },
            { type: 'appointment_cancelled', title: 'Cancellation Notice', message: 'Patient John Lee cancelled their July 19 appointment.' },
        ]
        let idx = 0
        const interval = setInterval(() => {
            pushNotification(mockEvents[idx % mockEvents.length])
            idx++
        }, 45_000)
        return () => clearInterval(interval)
    }, [pushNotification])

    return (
        <NotificationContext.Provider value={{
            notifications,
            toasts,
            unreadCount,
            pushNotification,
            markAsRead,
            markAllRead,
            clearNotification,
        }}>
            {children}
        </NotificationContext.Provider>
    )
}

export function useNotifications() {
    const ctx = useContext(NotificationContext)
    if (!ctx) throw new Error('useNotifications must be used within NotificationProvider')
    return ctx
}

export default NotificationContext
