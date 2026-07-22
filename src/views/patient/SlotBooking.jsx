import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft, Calendar, Clock, Check, Crown,
    Zap, UserCheck, HeartPulse, ChevronRight, CreditCard, Banknote
} from 'lucide-react'
import { useNotifications } from '../../contexts/NotificationContext'
import { api } from '../../api'

// ── Mock Available Slots ───────────────────────────────────────
const generateSlots = () => [
    { id: 's-01', date: '2026-07-15', day: 'Tue', time: '09:00 AM', available: true },
    { id: 's-02', date: '2026-07-15', day: 'Tue', time: '10:30 AM', available: true },
    { id: 's-03', date: '2026-07-15', day: 'Tue', time: '02:00 PM', available: false },
    { id: 's-04', date: '2026-07-16', day: 'Wed', time: '09:30 AM', available: true },
    { id: 's-05', date: '2026-07-16', day: 'Wed', time: '11:00 AM', available: true },
    { id: 's-06', date: '2026-07-17', day: 'Thu', time: '10:00 AM', available: true },
    { id: 's-07', date: '2026-07-17', day: 'Thu', time: '03:00 PM', available: true },
    { id: 's-08', date: '2026-07-18', day: 'Fri', time: '09:00 AM', available: true },
]

// ── Premium Tier Definitions ───────────────────────────────────
const PREMIUM_TIERS = [
    {
        key: 'free',
        label: 'Standard',
        icon: Clock,
        color: 'text-zinc-400',
        borderColor: 'border-zinc-800',
        bg: 'bg-zinc-900/40',
        queuePosition: 12,
        desc: 'Regular queue position. Wait time varies.',
        price: 'Free',
        priceValue: 0,
    },
    {
        key: 'priority',
        label: 'Early Assist Priority',
        icon: Zap,
        color: 'text-blue-400',
        borderColor: 'border-blue-500/30',
        bg: 'bg-blue-500/[0.05]',
        queuePosition: 4,
        desc: 'Jump ahead in the queue with priority scheduling.',
        price: '₹499',
        priceValue: 499,
    },
    {
        key: 'personal',
        label: 'Personal Assistance',
        icon: UserCheck,
        color: 'text-purple-400',
        borderColor: 'border-purple-500/30',
        bg: 'bg-purple-500/[0.05]',
        queuePosition: 2,
        desc: 'Dedicated coordinator + priority slots on demand.',
        price: '₹999',
        priceValue: 999,
    },
    {
        key: 'wellness',
        label: 'Wellness+ Priority',
        icon: HeartPulse,
        color: 'text-emerald-400',
        borderColor: 'border-emerald-500/30',
        bg: 'bg-emerald-500/[0.05]',
        queuePosition: 1,
        desc: 'Weekly/monthly checkups, health sessions & personal training.',
        price: '₹1,999',
        priceValue: 1999,
    },
]

