import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, FileText, ChevronLeft, ChevronRight } from 'lucide-react'

// ── Mock Schedule Data ─────────────────────────────────────────
const MOCK_SCHEDULE = [
    { id: 'sc-01', patientName: 'Alex Morgan', date: '2026-07-15', time: '09:00 AM', status: 'confirmed', symptoms: 'Mild chest discomfort', age: 34, phone: '+91 98765 43210' },
    { id: 'sc-02', patientName: 'Riya Sharma', date: '2026-07-15', time: '10:30 AM', status: 'confirmed', symptoms: 'Recurring headaches, dizziness', age: 28, phone: '+91 87654 32109' },
    { id: 'sc-03', patientName: 'John Lee', date: '2026-07-15', time: '02:00 PM', status: 'pending', symptoms: 'Follow-up consultation', age: 45, phone: '+91 76543 21098' },
    { id: 'sc-04', patientName: 'Priya Patel', date: '2026-07-16', time: '09:30 AM', status: 'confirmed', symptoms: 'Blood pressure monitoring', age: 52, phone: '+91 65432 10987' },
    { id: 'sc-05', patientName: 'Meera Kapoor', date: '2026-07-16', time: '11:00 AM', status: 'confirmed', symptoms: 'Annual cardiac checkup', age: 39, phone: '+91 54321 09876' },
    { id: 'sc-06', patientName: 'David Chen', date: '2026-07-17', time: '10:00 AM', status: 'pending', symptoms: 'Shortness of breath on exertion', age: 61, phone: '+91 43210 98765' },
    { id: 'sc-07', patientName: 'Sara Ahmed', date: '2026-07-17', time: '01:30 PM', status: 'confirmed', symptoms: 'Post-surgery follow-up', age: 47, phone: '+91 32109 87654' },
    { id: 'sc-08', patientName: 'Vikram Singh', date: '2026-07-17', time: '03:00 PM', status: 'confirmed', symptoms: 'Chest pain evaluation', age: 55, phone: '+91 21098 76543' },
    { id: 'sc-09', patientName: 'Lisa Wang', date: '2026-07-18', time: '09:00 AM', status: 'pending', symptoms: 'ECG interpretation review', age: 42, phone: '+91 10987 65432' },
    { id: 'sc-10', patientName: 'Arjun Rao', date: '2026-07-18', time: '11:30 AM', status: 'confirmed', symptoms: 'Valve disease monitoring', age: 67, phone: '+91 09876 54321' },
]

const DATES = ['2026-07-15', '2026-07-16', '2026-07-17', '2026-07-18']
const DAY_LABELS = { '2026-07-15': 'Tue 15', '2026-07-16': 'Wed 16', '2026-07-17': 'Thu 17', '2026-07-18': 'Fri 18' }

const STATUS_STYLES = {
    confirmed: { label: 'Confirmed', color: 'text-emerald-400', bg: 'bg-emerald-500/10', dot: 'bg-emerald-500' },
    pending: { label: 'Pending', color: 'text-amber-400', bg: 'bg-amber-500/10', dot: 'bg-amber-500' },
}

