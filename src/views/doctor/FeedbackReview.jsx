import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Trash2, Star, BarChart3, AlertTriangle } from 'lucide-react'
import StarRating from '../../components/StarRating'

// ── Mock Feedback Data ─────────────────────────────────────────
const INITIAL_FEEDBACK = [
    { id: 'fb-01', patientName: 'Alex Morgan', rating: 5, comment: 'Exceptional care and thorough diagnosis. Dr. Chen took the time to explain everything in detail. Highly recommended!', date: '2026-07-12', flagged: false },
    { id: 'fb-02', patientName: 'Riya Sharma', rating: 4, comment: 'Very professional and knowledgeable. The clinic environment was comfortable and wait time was minimal.', date: '2026-07-11', flagged: false },
    { id: 'fb-03', patientName: 'John Lee', rating: 5, comment: 'Best cardiologist I have ever visited. Clear communication and genuine concern for patient well-being.', date: '2026-07-10', flagged: false },
    { id: 'fb-04', patientName: 'Spam Account', rating: 1, comment: 'Buy cheap medications at www.spam-link.com!! Best prices online!!!', date: '2026-07-09', flagged: true },
    { id: 'fb-05', patientName: 'Priya Patel', rating: 4, comment: 'Good experience overall. Follow-up scheduling could be smoother but the consultation itself was excellent.', date: '2026-07-08', flagged: false },
    { id: 'fb-06', patientName: 'Bot User', rating: 1, comment: 'asdfghjkl random text test test test click here for free stuff', date: '2026-07-07', flagged: true },
    { id: 'fb-07', patientName: 'David Chen', rating: 5, comment: 'Life-saving diagnosis. Dr. Chen caught something other doctors missed. Forever grateful for the thorough examination.', date: '2026-07-06', flagged: false },
    { id: 'fb-08', patientName: 'Sara Ahmed', rating: 3, comment: 'Good doctor but the appointment was shorter than expected. Would have liked more time to discuss concerns.', date: '2026-07-05', flagged: false },
]

export default function FeedbackReview() {
    const [feedback, setFeedback] = useState(INITIAL_FEEDBACK)
    const [filter, setFilter] = useState('all') // 'all' | 'flagged' | 'recent'
    const [deleteConfirm, setDeleteConfirm] = useState(null)

    const handleDelete = (id) => {
        setFeedback(prev => prev.filter(f => f.id !== id))
        setDeleteConfirm(null)
    }

    const filteredFeedback = feedback.filter(f => {
        if (filter === 'flagged') return f.flagged
        return true
    })

    // Stats
    const totalReviews = feedback.filter(f => !f.flagged).length
    const avgRating = totalReviews > 0
        ? (feedback.filter(f => !f.flagged).reduce((sum, f) => sum + f.rating, 0) / totalReviews).toFixed(1)
        : '0.0'
    const flaggedCount = feedback.filter(f => f.flagged).length

    return (
        <div className="space-y-6">
            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-4">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wide font-medium">Average Rating</p>
                    <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-2xl font-bold text-white">{avgRating}</span>
                        <StarRating rating={Math.round(Number(avgRating))} readOnly size="sm" />
                    </div>
                </div>
                <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-4">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wide font-medium">Total Reviews</p>
                    <span className="text-2xl font-bold text-white mt-1.5 block">{totalReviews}</span>
                </div>
                <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-4">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wide font-medium">Flagged / Spam</p>
                    <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-2xl font-bold text-red-400">{flaggedCount}</span>
                        {flaggedCount > 0 && (
                            <AlertTriangle style={{ width: 14, height: 14 }} className="text-red-400" />
                        )}
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
                {[
                    { key: 'all', label: `All (${feedback.length})` },
                    { key: 'flagged', label: `Spam (${flaggedCount})` },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                            filter === tab.key
                                ? 'bg-zinc-800 text-white'
                                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Feedback List */}
            <div className="space-y-2.5">
                <AnimatePresence mode="popLayout">
                    {filteredFeedback.map((fb) => (
                        <motion.div
                            key={fb.id}
                            layout
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`bg-zinc-900/40 border rounded-2xl p-4 transition-colors ${
                                fb.flagged
                                    ? 'border-red-500/20 bg-red-500/[0.02]'
                                    : 'border-zinc-800/60'
                            }`}
                        >
                            <div className="flex items-start gap-3.5">
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                                    fb.flagged
                                        ? 'bg-red-500/10 text-red-400'
                                        : 'bg-zinc-800/60 text-zinc-400'
                                }`}>
                                    {fb.patientName.split(' ').map(w => w[0]).join('').slice(0, 2)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="text-sm font-semibold text-white">{fb.patientName}</p>
                                        {fb.flagged && (
                                            <span className="text-[10px] font-medium text-red-400 px-2 py-0.5 rounded-full bg-red-500/10">
                                                ⚠ Spam
                                            </span>
                                        )}
                                        <span className="text-[10px] text-zinc-600 ml-auto">{fb.date}</span>
                                    </div>
                                    <div className="mt-1">
                                        <StarRating rating={fb.rating} readOnly size="sm" />
                                    </div>
                                    <p className={`text-xs mt-2 leading-relaxed ${
                                        fb.flagged ? 'text-zinc-600 line-through' : 'text-zinc-400'
                                    }`}>
                                        "{fb.comment}"
                                    </p>
                                </div>

                                {/* Delete Button */}
                                <div className="shrink-0">
                                    {deleteConfirm === fb.id ? (
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => handleDelete(fb.id)}
                                                className="px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-400
                                                           text-[11px] font-medium hover:bg-red-500/20
                                                           transition-colors cursor-pointer"
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(null)}
                                                className="px-2.5 py-1.5 rounded-lg bg-zinc-800/50 text-zinc-500
                                                           text-[11px] font-medium hover:text-zinc-300
                                                           transition-colors cursor-pointer"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setDeleteConfirm(fb.id)}
                                            className="p-2 rounded-lg text-zinc-600 hover:text-red-400
                                                       hover:bg-red-500/10 transition-colors cursor-pointer"
                                            title="Delete review"
                                        >
                                            <Trash2 style={{ width: 14, height: 14 }} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredFeedback.length === 0 && (
                <div className="py-12 text-center text-zinc-600 text-sm">
                    {filter === 'flagged' ? 'No spam reviews detected.' : 'No reviews yet.'}
                </div>
            )}
        </div>
    )
}