export default function SlotBooking({ doctor, onBack }) {
    const [step, setStep] = useState(1) // 1: Slot, 2: Billing, 3: Confirmation
    const [selectedSlot, setSelectedSlot] = useState(null)
    const [selectedTier, setSelectedTier] = useState('free')
    const [symptoms, setSymptoms] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('upi')
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState(null)

    const { pushNotification } = useNotifications()

    const slots = generateSlots()
    const currentTier = PREMIUM_TIERS.find(t => t.key === selectedTier)

    const handleProceedToBilling = () => {
        if (!selectedSlot) return
        setStep(2)
    }

    const handleConfirmBooking = async () => {
        setIsProcessing(true)
        setError(null)
        try {
            const slot = slots.find(s => s.id === selectedSlot)
            
            // 1. Create Appointment
            const appointmentTime = `${slot.date}T${slot.time.split(' ')[0]}:00` // simplified parsing for demo
            
            const aptRes = await api.bookAppointment({
                doctorId: doctor.id,
                appointmentTime,
                symptoms,
            })
            
            // 2. Process Billing
            const codFee = paymentMethod === 'cod' ? 50 : 0
            const amount = currentTier.priceValue + codFee
            const description = `Tier: ${currentTier.label}, Payment: ${paymentMethod.toUpperCase()}${codFee > 0 ? `, COD Fee: ₹${codFee}` : ''}`
            
            await api.createInvoice(aptRes.id, amount, description)

            // 3. Success
            pushNotification({
                type: 'appointment_confirmed',
                title: 'Appointment Booked!',
                message: `Your appointment with ${doctor.name} is confirmed for ${slot.date} at ${slot.time}.`,
            })
            
            setStep(3)
        } catch (e) {
            setError(e.message || 'Failed to complete booking')
        } finally {
            setIsProcessing(false)
        }
    }

    if (step === 3) {
        const slot = slots.find(s => s.id === selectedSlot)
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                    className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/30
                               flex items-center justify-center mb-6"
                >
                    <Check className="h-8 w-8 text-emerald-400" />
                </motion.div>
                <h2 className="text-xl font-bold text-white mb-2">Appointment Confirmed</h2>
                <p className="text-sm text-zinc-500 max-w-sm mb-1">
                    {doctor.name} · {slot?.date} at {slot?.time}
                </p>
                <p className="text-xs text-zinc-600 mb-6">
                    Queue Position: #{currentTier.queuePosition} ({currentTier.label})
                </p>
                <button
                    onClick={onBack}
                    className="px-6 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm
                               text-zinc-300 hover:text-white hover:border-zinc-700
                               transition-colors cursor-pointer"
                >
                    Back to Doctors
                </button>
            </motion.div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Back Button + Doctor Info */}
            <div className="flex items-center gap-4">
                <button
                    onClick={step === 2 ? () => setStep(1) : onBack}
                    className="p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/50
                               text-zinc-400 hover:text-white hover:border-zinc-700
                               transition-colors cursor-pointer"
                >
                    <ArrowLeft style={{ width: 16, height: 16 }} />
                </button>
                <div>
                    <h2 className="text-lg font-bold text-white">{step === 2 ? 'Complete Payment' : doctor.name}</h2>
                    <p className="text-xs text-zinc-500">{doctor.specialization} · {doctor.city} · {doctor.fee}</p>
                </div>
            </div>

            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                    {error}
                </div>
            )}

            {step === 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Slot Selection */}
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-sm font-semibold text-zinc-300">Available Slots</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            {slots.map(slot => (
                                <motion.button
                                    key={slot.id}
                                    whileTap={slot.available ? { scale: 0.95 } : {}}
                                    disabled={!slot.available}
                                    onClick={() => setSelectedSlot(slot.id)}
                                    className={`relative p-3 rounded-xl border text-left transition-all ${
                                        !slot.available
                                            ? 'border-zinc-800/30 bg-zinc-900/20 opacity-40 cursor-not-allowed'
                                            : selectedSlot === slot.id
                                                ? 'border-emerald-500/50 bg-emerald-500/[0.07] cursor-pointer'
                                                : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 cursor-pointer'
                                    }`}
                                >
                                    <p className="text-[10px] text-zinc-500 font-medium">{slot.day}, {slot.date.slice(5)}</p>
                                    <p className={`text-sm font-semibold mt-0.5 ${
                                        selectedSlot === slot.id ? 'text-emerald-400' : 'text-white'
                                    }`}>
                                        {slot.time}
                                    </p>
                                    {!slot.available && (
                                        <span className="text-[9px] text-red-400/60 font-medium mt-1 block">Taken</span>
                                    )}
                                    {selectedSlot === slot.id && (
                                        <motion.div
                                            layoutId="slot-check"
                                            className="absolute top-2 right-2 h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center"
                                        >
                                            <Check style={{ width: 10, height: 10 }} className="text-white" />
                                        </motion.div>
                                    )}
                                </motion.button>
                            ))}
                        </div>

                        {/* Symptoms */}
                        <div className="mt-4">
                            <label className="text-xs text-zinc-500 font-medium block mb-1.5">
                                Describe your symptoms (optional)
                            </label>
                            <textarea
                                value={symptoms}
                                onChange={(e) => setSymptoms(e.target.value)}
                                placeholder="Brief description of your condition..."
                                rows={3}
                                className="w-full px-3.5 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl
                                           text-sm text-white placeholder-zinc-600
                                           focus:outline-none focus:border-emerald-500/50
                                           transition-colors resize-none"
                            />
                        </div>
                    </div>

                    {/* Right: Premium Tier Selector */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Crown style={{ width: 14, height: 14 }} className="text-amber-400" />
                            <h3 className="text-sm font-semibold text-zinc-300">Plan Tier</h3>
                        </div>

                        <div className="space-y-2">
                            {PREMIUM_TIERS.map(tier => {
                                const Icon = tier.icon
                                const isActive = selectedTier === tier.key
                                return (
                                    <motion.button
                                        key={tier.key}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedTier(tier.key)}
                                        className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                            isActive ? `${tier.borderColor} ${tier.bg}` : 'border-zinc-800/50 bg-zinc-900/30 hover:border-zinc-700'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <Icon style={{ width: 14, height: 14 }} className={isActive ? tier.color : 'text-zinc-600'} />
                                            <span className={`text-[13px] font-semibold flex-1 ${
                                                isActive ? tier.color : 'text-zinc-400'
                                            }`}>
                                                {tier.label}
                                            </span>
                                            <span className={`text-[11px] font-medium ${
                                                isActive ? tier.color : 'text-zinc-600'
                                            }`}>
                                                {tier.price}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-zinc-500 mt-1.5 leading-relaxed pl-6">{tier.desc}</p>

                                        {/* Queue Position Indicator */}
                                        <div className="mt-2 pl-6 flex items-center gap-2">
                                            <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.max(8, 100 - tier.queuePosition * 8)}%` }}
                                                    transition={{ duration: 0.5 }}
                                                    className={`h-full rounded-full ${
                                                        tier.key === 'free' ? 'bg-zinc-600'
                                                            : tier.key === 'priority' ? 'bg-blue-500'
                                                                : tier.key === 'personal' ? 'bg-purple-500'
                                                                    : 'bg-emerald-500'
                                                    }`}
                                                />
                                            </div>
                                            <span className="text-[9px] text-zinc-600 font-mono">#{tier.queuePosition}</span>
                                        </div>
                                    </motion.button>
                                )
                            })}
                        </div>

                        {/* Book Button */}
                        <button
                            onClick={handleProceedToBilling}
                            disabled={!selectedSlot}
                            className={`w-full py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer mt-2 ${
                                selectedSlot
                                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/30 active:scale-[0.98]'
                                    : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                            }`}
                        >
                            {selectedSlot ? 'Proceed to Billing' : 'Select a Slot'}
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-sm font-semibold text-zinc-300">Payment Method</h3>
                        <div className="space-y-3">
                            {[
                                { id: 'upi', label: 'UPI / QR Code', icon: Zap },
                                { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
                                { id: 'cod', label: 'Cash on Delivery', icon: Banknote }
                            ].map(method => {
                                const Icon = method.icon;
                                const isSelected = paymentMethod === method.id;
                                return (
                                    <button
                                        key={method.id}
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`w-full p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                            isSelected ? 'border-emerald-500/50 bg-emerald-500/[0.05]' : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className={`w-5 h-5 ${isSelected ? 'text-emerald-400' : 'text-zinc-500'}`} />
                                            <span className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-zinc-300'}`}>{method.label}</span>
                                        </div>
                                        {isSelected && <Check className="w-4 h-4 text-emerald-500" />}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-zinc-300">Order Summary</h3>
                        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Plan Tier ({currentTier.label})</span>
                                <span className="text-white">₹{currentTier.priceValue}</span>
                            </div>
                            {paymentMethod === 'cod' && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-amber-400/80">COD Handling Fee</span>
                                    <span className="text-amber-400">₹50</span>
                                </div>
                            )}
                            <div className="pt-3 mt-3 border-t border-zinc-800 flex justify-between font-bold">
                                <span className="text-white">Total</span>
                                <span className="text-emerald-400">₹{currentTier.priceValue + (paymentMethod === 'cod' ? 50 : 0)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleConfirmBooking}
                            disabled={isProcessing}
                            className={`w-full py-3 rounded-xl text-sm font-semibold transition-all flex justify-center items-center ${
                                isProcessing 
                                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg cursor-pointer'
                            }`}
                        >
                            {isProcessing ? 'Processing...' : `Pay ₹${currentTier.priceValue + (paymentMethod === 'cod' ? 50 : 0)} & Confirm`}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
