import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Check, X, Calendar, MessageSquare, AlertCircle } from 'lucide-react'
import { useNotifications } from '../contexts/NotificationContext'

const TYPE_ICONS = {
    appointment_requested: Calendar,
    appointment_confirmed: Check,
    appointment_cancelled: AlertCircle,
    feedback_received: MessageSquare,
}

const TYPE_COLORS = {
    appointment_requested: 'text-blue-400',
    appointment_confirmed: 'text-emerald-400',
    appointment_cancelled: 'text-red-400',
    feedback_received: 'text-amber-400',
}

function timeAgo(ts) {
    const diff = Date.now() - ts
    const mins = Math.floor(diff / 60_000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
}

export default function NotificationPanel() {
    const [open, setOpen] = useState(false)
    const panelRef = useRef(null)
    const { notifications, unreadCount, markAsRead, markAllRead, clearNotification } = useNotifications()

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false)
        }
        if (open) document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [open])

    return (
        <div className="relative" ref={panelRef}>
            {/* Bell Button */}
            <button
                onClick={() => setOpen(!open)}
                className="relative h-9 w-9 rounded-xl flex items-center justify-center
                           bg-zinc-900/60 border border-zinc-800/50
                           hover:border-emerald-500/30 transition-all duration-300 cursor-pointer group"
                aria-label="Notifications"
            >
                <Bell className="h-4 w-4 text-zinc-400 group-hover:text-white transition-colors" />
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full
                                   bg-emerald-500 text-[10px] font-bold text-white
                                   flex items-center justify-center ring-2 ring-[#09090b]"
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                )}
            </button>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute right-0 top-12 w-80 sm:w-96
                                   bg-[#18181b]/95 backdrop-blur-xl border border-zinc-800/80
                                   rounded-2xl shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6)]
                                   overflow-hidden z-50"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/60">
                            <h3 className="text-sm font-semibold text-white">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium transition-colors cursor-pointer"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="py-8 text-center text-zinc-600 text-sm">
                                    No notifications yet
                                </div>
                            ) : (
                                notifications.slice(0, 10).map((notif) => {
                                    const Icon = TYPE_ICONS[notif.type] || Bell
                                    const color = TYPE_COLORS[notif.type] || 'text-zinc-400'
                                    return (
                                        <motion.div
                                            key={notif.id}
                                            layout
                                            initial={{ opacity: 0, x: -8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 8 }}
                                            onClick={() => markAsRead(notif.id)}
                                            className={`flex items-start gap-3 px-4 py-3 border-b border-zinc-800/30
                                                       hover:bg-zinc-800/30 transition-colors cursor-pointer
                                                       ${!notif.read ? 'bg-emerald-500/[0.03]' : ''}`}
                                        >
                                            <div className={`mt-0.5 p-1.5 rounded-lg bg-zinc-800/60 ${color}`}>
                                                <Icon style={{ width: 14, height: 14 }} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className={`text-xs font-semibold truncate ${
                                                        !notif.read ? 'text-white' : 'text-zinc-400'
                                                    }`}>
                                                        {notif.title}
                                                    </p>
                                                    {!notif.read && (
                                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-2 leading-relaxed">
                                                    {notif.message}
                                                </p>
                                                <p className="text-[10px] text-zinc-600 mt-1">{timeAgo(notif.timestamp)}</p>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); clearNotification(notif.id) }}
                                                className="mt-0.5 p-1 rounded-md text-zinc-600 hover:text-red-400
                                                           hover:bg-zinc-800/60 transition-colors cursor-pointer shrink-0"
                                                aria-label="Dismiss"
                                            >
                                                <X style={{ width: 12, height: 12 }} />
                                            </button>
                                        </motion.div>
                                    )
                                })
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
