import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, Activity, FileText, ChevronRight, Video, Plus, X, Search, CheckCircle2, UserCircle, CalendarDays, AlertTriangle } from 'lucide-react'

function ModalShell({ isOpen, onClose, title, children }) {
    const isDark = true

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
                    <div className="p-6 overflow-y-auto custom-scrollbar flex-1 max-h-[60vh]">
                        {children}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

function BookAppointmentModal({ isOpen, onClose }) {
    const [step, setStep] = useState(1) 
    const [selectedSpec, setSelectedSpec] = useState(null)
    const [selectedDoc, setSelectedDoc] = useState(null)
    const [selectedDate, setSelectedDate] = useState(null)
    const [selectedTime, setSelectedTime] = useState(null)
    const [isBooked, setIsBooked] = useState(false)

    const isDark = true 

    if (!isOpen) return null

    const handleBook = () => {
        setIsBooked(true)
        setTimeout(() => {
            setIsBooked(false)
            setStep(1)
            setSelectedSpec(null)
            setSelectedDoc(null)
            setSelectedDate(null)
            setSelectedTime(null)
            onClose()
        }, 2000)
    }

    if (isBooked) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-12 flex flex-col items-center justify-center text-center ${isDark ? 'bg-[#18181b] border border-[#27272a]' : 'bg-white border border-zinc-200'}`}>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-[#10b981]/10 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 style={{ width: 40, height: 40, minWidth: 40, minHeight: 40, flexShrink: 0 }} className="text-[#10b981]" />
                    </motion.div>
                    <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>Appointment Confirmed</h2>
                    <p className={isDark ? 'text-zinc-400' : 'text-zinc-500'}>Your encrypted consultation link is secured.</p>
                </motion.div>
            </div>
        )
    }

    return (
        <ModalShell isOpen={isOpen} onClose={onClose} title={step === 1 ? 'Select Specialty' : step === 2 ? 'Select Practitioner' : 'Schedule Timing'}>
            {step === 1 && (
                <div className="space-y-4">
                    <div className={`relative flex items-center px-4 py-3 rounded-xl border ${isDark ? 'bg-[#09090b] border-[#27272a]' : 'bg-zinc-50 border-zinc-200'}`}>
                        <Search style={{ width: 18, height: 18, minWidth: 18, minHeight: 18, flexShrink: 0 }} className="text-zinc-500 mr-3" />
                        <input type="text" placeholder="Search Cardiology, Dermatology..." className={`w-full bg-transparent border-none focus:outline-none text-sm ${isDark ? 'text-white placeholder-zinc-600' : 'text-zinc-900 placeholder-zinc-400'}`} />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        {['Cardiology', 'Dermatology', 'Neurology', 'Pediatrics'].map(spec => (
                            <button key={spec} onClick={() => { setSelectedSpec(spec); setStep(2); }} className={`p-4 rounded-xl border text-left cursor-pointer transition-colors ${
                                isDark ? 'border-[#27272a] bg-[#18181b] hover:border-[#10b981]/50 hover:bg-[#10b981]/10 text-zinc-300' : 'border-zinc-200 bg-white hover:border-emerald-300 hover:bg-emerald-50 text-zinc-700'
                            }`}>
                                <span className="font-bold text-sm block">{spec}</span>
                                <span className="text-[10px] uppercase tracking-widest text-[#10b981] mt-2 block">Available Now</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-3">
                    <button onClick={() => setStep(1)} className="text-xs text-zinc-500 hover:text-white mb-2 flex items-center gap-1 cursor-pointer transition-colors">
                        ← Back to Specialties
                    </button>
                    {['Dr. Sarah Jenkins', 'Dr. Emily Chen', 'Dr. Marcus Hale'].map(doc => (
                        <div key={doc} onClick={() => { setSelectedDoc(doc); setStep(3); }} className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                            isDark ? 'border-[#27272a] bg-[#18181b] hover:border-[#10b981]/50 text-white' : 'border-zinc-200 bg-white hover:border-emerald-300 text-zinc-900'
                        }`}>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#10b981]/20 flex items-center justify-center shrink-0">
                                    <UserCircle style={{ width: 24, height: 24, minWidth: 24, minHeight: 24, flexShrink: 0 }} className="text-[#10b981]" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm">{doc}</p>
                                    <p className="text-[11px] text-zinc-500">{selectedSpec} Specialist</p>
                                </div>
                            </div>
                            <ChevronRight style={{ width: 18, height: 18, minWidth: 18, minHeight: 18, flexShrink: 0 }} className="text-[#10b981]" />
                        </div>
                    ))}
                </div>
            )}

            {step === 3 && (
                <div className="space-y-6">
                    <button onClick={() => setStep(2)} className="text-xs text-zinc-500 hover:text-white mb-2 flex items-center gap-1 cursor-pointer transition-colors">
                        ← Back to Practitioners
                    </button>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className={`text-sm font-bold mb-3 ${isDark ? 'text-white' : 'text-zinc-900'}`}>Date Schedule Matrix</p>
                            <div className="space-y-2">
                                {['Today', 'Tomorrow', 'Oct 18', 'Oct 19'].map(d => (
                                    <button key={d} onClick={() => setSelectedDate(d)} className={`w-full py-2.5 px-3 rounded-lg border text-sm font-bold cursor-pointer transition-colors flex items-center justify-between ${
                                        selectedDate === d
                                            ? (isDark ? 'border-[#10b981] bg-[#10b981]/10 text-[#10b981]' : 'border-emerald-500 bg-emerald-50 text-emerald-700')
                                            : (isDark ? 'border-[#27272a] bg-[#09090b] hover:border-zinc-600 text-zinc-400' : 'border-zinc-200 bg-white hover:border-zinc-300 text-zinc-600')
                                    }`}>
                                        <span>{d}</span>
                                        <CalendarDays style={{ width: 14, height: 14, minWidth: 14, minHeight: 14, flexShrink: 0 }} />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className={`text-sm font-bold mb-3 ${isDark ? 'text-white' : 'text-zinc-900'}`}>Open Timing Blocks</p>
                            <div className="grid grid-cols-1 gap-2">
                                {['09:00 AM', '10:30 AM', '02:00 PM', '04:15 PM'].map(t => (
                                    <button key={t} onClick={() => setSelectedTime(t)} disabled={!selectedDate} className={`w-full py-2.5 px-3 rounded-lg border text-sm font-bold transition-colors flex items-center justify-between ${
                                        !selectedDate ? 'opacity-50 cursor-not-allowed border-[#27272a] bg-[#09090b] text-zinc-600' :
                                        selectedTime === t
                                            ? (isDark ? 'border-[#10b981] bg-[#10b981]/10 text-[#10b981]' : 'border-emerald-500 bg-emerald-50 text-emerald-700')
                                            : (isDark ? 'border-[#27272a] bg-[#09090b] hover:border-[#10b981]/50 text-zinc-300 cursor-pointer' : 'border-zinc-200 bg-white hover:border-emerald-300 text-zinc-700 cursor-pointer')
                                    }`}>
                                        <span>{t}</span>
                                        <Clock style={{ width: 14, height: 14, minWidth: 14, minHeight: 14, flexShrink: 0 }} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={handleBook} 
                        disabled={!selectedDate || !selectedTime}
                        className={`w-full py-4 mt-4 rounded-xl text-sm font-bold transition-all shadow-lg ${
                            selectedDate && selectedTime ? 'bg-[#10b981] hover:bg-emerald-400 text-white cursor-pointer' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        }`}
                    >
                        Confirm Appointment
                    </button>
                </div>
            )}
        </ModalShell>
    )
}

function ViewRecordModal({ isOpen, onClose, apt }) {
    const isDark = true
    return (
        <ModalShell isOpen={isOpen} onClose={onClose} title="Medical Record Overview">
            {apt && (
                <div className="space-y-4">
                    <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#09090b] border-[#27272a]' : 'bg-zinc-50 border-zinc-200'}`}>
                        <h4 className="text-sm font-bold text-white mb-1">Consultation with {apt.doctor}</h4>
                        <p className="text-xs text-zinc-400 mb-4">{apt.specialty} • {apt.time}</p>
                        
                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 bg-[#18181b] border border-[#27272a] rounded-lg">
                                <span className="text-xs text-zinc-300 flex items-center gap-2"><FileText style={{width:14, height:14, flexShrink:0}} className="text-[#10b981]" /> Clinical Notes</span>
                                <button className="text-[10px] bg-[#10b981]/10 text-[#10b981] px-2 py-1 rounded font-bold cursor-pointer hover:bg-[#10b981]/20 transition-colors">Download</button>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-[#18181b] border border-[#27272a] rounded-lg">
                                <span className="text-xs text-zinc-300 flex items-center gap-2"><Activity style={{width:14, height:14, flexShrink:0}} className="text-[#10b981]" /> Vitals Log</span>
                                <button className="text-[10px] bg-[#10b981]/10 text-[#10b981] px-2 py-1 rounded font-bold cursor-pointer hover:bg-[#10b981]/20 transition-colors">View</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ModalShell>
    )
}

function RescheduleModal({ isOpen, onClose, apt }) {
    const isDark = true
    const [rescheduled, setRescheduled] = useState(false)

    const handleReschedule = () => {
        setRescheduled(true)
        setTimeout(() => {
            setRescheduled(false)
            onClose()
        }, 1500)
    }

    return (
        <ModalShell isOpen={isOpen} onClose={onClose} title="Reschedule Appointment">
            {apt && (
                <div className="space-y-6">
                    {rescheduled ? (
                         <div className="py-8 flex flex-col items-center justify-center text-center">
                            <CheckCircle2 style={{ width: 48, height: 48, flexShrink: 0 }} className="text-[#10b981] mb-4" />
                            <h2 className="text-xl font-bold text-white mb-2">Rescheduled Successfully</h2>
                        </div>
                    ) : (
                        <>
                            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
                                <AlertTriangle style={{ width: 18, height: 18, flexShrink: 0 }} className="text-amber-500 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-amber-500">Current Slot: {apt.time}</p>
                                    <p className="text-xs text-amber-500/70 mt-1">Select a new timing block to shift your queue position.</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {['Tomorrow, 09:00 AM', 'Tomorrow, 02:00 PM', 'Oct 18, 10:30 AM', 'Oct 19, 04:15 PM'].map(t => (
                                    <button key={t} onClick={handleReschedule} className="p-3 rounded-xl border border-[#27272a] bg-[#09090b] hover:border-[#10b981] hover:bg-[#10b981]/10 text-zinc-300 text-xs font-bold transition-all cursor-pointer">
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}
        </ModalShell>
    )
}

export default function PatientWorkspace() {
    const isDark = true // global state applied to body
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
    const [activeRecordApt, setActiveRecordApt] = useState(null)
    const [activeRescheduleApt, setActiveRescheduleApt] = useState(null)
    const [activeMessage, setActiveMessage] = useState(null)

    const upcomingAppointments = [
        { id: 1, doctor: 'Dr. Sarah Jenkins', specialty: 'Cardiology', time: 'Today, 2:30 PM', type: 'Video Consult' },
        { id: 2, doctor: 'Dr. Emily Chen', specialty: 'Dermatology', time: 'Tomorrow, 10:00 AM', type: 'In-Person' },
    ]

    return (
        <div className="space-y-8">
            <BookAppointmentModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} />
            <ViewRecordModal isOpen={!!activeRecordApt} onClose={() => setActiveRecordApt(null)} apt={activeRecordApt} />
            <RescheduleModal isOpen={!!activeRescheduleApt} onClose={() => setActiveRescheduleApt(null)} apt={activeRescheduleApt} />
            
            <AnimatePresence>
                {activeMessage && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                                className="fixed top-20 right-8 z-50 bg-[#10b981] text-white px-6 py-3 rounded-xl shadow-2xl font-bold text-sm flex items-center gap-3">
                        <CheckCircle2 style={{ width: 18, height: 18, minWidth: 18, minHeight: 18, flexShrink: 0 }} />
                        {activeMessage}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                        My Health Overview
                    </h2>
                    <p className={`text-sm mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        Manage your upcoming appointments and access your medical records.
                    </p>
                </div>
                <button 
                    onClick={() => setIsBookingModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-[#10b981] hover:bg-emerald-400 text-white text-sm font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-colors cursor-pointer"
                >
                    <Plus style={{ width: 18, height: 18, minWidth: 18, minHeight: 18, flexShrink: 0 }} />
                    Book New Appointment
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <h3 className={`font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>Upcoming Appointments</h3>
                    <div className="space-y-4">
                        {upcomingAppointments.map((apt) => (
                            <motion.div
                                key={apt.id}
                                className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                                    isDark ? 'bg-[#18181b] border-[#27272a]' : 'bg-white border-zinc-200 shadow-sm'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center shrink-0">
                                        <span className="text-[#10b981] font-bold text-sm">DR</span>
                                    </div>
                                    <div>
                                        <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{apt.doctor}</h4>
                                        <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{apt.specialty}</p>
                                    </div>
                                </div>
                                <div className={`flex flex-col gap-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                    <div className="flex items-center gap-1.5 text-sm font-bold">
                                        <Calendar style={{ width: 14, height: 14, minWidth: 14, minHeight: 14, flexShrink: 0 }} className="text-[#10b981]" />
                                        {apt.time}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                                        <Video style={{ width: 14, height: 14, minWidth: 14, minHeight: 14, flexShrink: 0 }} className={isDark ? 'text-zinc-500' : 'text-zinc-400'} />
                                        {apt.type}
                                    </div>
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                    <button 
                                        onClick={() => setActiveRecordApt(apt)}
                                        className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                                        isDark ? 'bg-[#09090b] border border-[#27272a] hover:bg-[#27272a] text-white' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900'
                                    }`}>
                                        View Records
                                    </button>
                                    <button 
                                        onClick={() => setActiveRescheduleApt(apt)}
                                        className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                                        isDark ? 'bg-[#09090b] border border-[#27272a] hover:bg-[#27272a] text-white' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900'
                                    }`}>
                                        Reschedule
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className={`p-6 rounded-2xl border ${
                        isDark ? 'bg-[#18181b] border-[#27272a]' : 'bg-white border-zinc-200 shadow-sm'
                    }`}>
                        <div className="flex items-center gap-2 mb-6">
                            <FileText style={{ width: 18, height: 18, minWidth: 18, minHeight: 18, flexShrink: 0 }} className="text-[#10b981]" />
                            <h3 className={`font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>Recent Records</h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { title: 'Blood Test Results', date: 'Oct 12, 2025' },
                                { title: 'Prescription Renewal', date: 'Sep 28, 2025' },
                            ].map((record, idx) => (
                                <div key={idx} className="flex items-center justify-between group cursor-pointer border border-transparent hover:border-[#27272a] p-3 -mx-3 rounded-xl transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${isDark ? 'bg-[#09090b] border border-[#27272a] text-[#10b981]' : 'bg-emerald-50 text-emerald-600'}`}>
                                            <Activity style={{ width: 16, height: 16, minWidth: 16, minHeight: 16, flexShrink: 0 }} />
                                        </div>
                                        <div>
                                            <p className={`text-sm font-semibold transition-colors ${
                                                isDark ? 'text-zinc-300 group-hover:text-[#10b981]' : 'text-zinc-700 group-hover:text-emerald-600'
                                            }`}>{record.title}</p>
                                            <p className={`text-[11px] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{record.date}</p>
                                        </div>
                                    </div>
                                    <ChevronRight style={{ width: 16, height: 16, minWidth: 16, minHeight: 16, flexShrink: 0 }} className={`transition-transform group-hover:translate-x-1 ${
                                        isDark ? 'text-zinc-600 group-hover:text-[#10b981]' : 'text-zinc-400'
                                    }`} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
