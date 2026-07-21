import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { api } from '../api'
import { useAuth } from './AuthContext'

const NotificationContext = createContext()

export function NotificationProvider({ children }) {
    const { user } = useAuth()
    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [toasts, setToasts] = useState([])
    const toastIdRef = useRef(0)

    const fetchNotifications = useCallback(async () => {
        if (!user) return
        try {
            const data = await api.getNotifications()
            if (data && data.notifications) {
                const mapped = data.notifications.map(n => ({
                    ...n,
                    timestamp: new Date(n.createdAt).getTime()
                }))
                setNotifications(mapped)
                setUnreadCount(data.unreadCount || 0)
            }
        } catch (error) {
            console.error('Failed to fetch notifications', error)
        }
    }, [user])

    useEffect(() => {
        fetchNotifications()
        if (user) {
            const interval = setInterval(fetchNotifications, 60_000)
            return () => clearInterval(interval)
        }
    }, [fetchNotifications, user])

    const pushNotification = useCallback((notification) => {
        const id = `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
        const newNotif = {
            id,
            timestamp: Date.now(),
            read: false,
            ...notification,
        }
        setNotifications(prev => [newNotif, ...prev])
        setUnreadCount(prev => prev + 1)

        // Show toast
        const toastId = ++toastIdRef.current
        setToasts(prev => [...prev, { ...newNotif, toastId }])
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.toastId !== toastId))
        }, 4000)
    }, [])

    const markAsRead = useCallback(async (id) => {
        try {
            // Only call API if it's a real backend ID (numbers), not local mock IDs (n-...)
            if (typeof id === 'number' || !String(id).startsWith('n-')) {
                await api.markNotificationRead(id)
            }
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read: true } : n)
            )
            setUnreadCount(prev => Math.max(0, prev - 1))
        } catch (error) {
            console.error('Failed to mark notification as read', error)
        }
    }, [])

    const markAllRead = useCallback(async () => {
        try {
            await api.markAllNotificationsRead()
            setNotifications(prev => prev.map(n => ({ ...n, read: true })))
            setUnreadCount(0)
        } catch (error) {
            console.error('Failed to mark all notifications as read', error)
        }
    }, [])

    const clearNotification = useCallback((id) => {
        setNotifications(prev => {
            const notif = prev.find(n => n.id === id)
            if (notif && !notif.read) {
                setUnreadCount(c => Math.max(0, c - 1))
            }
            return prev.filter(n => n.id !== id)
        })
    }, [])

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
