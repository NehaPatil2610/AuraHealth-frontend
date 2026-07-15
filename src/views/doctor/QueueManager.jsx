import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ListOrdered, Clock, User, Crown, Check, X,
    RotateCcw, Play, ChevronRight
} from 'lucide-react'
import { useNotifications } from '../../contexts/NotificationContext'

// ── Mock Queue Data ────────────────────────────────────────────
const INITIAL_QUEUE = [
    { id: 'q-01', patientName: 'Alex Morgan', symptoms: 'Mild chest discomfort', tier: 'wellness', waitTime: '2 min', status: 'waiting', arrivalTime: '08:55 AM' },
    { id: 'q-02', patientName: 'Riya Sharma', symptoms: 'Recurring headaches', tier: 'personal', waitTime: '8 min', status: 'waiting', arrivalTime: '08:50 AM' },
    { id: 'q-03', patientName: 'John Lee', symptoms: 'Follow-up consultation', tier: 'priority', waitTime: '15 min', status: 'waiting', arrivalTime: '09:00 AM' },
    { id: 'q-04', patientName: 'Priya Patel', symptoms: 'Blood pressure monitoring', tier: 'free', waitTime: '22 min', status: 'waiting', arrivalTime: '09:05 AM' },
    { id: 'q-05', patientName: 'Meera Kapoor', symptoms: 'Annual cardiac checkup', tier: 'free', waitTime: '28 min', status: 'waiting', arrivalTime: '09:10 AM' },
    { id: 'q-06', patientName: 'David Chen', symptoms: 'Shortness of breath', tier: 'priority', waitTime: '35 min', status: 'waiting', arrivalTime: '09:15 AM' },
    { id: 'q-07', patientName: 'Sara Ahmed', symptoms: 'Post-surgery follow-up', tier: 'free', waitTime: '42 min', status: 'waiting', arrivalTime: '09:20 AM' },
    { id: 'q-08', patientName: 'Vikram Singh', symptoms: 'Chest pain evaluation', tier: 'wellness', waitTime: '5 min', status: 'waiting', arrivalTime: '09:25 AM' },
]

const TIER_CONFIG = {
    free: { label: 'Standard', color: 'text-zinc-400', bg: 'bg-zinc-800/50', icon: Clock, border: 'border-zinc-800/40' },
    priority: { label: 'Priority', color: 'text-blue-400', bg: 'bg-blue-500/10', icon: Crown, border: 'border-blue-500/20' },
    personal: { label: 'Personal', color: 'text-purple-400', bg: 'bg-purple-500/10', icon: Crown, border: 'border-purple-500/20' },
    wellness: { label: 'Wellness+', color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: Crown, border: 'border-emerald-500/20' },
}

const STATUS_MAP = {
    waiting: { label: 'Waiting', color: 'text-amber-400', dot: 'bg-amber-500' },
    in_progress: { label: 'In Progress', color: 'text-blue-400', dot: 'bg-blue-500' },
    completed: { label: 'Completed', color: 'text-emerald-400', dot: 'bg-emerald-500' },
    cancelled: { label: 'Cancelled', color: 'text-red-400', dot: 'bg-red-500' },
}

