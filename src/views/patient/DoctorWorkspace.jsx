import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, Video, Bell, FileText, CheckCircle, CheckCircle2 } from 'lucide-react'

export default function DoctorWorkspace() {
    const isDark = document.body.classList.contains('dark-theme')
    const [activeMessage, setActiveMessage] = useState(null)
    const [dayComplete, setDayComplete] = useState(false)

    const appointments = [
        { id: 1, time: '09:00 AM', patient: 'Michael Chang', type: 'Video Consult', status: 'Upcoming', urgent: false },
        { id: 2, time: '10:30 AM', patient: 'Sarah Jenkins', type: 'Follow-up', status: 'Waiting', urgent: true },
        { id: 3, time: '01:15 PM', patient: 'David Smith', type: 'Initial Review', status: 'Scheduled', urgent: false },
    ]

    const handleAction = (msg) => {
        setActiveMessage(msg)
        setTimeout(() => setActiveMessage(null), 3000)
    }

    return (
        <div className="space-y-6">
            <AnimatePresence>
                {activeMessage && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                                className="fixed top-20 right-8 z-50 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl font-bold text-sm flex items-center gap-3">
                        <CheckCircle2 style={{ width: 18, height: 18, minWidth: 18, minHeight: 18, flexShrink: 0 }} />
                        {activeMessage}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                        Consultation Queue
                    </h2>
                    <p className={`text-sm mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        Manage your active schedule and incoming priority patients.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => handleAction('Opening alert configuration matrix')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-900 shadow-sm'
                    }`}>
                        <Bell style={{ width: 16, height: 16, minWidth: 16, minHeight: 16, flexShrink: 0 }} />
                        Alerts
                    </button>
                    <button 
                        onClick={() => handleAction('Establishing secure WebRTC bridge...')}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-colors cursor-pointer"
                    >
                        <Video style={{ width: 16, height: 16, minWidth: 16, minHeight: 16, flexShrink: 0 }} />
                        Join Next Call
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    {appointments.map((apt) => (
                        <motion.div
                            key={apt.id}
                            className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                                apt.urgent
                                    ? isDark ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'
                                    : isDark ? 'bg-[#18181b] border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl shrink-0 ${
                                    isDark ? 'bg-zinc-900' : 'bg-zinc-100'
                                }`}>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Time</span>
                                    <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{apt.time.split(' ')[0]}</span>
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className={`text-lg font-bold truncate ${isDark ? 'text-white' : 'text-zinc-900'}`}>{apt.patient}</h3>
                                        {apt.urgent && (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-500/20 text-red-500 shrink-0">Urgent</span>
                                        )}
                                    </div>
                                    <div className={`flex flex-wrap items-center gap-3 mt-1 text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                        <span className="flex items-center gap-1 whitespace-nowrap"><FileText style={{ width: 12, height: 12, minWidth: 12, minHeight: 12, flexShrink: 0 }} /> {apt.type}</span>
                                        <span className="hidden sm:inline">•</span>
                                        <span className="flex items-center gap-1 whitespace-nowrap"><Clock style={{ width: 12, height: 12, minWidth: 12, minHeight: 12, flexShrink: 0 }} /> {apt.status}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex sm:flex-col gap-2 shrink-0">
                                <button 
                                    onClick={() => handleAction(`Fetching clinical records for ${apt.patient}`)}
                                    className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600/20 text-emerald-500 hover:bg-emerald-600/30 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                                >
                                    View Records
                                </button>
                                <button 
                                    onClick={() => handleAction(`Opening reschedule form for ${apt.patient}`)}
                                    className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                                    isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                                }`}>
                                    Reschedule
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="space-y-6">
                    <div className={`p-6 rounded-2xl border ${
                        isDark ? 'bg-[#18181b] border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
                    }`}>
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar style={{ width: 18, height: 18, minWidth: 18, minHeight: 18, flexShrink: 0 }} className="text-emerald-500" />
                            <h3 className={`font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>Today's Summary</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Total Scheduled</span>
                                <span className={`font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>8</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Completed</span>
                                <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>3</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Pending</span>
                                <span className={`font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>5</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => {
                                setDayComplete(true)
                                handleAction('Day marked as complete. Syncing metrics...')
                            }}
                            disabled={dayComplete}
                            className={`w-full mt-6 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                                dayComplete 
                                    ? 'bg-zinc-800/50 text-zinc-500 cursor-not-allowed'
                                    : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 cursor-pointer'
                            }`}
                        >
                            <CheckCircle style={{ width: 16, height: 16, minWidth: 16, minHeight: 16, flexShrink: 0 }} />
                            {dayComplete ? 'Day Complete' : 'Mark Day Complete'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
