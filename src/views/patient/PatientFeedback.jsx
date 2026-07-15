import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Check, Star as StarIcon } from 'lucide-react'
import StarRating from '../../components/StarRating'

// ── Mock Completed Appointments (eligible for feedback) ────────
const MOCK_COMPLETED = [
    { id: 'f-001', doctorId: 'd-001', doctorName: 'Dr. Sarah Chen', specialization: 'Cardiologist', date: '2026-07-10', hasReview: false },
    { id: 'f-002', doctorId: 'd-003', doctorName: 'Dr. Priya Nair', specialization: 'Neurologist', date: '2026-07-08', hasReview: true, rating: 5, review: 'Exceptional care and thorough diagnosis. Highly recommended!' },
    { id: 'f-003', doctorId: 'd-006', doctorName: 'Dr. Raj Malhotra', specialization: 'General Physician', date: '2026-07-05', hasReview: true, rating: 4, review: 'Great doctor, very patient and explained everything clearly.' },
    { id: 'f-004', doctorId: 'd-005', doctorName: 'Dr. Elena Rodriguez', specialization: 'Psychiatrist', date: '2026-07-02', hasReview: false },
    { id: 'f-005', doctorId: 'd-007', doctorName: 'Dr. Fatima Khan', specialization: 'Pediatrician', date: '2026-06-28', hasReview: false },
    { id: 'f-006', doctorId: 'd-010', doctorName: 'Dr. David Kim', specialization: 'Ophthalmologist', date: '2026-06-25', hasReview: true, rating: 4, review: 'Professional and knowledgeable. Short wait time.' },
]

export default function PatientFeedback() {
    const [appointments, setAppointments] = useState(MOCK_COMPLETED)
    const [activeFeedbackId, setActiveFeedbackId] = useState(null)
    const [feedbackRating, setFeedbackRating] = useState(0)
    const [feedbackText, setFeedbackText] = useState('')
    const [submitted, setSubmitted] = useState(null)

    const handleSubmit = (id) => {
        if (feedbackRating === 0) return

        setAppointments(prev => prev.map(a =>
            a.id === id ? { ...a, hasReview: true, rating: feedbackRating, review: feedbackText } : a
        ))
        setSubmitted(id)
        setTimeout(() => {
            setSubmitted(null)
            setActiveFeedbackId(null)
            setFeedbackRating(0)
            setFeedbackText('')
        }, 2000)
    }

    const pendingReviews = appointments.filter(a => !a.hasReview)
    const completedReviews = appointments.filter(a => a.hasReview)

    return (
        <div className="space-y-8">
            {/* Pending Reviews */}
            <div>
                <h3 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
                    <MessageSquare style={{ width: 14, height: 14 }} className="text-amber-400" />
                    Pending Reviews ({pendingReviews.length})
                </h3>

                {pendingReviews.length === 0 ? (
                    <div className="py-8 text-center text-zinc-600 text-sm bg-zinc-900/20 rounded-2xl border border-zinc-800/30">
                        All caught up! No pending reviews.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {pendingReviews.map(apt => (
                            <motion.div
                                key={apt.id}
                                layout
                                className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl overflow-hidden"
                            >
                                <div
                                    onClick={() => {
                                        setActiveFeedbackId(activeFeedbackId === apt.id ? null : apt.id)
                                        setFeedbackRating(0)
                                        setFeedbackText('')
                                    }}
                                    className="flex items-center gap-3.5 p-4 cursor-pointer hover:bg-zinc-800/20 transition-colors"
                                >
                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800
                                                    flex items-center justify-center text-sm font-bold text-white shrink-0">
                                        {apt.doctorName.split(' ').slice(1).map(w => w[0]).join('')}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-white truncate">{apt.doctorName}</p>
                                        <p className="text-[11px] text-zinc-500">{apt.specialization} · Visit: {apt.date}</p>
                                    </div>
                                    <span className="text-xs text-amber-400 font-medium px-2.5 py-1 rounded-full bg-amber-500/10">
                                        Rate
                                    </span>
                                </div>

                                {/* Expandable Feedback Form */}
                                <AnimatePresence>
                                    {activeFeedbackId === apt.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="overflow-hidden"
                                        >
                                            {submitted === apt.id ? (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="flex flex-col items-center py-6 border-t border-zinc-800/40"
                                                >
                                                    <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-2">
                                                        <Check className="h-5 w-5 text-emerald-400" />
                                                    </div>
                                                    <p className="text-sm font-semibold text-emerald-400">Thank you for your feedback!</p>
                                                </motion.div>
                                            ) : (
                                                <div className="px-4 pb-4 pt-2 border-t border-zinc-800/40 space-y-3">
                                                    <div>
                                                        <label className="text-[11px] text-zinc-500 font-medium block mb-1.5">
                                                            Your Rating
                                                        </label>
                                                        <StarRating
                                                            rating={feedbackRating}
                                                            onRate={setFeedbackRating}
                                                            size="lg"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[11px] text-zinc-500 font-medium block mb-1.5">
                                                            Written Review (optional)
                                                        </label>
                                                        <textarea
                                                            value={feedbackText}
                                                            onChange={(e) => setFeedbackText(e.target.value)}
                                                            placeholder="Share your experience..."
                                                            rows={3}
                                                            className="w-full px-3 py-2.5 bg-zinc-800/40 border border-zinc-800
                                                                       rounded-xl text-sm text-white placeholder-zinc-600
                                                                       focus:outline-none focus:border-emerald-500/50
                                                                       transition-colors resize-none"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => handleSubmit(apt.id)}
                                                        disabled={feedbackRating === 0}
                                                        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                                                            feedbackRating > 0
                                                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                                                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                                                        }`}
                                                    >
                                                        Submit Review
                                                    </button>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Completed Reviews */}
            <div>
                <h3 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
                    <Check style={{ width: 14, height: 14 }} className="text-emerald-400" />
                    Submitted Reviews ({completedReviews.length})
                </h3>

                <div className="space-y-3">
                    {completedReviews.map(apt => (
                        <div
                            key={apt.id}
                            className="bg-zinc-900/30 border border-zinc-800/40 rounded-2xl p-4"
                        >
                            <div className="flex items-start gap-3.5">
                                <div className="h-10 w-10 rounded-xl bg-zinc-800/60
                                                flex items-center justify-center text-sm font-bold text-zinc-400 shrink-0">
                                    {apt.doctorName.split(' ').slice(1).map(w => w[0]).join('')}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-sm font-semibold text-zinc-300 truncate">{apt.doctorName}</p>
                                        <span className="text-[10px] text-zinc-600">· {apt.date}</span>
                                    </div>
                                    <StarRating rating={apt.rating} readOnly size="sm" />
                                    {apt.review && (
                                        <p className="text-xs text-zinc-500 mt-2 leading-relaxed italic">
                                            "{apt.review}"
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
