import { useState, useEffect, useCallback } from 'react'
import { api } from '../../api'
import { useTheme } from '../../contexts/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, Activity, FileText, ChevronRight, Video, Plus, X, Search, CheckCircle2, UserCircle, CalendarDays, AlertTriangle, Crown, Zap, Star, Heart } from 'lucide-react'
import { CalendarAppointmentBookingDemo } from '../../components/ui/CalendarAppointmentBookingDemo'
import PricingCardTwo from '../../components/ui/pricing-card-triple'
import Footer from '../../components/Footer'

function ModalShell({ isOpen, onClose, title, children }) {
    const { isDark } = useTheme()

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

function BookAppointmentModal({ isOpen, onClose, onBooked }) {
    const { isDark } = useTheme()
    const [step, setStep] = useState(1) 
    const [selectedSpec, setSelectedSpec] = useState(null)
    const [selectedDoc, setSelectedDoc] = useState(null)
    const [isBooked, setIsBooked] = useState(false)
    const [doctors, setDoctors] = useState([])
    const [bookingError, setBookingError] = useState(null)

    useEffect(() => {
        if (isOpen) {
            api.getDoctors()
                .then(list => setDoctors(list || []))
                .catch(() => setDoctors([]))
        }
    }, [isOpen])

    if (!isOpen) return null

    const specialties = [...new Set(doctors.filter(d => d.available).map(d => d.specialization).filter(Boolean))]
    const filteredDoctors = doctors.filter(d => d.available && d.specialization === selectedSpec)

    const handleBook = async (date, selectedTime) => {
        if (!selectedDoc || !date || !selectedTime) return
        setBookingError(null)
        try {
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            const appointmentTime = `${year}-${month}-${day}T${selectedTime}:00`

            await api.bookAppointment({
                doctorId: selectedDoc.id,
                appointmentTime,
            })

            setIsBooked(true)
            setTimeout(() => {
                setIsBooked(false)
                setStep(1)
                setSelectedSpec(null)
                setSelectedDoc(null)
                setBookingError(null)
                onBooked?.()
                onClose()
            }, 2000)
        } catch (error) {
            setBookingError(error.message || 'Failed to book appointment. Please try again.')
        }
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
            {bookingError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                    {bookingError}
                </div>
            )}

            {step === 1 && (
                <div className="space-y-4">
                    <div className={`relative flex items-center px-4 py-3 rounded-xl border ${isDark ? 'bg-[#09090b] border-[#27272a]' : 'bg-zinc-50 border-zinc-200'}`}>
                        <Search style={{ width: 18, height: 18, minWidth: 18, minHeight: 18, flexShrink: 0 }} className="text-zinc-500 mr-3" />
                        <input type="text" placeholder="Search Cardiology, Dermatology..." className={`w-full bg-transparent border-none focus:outline-none text-sm ${isDark ? 'text-white placeholder-zinc-600' : 'text-zinc-900 placeholder-zinc-400'}`} />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        {(specialties.length > 0 ? specialties : ['Cardiology', 'Dermatology', 'Neurology', 'Pediatrics']).map(spec => (
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
                    <button onClick={() => setStep(1)} className={`text-xs mb-2 flex items-center gap-1 cursor-pointer transition-colors ${isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'}`}>
                        ← Back to Specialties
                    </button>
                    {filteredDoctors.length === 0 ? (
                        <p className={`text-sm text-center py-6 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>No available doctors for this specialty.</p>
                    ) : filteredDoctors.map(doc => (
                        <div key={doc.id} onClick={() => { setSelectedDoc(doc); setStep(3); }} className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                            isDark ? 'border-[#27272a] bg-[#18181b] hover:border-[#10b981]/50 text-white' : 'border-zinc-200 bg-white hover:border-emerald-300 text-zinc-900'
                        }`}>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#10b981]/20 flex items-center justify-center shrink-0">
                                    <UserCircle style={{ width: 24, height: 24, minWidth: 24, minHeight: 24, flexShrink: 0 }} className="text-[#10b981]" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm">{doc.name}</p>
                                    <p className="text-[11px] text-zinc-500">{doc.specialization} • {doc.city}</p>
                                </div>
                            </div>
                            <ChevronRight style={{ width: 18, height: 18, minWidth: 18, minHeight: 18, flexShrink: 0 }} className="text-[#10b981]" />
                        </div>
                    ))}
                </div>
            )}

            {step === 3 && (
                <div className="space-y-6">
                    <button onClick={() => setStep(2)} className={`text-xs mb-2 flex items-center gap-1 cursor-pointer transition-colors ${isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'}`}>
                        ← Back to Practitioners
                    </button>
                    <CalendarAppointmentBookingDemo onConfirm={handleBook} />
                </div>
            )}
        </ModalShell>
    )
}

function ViewRecordModal({ isOpen, onClose, apt }) {
    const { isDark } = useTheme()
    return (
        <ModalShell isOpen={isOpen} onClose={onClose} title="Medical Record Overview">
            {apt && (
                <div className="space-y-4">
                    <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#09090b] border-[#27272a]' : 'bg-zinc-50 border-zinc-200'}`}>
                        {apt.isRecord ? (
                            <>
                                <h4 className="text-sm font-bold text-white mb-1">{apt.title}</h4>
                                <p className="text-xs text-zinc-400 mb-4">{apt.specialty} • {apt.time}</p>
                                <div className="p-4 bg-[#18181b] border border-[#27272a] rounded-lg text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                                    {apt.content}
                                </div>
                            </>
                        ) : (
                            <>
                                <h4 className="text-sm font-bold text-white mb-1">Consultation with {apt.doctorName || apt.doctor}</h4>
                                <p className="text-xs text-zinc-400 mb-4">{apt.doctorSpecialty || apt.specialty} • {apt.appointmentTime ? new Date(apt.appointmentTime).toLocaleString() : apt.time}</p>
                                
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
                            </>
                        )}
                    </div>
                </div>
            )}
        </ModalShell>
    )
}

function RescheduleModal({ isOpen, onClose, apt }) {
    const { isDark } = useTheme()
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

function BillingModal({ isOpen, onClose, selectedPlan, onActivate }) {
    const { isDark } = useTheme()
    if (!isOpen) return null

    return (
        <ModalShell isOpen={isOpen} onClose={onClose} title="Complete Billing">
            <div className="space-y-4">
                <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    You have selected the <strong className="text-[#10b981]">{selectedPlan?.name}</strong> plan.
                    Please enter your billing details to activate this plan.
                </p>
                <div className="space-y-3">
                    <input type="text" placeholder="Card Number" className={`w-full p-3 rounded-xl border focus:outline-none focus:border-[#10b981] transition-colors ${isDark ? 'bg-[#09090b] border-[#27272a] text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'}`} />
                    <div className="flex gap-3">
                        <input type="text" placeholder="MM/YY" className={`w-1/2 p-3 rounded-xl border focus:outline-none focus:border-[#10b981] transition-colors ${isDark ? 'bg-[#09090b] border-[#27272a] text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'}`} />
                        <input type="text" placeholder="CVC" className={`w-1/2 p-3 rounded-xl border focus:outline-none focus:border-[#10b981] transition-colors ${isDark ? 'bg-[#09090b] border-[#27272a] text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'}`} />
                    </div>
                </div>
                <button 
                    onClick={onActivate} 
                    className="w-full py-4 mt-4 rounded-xl text-sm font-bold bg-[#10b981] hover:bg-emerald-400 text-white shadow-lg transition-all cursor-pointer"
                >
                    Pay & Activate
                </button>
            </div>
        </ModalShell>
    )
}

export default function PatientWorkspace() {
    const { isDark } = useTheme()
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
    const [activeRecordApt, setActiveRecordApt] = useState(null)
    const [activeRescheduleApt, setActiveRescheduleApt] = useState(null)
    const [billingPlan, setBillingPlan] = useState(null)
    const [activeMessage, setActiveMessage] = useState(null)

    const handleSelectPlan = (plan) => {
        setBillingPlan(plan)
    }

    const handleActivatePlan = () => {
        setActiveMessage(`Successfully upgraded to ${billingPlan.name}!`)
        setTimeout(() => setActiveMessage(null), 3000)
        setBillingPlan(null)
    }

    const [upcomingAppointments, setUpcomingAppointments] = useState([])
    const [recentRecords, setRecentRecords] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSlowLoad, setIsSlowLoad] = useState(false)

    const fetchData = useCallback(() => {
        setIsLoading(true)
        setIsSlowLoad(false)
        const timer = setTimeout(() => setIsSlowLoad(true), 5000)

        Promise.all([
            api.getMyAppointments().catch(() => []),
            api.getMyRecords().catch(() => [])
        ]).then(([apts, recs]) => {
            setUpcomingAppointments(apts || [])
            setRecentRecords(recs || [])
            setIsLoading(false)
            clearTimeout(timer)
        })

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        const cleanup = fetchData()
        return cleanup
    }, [fetchData])

    const handleRecordClick = async (record) => {
        try {
            const fullRecord = await api.getRecord(record.id)
            setActiveRecordApt({
                title: fullRecord.title,
                specialty: fullRecord.recordType,
                time: fullRecord.recordDate,
                content: fullRecord.content,
                isRecord: true
            })
        } catch (e) {
            console.error('Error fetching record', e)
        }
    }

    return (
        <div className="flex flex-col min-h-[calc(100vh-100px)] space-y-8">
            <BookAppointmentModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} onBooked={fetchData} />
            <ViewRecordModal isOpen={!!activeRecordApt} onClose={() => setActiveRecordApt(null)} apt={activeRecordApt} />
            <RescheduleModal isOpen={!!activeRescheduleApt} onClose={() => setActiveRescheduleApt(null)} apt={activeRescheduleApt} />
            <BillingModal isOpen={!!billingPlan} onClose={() => setBillingPlan(null)} selectedPlan={billingPlan} onActivate={handleActivatePlan} />
            
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
                    <p className={`text-sm mt-2 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
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

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r from-zinc-500 to-zinc-800 dark:from-zinc-400 dark:to-white">
                        Upcoming Appointments
                    </h3>
                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="space-y-4">
                                {[1, 2].map(i => (
                                    <div key={i} className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isDark ? 'bg-black/20 border-white/10' : 'bg-white/80 border-zinc-200'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`h-12 w-12 rounded-full animate-pulse ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}></div>
                                            <div className="space-y-2">
                                                <div className={`h-4 w-32 rounded animate-pulse ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}></div>
                                                <div className={`h-3 w-20 rounded animate-pulse ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isSlowLoad && <p className="text-xs text-amber-500 animate-pulse mt-2">Waking up the server, this may take a minute...</p>}
                            </div>
                        ) : upcomingAppointments.length === 0 ? (
                            <div className={`p-8 text-center rounded-2xl border ${isDark ? 'bg-black/20 border-white/10' : 'bg-white/80 border-zinc-200'}`}>
                                <Calendar style={{ width: 32, height: 32 }} className="mx-auto text-zinc-500 mb-3" />
                                <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>No Upcoming Appointments</h4>
                                <p className={`text-sm mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Book your first consultation to get started.</p>
                                <button onClick={() => setIsBookingModalOpen(true)} className="mt-4 px-4 py-2 bg-[#10b981] hover:bg-emerald-400 text-white rounded-lg text-sm font-bold transition-colors cursor-pointer">Book Now</button>
                            </div>
                        ) : upcomingAppointments.map((apt) => (
                            <motion.div
                                key={apt.id}
                                className={`p-5 rounded-2xl border ring-1 ring-black/5 dark:ring-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${
                                    isDark 
                                    ? 'bg-black/20 backdrop-blur-xl border-white/10 hover:border-[#10b981]/40 hover:bg-[#10b981]/5 shadow-[0_4px_20px_rgba(0,0,0,0.2)]' 
                                    : 'bg-white/80 backdrop-blur-xl border-zinc-200/80 hover:border-[#10b981]/40 hover:bg-[#10b981]/5 shadow-[0_4px_20px_rgba(31,38,135,0.03)]'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center shrink-0">
                                        <span className="text-[#10b981] font-bold text-sm">DR</span>
                                    </div>
                                    <div>
                                        <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{apt.doctorName || apt.doctor}</h4>
                                        <span className="bg-zinc-800/40 text-zinc-400 border border-zinc-700/30 text-[11px] px-2 py-0.5 rounded-md inline-block mt-1">
                                            {apt.doctorSpecialty || apt.specialty}
                                        </span>
                                    </div>
                                </div>
                                <div className={`flex flex-col items-start gap-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                    <div className="flex items-center gap-1.5 text-sm font-bold">
                                        <Calendar style={{ width: 14, height: 14, minWidth: 14, minHeight: 14, flexShrink: 0 }} className="text-[#10b981]" />
                                        {apt.appointmentTime ? new Date(apt.appointmentTime).toLocaleString() : apt.time}
                                    </div>
                                    <div className="flex items-center text-xs font-semibold mt-1">
                                        {apt.type === 'Video Consult' ? (
                                            <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1">
                                                <Video style={{ width: 12, height: 12, flexShrink: 0 }} />
                                                {apt.type}
                                            </span>
                                        ) : (
                                            <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1">
                                                {apt.type}
                                            </span>
                                        )}
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
                    <div className={`p-6 rounded-2xl border ring-1 ring-black/5 dark:ring-white/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${
                        isDark 
                        ? 'bg-black/20 backdrop-blur-xl border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:border-[#10b981]/30 hover:bg-[#10b981]/5' 
                        : 'bg-white/80 backdrop-blur-xl border-zinc-200/80 shadow-[0_4px_20px_rgba(31,38,135,0.03)] hover:border-[#10b981]/30 hover:bg-[#10b981]/5'
                    }`}>
                        <div className="flex items-center gap-2 mb-6">
                            <FileText style={{ width: 16, height: 16, minWidth: 16, minHeight: 16, flexShrink: 0 }} className="text-[#10b981]" />
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r from-zinc-500 to-zinc-800 dark:from-zinc-400 dark:to-white">
                                Recent Records
                            </h3>
                        </div>
                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="space-y-3">
                                    {[1, 2].map(i => (
                                        <div key={i} className="flex items-center gap-3 p-3">
                                            <div className={`h-10 w-10 rounded-lg animate-pulse ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}></div>
                                            <div className="space-y-2">
                                                <div className={`h-4 w-24 rounded animate-pulse ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}></div>
                                                <div className={`h-3 w-16 rounded animate-pulse ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : recentRecords.length === 0 ? (
                                <div className="py-6 text-center">
                                    <p className={`text-sm ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>No medical records yet.</p>
                                </div>
                            ) : recentRecords.map((record, idx) => (
                                <div key={idx} onClick={() => handleRecordClick(record)} className="flex items-center justify-between group cursor-pointer border border-transparent hover:border-[#27272a] p-3 -mx-3 rounded-xl transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${isDark ? 'bg-[#09090b] border border-[#27272a] text-[#10b981]' : 'bg-emerald-50 text-emerald-600'}`}>
                                            <Activity style={{ width: 16, height: 16, minWidth: 16, minHeight: 16, flexShrink: 0 }} />
                                        </div>
                                        <div>
                                            <p className={`text-sm font-semibold transition-colors ${
                                                isDark ? 'text-zinc-300 group-hover:text-[#10b981]' : 'text-zinc-700 group-hover:text-emerald-600'
                                            }`}>{record.title}</p>
                                            <p className={`text-[11px] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{record.recordDate || record.date}</p>
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

            <Footer />
        </div>
    )
}