export default function DoctorSchedule() {
    const [viewMode, setViewMode] = useState('daily') // 'daily' | 'weekly'
    const [selectedDate, setSelectedDate] = useState(DATES[0])
    const [expandedSlot, setExpandedSlot] = useState(null)

    const filteredSlots = viewMode === 'daily'
        ? MOCK_SCHEDULE.filter(s => s.date === selectedDate)
        : MOCK_SCHEDULE

    return (
        <div className="space-y-5">
            {/* Controls */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                    <Calendar style={{ width: 16, height: 16 }} className="text-emerald-400" />
                    <h2 className="text-base font-semibold text-white">My Schedule</h2>
                    <span className="text-[10px] text-zinc-600 px-2 py-0.5 rounded-full bg-zinc-800/60">
                        Private
                    </span>
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-1 p-0.5 bg-zinc-900/60 rounded-lg border border-zinc-800/40">
                    {['daily', 'weekly'].map(mode => (
                        <button
                            key={mode}
                            onClick={() => setViewMode(mode)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer capitalize ${
                                viewMode === mode
                                    ? 'bg-zinc-800 text-white'
                                    : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                        >
                            {mode}
                        </button>
                    ))}
                </div>
            </div>

            {/* Date Selector (daily mode) */}
            {viewMode === 'daily' && (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            const idx = DATES.indexOf(selectedDate)
                            if (idx > 0) setSelectedDate(DATES[idx - 1])
                        }}
                        className="p-1.5 rounded-lg bg-zinc-900/60 border border-zinc-800/50 text-zinc-500
                                   hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
                    >
                        <ChevronLeft style={{ width: 14, height: 14 }} />
                    </button>

                    <div className="flex gap-1.5 flex-1 justify-center">
                        {DATES.map(date => (
                            <button
                                key={date}
                                onClick={() => setSelectedDate(date)}
                                className={`relative px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                                    selectedDate === date
                                        ? 'text-white'
                                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30'
                                }`}
                            >
                                {selectedDate === date && (
                                    <motion.div
                                        layoutId="date-pill"
                                        className="absolute inset-0 bg-emerald-600/20 border border-emerald-500/30 rounded-xl -z-10"
                                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                    />
                                )}
                                {DAY_LABELS[date]}
                                <span className="block text-[9px] text-zinc-600 mt-0.5">
                                    {MOCK_SCHEDULE.filter(s => s.date === date).length} slots
                                </span>
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => {
                            const idx = DATES.indexOf(selectedDate)
                            if (idx < DATES.length - 1) setSelectedDate(DATES[idx + 1])
                        }}
                        className="p-1.5 rounded-lg bg-zinc-900/60 border border-zinc-800/50 text-zinc-500
                                   hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
                    >
                        <ChevronRight style={{ width: 14, height: 14 }} />
                    </button>
                </div>
            )}

            {/* Schedule List */}
            <div className="space-y-2">
                {filteredSlots.length === 0 ? (
                    <div className="py-12 text-center text-zinc-600 text-sm">
                        No appointments scheduled for this date.
                    </div>
                ) : (
                    filteredSlots.map((slot, idx) => {
                        const style = STATUS_STYLES[slot.status]
                        const isExpanded = expandedSlot === slot.id
                        return (
                            <motion.div
                                key={slot.id}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.04 }}
                                className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl overflow-hidden
                                           hover:border-zinc-700/60 transition-colors"
                            >
                                <div
                                    onClick={() => setExpandedSlot(isExpanded ? null : slot.id)}
                                    className="flex items-center gap-3.5 p-4 cursor-pointer"
                                >
                                    {/* Time Block */}
                                    <div className="text-center shrink-0 w-16">
                                        <p className="text-sm font-bold text-white">{slot.time}</p>
                                        {viewMode === 'weekly' && (
                                            <p className="text-[9px] text-zinc-600">{DAY_LABELS[slot.date]}</p>
                                        )}
                                    </div>

                                    {/* Divider */}
                                    <div className="w-px h-10 bg-zinc-800/60 shrink-0" />

                                    {/* Patient Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold text-white truncate">{slot.patientName}</p>
                                            <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${style.bg} ${style.color}`}>
                                                <span className={`h-1 w-1 rounded-full ${style.dot}`} />
                                                {style.label}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-zinc-500 mt-0.5 truncate">{slot.symptoms}</p>
                                    </div>
                                </div>

                                {/* Expanded Patient Details */}
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                        className="border-t border-zinc-800/40 px-4 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3"
                                    >
                                        <div>
                                            <p className="text-[10px] text-zinc-600 uppercase tracking-wide">Age</p>
                                            <p className="text-sm text-white font-medium mt-0.5">{slot.age} yrs</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-zinc-600 uppercase tracking-wide">Phone</p>
                                            <p className="text-sm text-white font-medium mt-0.5">{slot.phone}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-[10px] text-zinc-600 uppercase tracking-wide">Symptoms</p>
                                            <p className="text-sm text-white font-medium mt-0.5">{slot.symptoms}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
