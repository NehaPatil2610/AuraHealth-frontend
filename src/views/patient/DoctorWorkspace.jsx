import { useState, useEffect, useCallback } from 'react'
import { api } from '../../api'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, Bell, FileText, CheckCircle, CheckCircle2, Activity, X, AlertTriangle } from 'lucide-react'
import Footer from '../../components/Footer'
import NotificationPanel from '../../components/NotificationPanel'
import { CalendarAppointmentBookingDemo } from '../../components/ui/CalendarAppointmentBookingDemo'

// A simple reusable modal shell for the Doctor Workspace
function ModalShell({ isOpen, onClose, title, children }) {
    const isDark = document.body.classList.contains('dark-theme')

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
                    onClick={onClose}
                />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className={`relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col ${
                        isDark ? 'bg-[#18181b] border border-[#27272a]' : 'bg-white border border-zinc-200'
                    }`}
                >
                    <div className={`px-6 py-4 flex items-center justify-between border-b shrink-0 ${isDark ? 'border-[#27272a]' : 'border-zinc-200'}`}>
                        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{title}</h3>
                        <button onClick={onClose} className={`p-2 rounded-lg cursor-pointer transition-colors ${isDark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-500'}`}>
                            <X style={{ width: 20, height: 20, minWidth: 20, minHeight: 20, flexShrink: 0 }} />
                        </button>
                    </div>
                    <div className="p-6 overflow-y-auto custom-scrollbar flex-1 max-h-[80vh]">
                        {children}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

function DoctorViewRecordModal({ isOpen, onClose, apt, records }) {
    const isDark = document.body.classList.contains('dark-theme')
    return (
        <ModalShell isOpen={isOpen} onClose={onClose} title={`Medical Records - ${apt?.patient}`}>
            {apt && (
                <div className="space-y-4">
                    {records && records.length > 0 ? (
                        records.map(record => (
                            <div key={record.id} className={`p-4 rounded-xl border ${isDark ? 'bg-[#09090b] border-[#27272a]' : 'bg-zinc-50 border-zinc-200'}`}>
                                <h4 className="text-sm font-bold text-white mb-1">{record.title}</h4>
                                <p className="text-xs text-zinc-400 mb-4">{record.recordType} • {new Date(record.recordDate).toLocaleString()}</p>
                                <div className="p-4 bg-[#18181b] border border-[#27272a] rounded-lg text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                                    {record.content}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={`p-4 text-center text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                            No medical records found for this patient.
                        </div>
                    )}
                </div>
            )}
        </ModalShell>
    )
}

function DoctorRescheduleModal({ isOpen, onClose, apt, onReschedule }) {
    const isDark = document.body.classList.contains('dark-theme')
    const [rescheduled, setRescheduled] = useState(false)
    const [error, setError] = useState(null)

    const handleConfirm = async (date, selectedTime) => {
        if (!date || !selectedTime) return
        setError(null)
        try {
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            const newTime = `${year}-${month}-${day}T${selectedTime}:00`

            await api.rescheduleAppointment(apt.id, newTime)

            setRescheduled(true)
            setTimeout(() => {
                setRescheduled(false)
                onReschedule()
                onClose()
            }, 1500)
        } catch (e) {
            setError(e.message || 'Failed to reschedule appointment')
        }
    }

    return (
        <ModalShell isOpen={isOpen} onClose={onClose} title="Reschedule Appointment">
            {apt && (
                <div className="space-y-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}
                    {rescheduled ? (
                         <div className="py-8 flex flex-col items-center justify-center text-center">
                            <CheckCircle2 style={{ width: 48, height: 48, flexShrink: 0 }} className="text-emerald-500 mb-4" />
                            <h2 className="text-xl font-bold text-white mb-2">Rescheduled Successfully</h2>
                        </div>
                    ) : (
                        <>
                            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
                                <AlertTriangle style={{ width: 18, height: 18, flexShrink: 0 }} className="text-amber-500 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-amber-500">Current Slot: {apt.time}</p>
                                    <p className="text-xs text-amber-500/70 mt-1">Select a new timing block to reschedule {apt.patient}.</p>
                                </div>
                            </div>
                            <CalendarAppointmentBookingDemo onConfirm={handleConfirm} />
                        </>
                    )}
                </div>
            )}
        </ModalShell>
    )
}

export default function DoctorWorkspace() {
    const isDark = document.body.classList.contains('dark-theme')
    const [activeMessage, setActiveMessage] = useState(null)
    const [dayComplete, setDayComplete] = useState(false)
    const [appointments, setAppointments] = useState([])
    
    const [activeRecordData, setActiveRecordData] = useState(null)
    const [activeRescheduleApt, setActiveRescheduleApt] = useState(null)

    const fetchAppointments = useCallback(async () => {
        try {
            const res = await api.getMyAppointments()
            // Map the API response to the format needed
            const mapped = (res || []).map(a => {
                const isUrgent = a.priority === true
                return {
                    id: a.id,
                    patientId: a.patientId,
                    patient: a.patientName || 'Unknown Patient',
                    type: a.symptoms ? 'Consultation' : 'General Checkup',
                    status: a.status,
                    urgent: isUrgent,
                    time: new Date(a.appointmentTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
                    rawTime: a.appointmentTime
                }
            })
            // Sort by time
            mapped.sort((a, b) => new Date(a.rawTime) - new Date(b.rawTime))
            setAppointments(mapped)
        } catch (e) {
            console.error(e)
        }
    }, [])

    useEffect(() => {
        fetchAppointments()
    }, [fetchAppointments])

    const handleAction = (msg) => {
        setActiveMessage(msg)
        setTimeout(() => setActiveMessage(null), 3000)
    }

    const handleViewRecords = async (apt) => {
        try {
            const records = await api.getPatientRecords(apt.patientId)
            setActiveRecordData({ apt, records })
        } catch (e) {
            handleAction('Failed to fetch records')
        }
    }

    const handleDayComplete = async () => {
        try {
            setDayComplete(true)
            await api.markDayComplete()
            handleAction('Day marked as complete. Syncing metrics...')
            await fetchAppointments()
            setTimeout(() => setDayComplete(false), 3000)
        } catch (e) {
            handleAction('Failed to mark day complete')
            setDayComplete(false)
        }
    }

    // Calculate metrics
    const todayStr = new Date().toISOString().split('T')[0]
    const todayAppointments = appointments.filter(a => a.rawTime && a.rawTime.startsWith(todayStr))
    const totalToday = todayAppointments.length
    const doneToday = todayAppointments.filter(a => a.status === 'DONE').length
    const pendingToday = totalToday - doneToday

    return (
        <div className="flex flex-col min-h-[calc(100vh-100px)] space-y-6">
            <DoctorViewRecordModal 
                isOpen={!!activeRecordData} 
                onClose={() => setActiveRecordData(null)} 
                apt={activeRecordData?.apt} 
                records={activeRecordData?.records} 
            />
            <DoctorRescheduleModal 
                isOpen={!!activeRescheduleApt} 
                onClose={() => setActiveRescheduleApt(null)} 
                apt={activeRescheduleApt}
                onReschedule={fetchAppointments}
            />

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
                    <p className={`text-sm mt-2 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        Manage your active schedule and incoming priority patients.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <NotificationPanel />
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r from-zinc-500 to-zinc-800 dark:from-zinc-400 dark:to-white mb-6">
                        Consultation Queue
                    </h3>
                    {appointments.length === 0 ? (
                        <div className={`p-8 text-center rounded-2xl border ${isDark ? 'bg-black/20 border-white/10' : 'bg-white/80 border-zinc-200'}`}>
                            <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>No appointments scheduled.</p>
                        </div>
                    ) : appointments.map((apt) => (
                        <motion.div
                            key={apt.id}
                            className={`p-5 rounded-2xl border ring-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 group hover:-translate-y-0.5 hover:shadow-xl ${
                                apt.urgent
                                    ? isDark ? 'bg-red-500/10 border-red-500/30 ring-red-500/20 shadow-[0_4px_20px_rgba(239,68,68,0.15)] hover:border-red-500' : 'bg-red-50 border-red-200 ring-red-500/10 shadow-sm hover:border-red-400'
                                    : isDark ? 'bg-[#18181b] border-zinc-800 ring-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:border-emerald-500/50' : 'bg-white border-zinc-200 ring-black/5 shadow-sm hover:border-emerald-400'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`flex flex-col items-center justify-center w-20 h-14 px-2 rounded-xl shrink-0 ${
                                    isDark ? 'bg-zinc-900' : 'bg-zinc-100'
                                }`}>
                                    <span className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Time</span>
                                    <span className={`text-xs font-bold text-center ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                                        {new Date(apt.rawTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
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
                                    onClick={() => handleViewRecords(apt)}
                                    className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600/20 text-emerald-500 hover:bg-emerald-600/30 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                                >
                                    View Records
                                </button>
                                <button 
                                    onClick={() => setActiveRescheduleApt(apt)}
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
                    <div className={`p-6 rounded-2xl border ring-1 ring-black/5 dark:ring-white/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${
                        isDark ? 'bg-black/20 backdrop-blur-xl border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.2)]' : 'bg-white/80 backdrop-blur-xl border-zinc-200/80 shadow-[0_4px_20px_rgba(31,38,135,0.03)]'
                    }`}>
                        <div className="flex items-center gap-2 mb-6">
                            <Calendar style={{ width: 16, height: 16, minWidth: 16, minHeight: 16, flexShrink: 0 }} className="text-emerald-500" />
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r from-zinc-500 to-zinc-800 dark:from-zinc-400 dark:to-white">
                                Today's Summary
                            </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center backdrop-blur-md ${isDark ? 'bg-black/20 border-white/10 shadow-inner' : 'bg-white/40 border-white/40 shadow-sm'}`}>
                                <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{totalToday}</span>
                                <span className={`text-[10px] uppercase tracking-wider font-bold mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Total</span>
                            </div>
                            <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center backdrop-blur-md ${isDark ? 'bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-emerald-50/80 border-emerald-200/60 shadow-sm'}`}>
                                <span className="text-2xl font-bold text-emerald-500">{doneToday}</span>
                                <span className="text-[10px] uppercase tracking-wider font-bold mt-1 text-emerald-500/70">Done</span>
                            </div>
                            <div className={`col-span-2 p-4 rounded-xl border flex items-center justify-between backdrop-blur-md ${isDark ? 'bg-black/20 border-white/10 shadow-inner' : 'bg-white/40 border-white/40 shadow-sm'}`}>
                                <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Pending</span>
                                <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{pendingToday}</span>
                            </div>
                        </div>
                        <button 
                            onClick={handleDayComplete}
                            disabled={dayComplete}
                            className={`w-full mt-6 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                                dayComplete 
                                    ? 'bg-zinc-800/50 text-zinc-500 cursor-not-allowed'
                                    : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 cursor-pointer'
                            }`}
                        >
                            <CheckCircle style={{ width: 16, height: 16, minWidth: 16, minHeight: 16, flexShrink: 0 }} />
                            {dayComplete ? 'Processing...' : 'Mark Day Complete'}
                        </button>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    )
}