export default function QueueManager() {
    const [queue, setQueue] = useState(INITIAL_QUEUE)
    const { pushNotification } = useNotifications()

    // Sort: premium tiers first, then by arrival time
    const tierOrder = { wellness: 0, personal: 1, priority: 2, free: 3 }
    const sortedQueue = [...queue].sort((a, b) => {
        if (a.status === 'completed' || a.status === 'cancelled') return 1
        if (b.status === 'completed' || b.status === 'cancelled') return -1
        return tierOrder[a.tier] - tierOrder[b.tier]
    })

    const handleProcess = (id) => {
        setQueue(prev => prev.map(q =>
            q.id === id ? { ...q, status: 'in_progress' } : q
        ))
        const patient = queue.find(q => q.id === id)
        pushNotification({
            type: 'appointment_confirmed',
            title: 'Patient Called In',
            message: `${patient?.patientName} has been called for their appointment.`,
        })
    }

    const handleComplete = (id) => {
        setQueue(prev => prev.map(q =>
            q.id === id ? { ...q, status: 'completed' } : q
        ))
    }

    const handleCancel = (id) => {
        const patient = queue.find(q => q.id === id)
        setQueue(prev => prev.map(q =>
            q.id === id ? { ...q, status: 'cancelled' } : q
        ))
        pushNotification({
            type: 'appointment_cancelled',
            title: 'Appointment Cancelled',
            message: `${patient?.patientName}'s appointment has been cancelled.`,
        })
    }

    const handleReschedule = (id) => {
        const patient = queue.find(q => q.id === id)
        setQueue(prev => prev.filter(q => q.id !== id))
        pushNotification({
            type: 'appointment_requested',
            title: 'Rescheduling Required',
            message: `${patient?.patientName} needs to be rescheduled. Removed from today's queue.`,
        })
    }

    const activeCount = queue.filter(q => q.status === 'waiting' || q.status === 'in_progress').length
    const inProgressItem = queue.find(q => q.status === 'in_progress')

    return (
        <div className="space-y-5">
            {/* Header Stats */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                    <ListOrdered style={{ width: 16, height: 16 }} className="text-emerald-400" />
                    <h2 className="text-base font-semibold text-white">Queue Manager</h2>
                    <span className="text-xs text-zinc-600">
                        {activeCount} active · {queue.filter(q => q.status === 'completed').length} completed
                    </span>
                </div>

                {inProgressItem && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[11px] font-medium text-blue-400">
                            Now Seeing: {inProgressItem.patientName}
                        </span>
                    </div>
                )}
            </div>

            {/* Queue List */}
            <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                    {sortedQueue.map((item, idx) => {
                        const tier = TIER_CONFIG[item.tier]
                        const statusInfo = STATUS_MAP[item.status]
                        const TierIcon = tier.icon
                        const isDone = item.status === 'completed' || item.status === 'cancelled'

                        return (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: isDone ? 0.5 : 1, x: 0 }}
                                exit={{ opacity: 0, x: 12, height: 0 }}
                                transition={{ duration: 0.25 }}
                                className={`bg-zinc-900/40 border rounded-2xl p-4 transition-colors ${
                                    item.status === 'in_progress'
                                        ? 'border-blue-500/30 bg-blue-500/[0.03]'
                                        : tier.border
                                }`}
                            >
                                <div className="flex items-center gap-3.5">
                                    {/* Position */}
                                    <div className="text-center shrink-0 w-8">
                                        <span className={`text-lg font-bold ${isDone ? 'text-zinc-700' : 'text-zinc-500'}`}>
                                            {isDone ? '—' : idx + 1}
                                        </span>
                                    </div>

                                    {/* Patient Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="text-sm font-semibold text-white truncate">{item.patientName}</p>
                                            {/* Tier Badge */}
                                            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${tier.bg} ${tier.color}`}>
                                                <TierIcon style={{ width: 9, height: 9 }} />
                                                {tier.label}
                                            </span>
                                            {/* Status */}
                                            <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${statusInfo.color}`}>
                                                <span className={`h-1 w-1 rounded-full ${statusInfo.dot} ${item.status === 'in_progress' ? 'animate-pulse' : ''}`} />
                                                {statusInfo.label}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-zinc-500 mt-0.5 truncate">
                                            {item.symptoms} · Arrived: {item.arrivalTime}
                                        </p>
                                    </div>

                                    {/* Wait Time */}
                                    {!isDone && (
                                        <div className="text-right shrink-0 hidden sm:block">
                                            <p className="text-xs text-zinc-500">Wait</p>
                                            <p className="text-sm font-semibold text-white">{item.waitTime}</p>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    {!isDone && (
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            {item.status === 'waiting' && (
                                                <button
                                                    onClick={() => handleProcess(item.id)}
                                                    className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400
                                                               hover:bg-emerald-500/20 transition-colors cursor-pointer"
                                                    title="Call Patient"
                                                >
                                                    <Play style={{ width: 13, height: 13 }} />
                                                </button>
                                            )}
                                            {item.status === 'in_progress' && (
                                                <button
                                                    onClick={() => handleComplete(item.id)}
                                                    className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400
                                                               hover:bg-emerald-500/20 transition-colors cursor-pointer"
                                                    title="Mark Complete"
                                                >
                                                    <Check style={{ width: 13, height: 13 }} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleReschedule(item.id)}
                                                className="p-2 rounded-lg bg-zinc-800/50 text-zinc-500
                                                           hover:text-amber-400 hover:bg-amber-500/10
                                                           transition-colors cursor-pointer"
                                                title="Reschedule"
                                            >
                                                <RotateCcw style={{ width: 13, height: 13 }} />
                                            </button>
                                            <button
                                                onClick={() => handleCancel(item.id)}
                                                className="p-2 rounded-lg bg-zinc-800/50 text-zinc-500
                                                           hover:text-red-400 hover:bg-red-500/10
                                                           transition-colors cursor-pointer"
                                                title="Cancel"
                                            >
                                                <X style={{ width: 13, height: 13 }} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </div>
        </div>
    )
}
