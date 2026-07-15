import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Receipt, CreditCard, Download, Check, Clock, AlertCircle,
    ChevronDown, Crown, Zap, UserCheck, HeartPulse,
    ExternalLink, Filter, ArrowUpRight
} from 'lucide-react'

// ── Invoice Status Configuration ───────────────────────────────
const STATUS_CONFIG = {
    paid: { label: 'Paid', color: 'text-emerald-400', bg: 'bg-emerald-500/10', dot: 'bg-emerald-500', icon: Check },
    pending: { label: 'Pending', color: 'text-amber-400', bg: 'bg-amber-500/10', dot: 'bg-amber-500', icon: Clock },
    overdue: { label: 'Overdue', color: 'text-red-400', bg: 'bg-red-500/10', dot: 'bg-red-500', icon: AlertCircle },
    processing: { label: 'Processing', color: 'text-blue-400', bg: 'bg-blue-500/10', dot: 'bg-blue-500', icon: Clock },
}

// ── Premium Plan Definitions ───────────────────────────────────
const PLANS = [
    { key: 'free', label: 'Standard', icon: Clock, color: 'text-zinc-400', bg: 'bg-zinc-800/50', border: 'border-zinc-800', price: '₹0', period: '/mo', features: ['Standard queue position', 'Basic appointment booking', 'Post-visit feedback'] },
    { key: 'priority', label: 'Early Assist Priority', icon: Zap, color: 'text-blue-400', bg: 'bg-blue-500/[0.06]', border: 'border-blue-500/30', price: '₹499', period: '/mo', features: ['Priority queue placement', 'Reduced wait times', 'Email appointment reminders'] },
    { key: 'personal', label: 'Personal Assistance', icon: UserCheck, color: 'text-purple-400', bg: 'bg-purple-500/[0.06]', border: 'border-purple-500/30', price: '₹999', period: '/mo', popular: true, features: ['Dedicated care coordinator', 'On-demand priority slots', '24/7 scheduling support'] },
    { key: 'wellness', label: 'Wellness+ Priority', icon: HeartPulse, color: 'text-emerald-400', bg: 'bg-emerald-500/[0.06]', border: 'border-emerald-500/30', price: '₹1,999', period: '/mo', features: ['Weekly/monthly health checkups', 'Personal wellness sessions', 'Priority #1 queue position'] },
]

// ── Mock Invoice Data ──────────────────────────────────────────
const INVOICES = [
    { id: 'INV-2026-0041', date: '2026-07-12', dueDate: '2026-07-19', description: 'Cardiology Consultation — Dr. Sarah Chen', amount: 1200, status: 'pending', category: 'consultation' },
    { id: 'INV-2026-0040', date: '2026-07-10', dueDate: '2026-07-10', description: 'Wellness+ Monthly Subscription', amount: 1999, status: 'paid', category: 'subscription' },
    { id: 'INV-2026-0039', date: '2026-07-08', dueDate: '2026-07-08', description: 'Ophthalmology Visit — Dr. David Kim', amount: 1300, status: 'paid', category: 'consultation' },
    { id: 'INV-2026-0038', date: '2026-07-05', dueDate: '2026-07-12', description: 'Lab Work — Complete Blood Panel', amount: 2800, status: 'overdue', category: 'diagnostic' },
    { id: 'INV-2026-0037', date: '2026-07-02', dueDate: '2026-07-02', description: 'General Consultation — Dr. Raj Malhotra', amount: 500, status: 'paid', category: 'consultation' },
    { id: 'INV-2026-0036', date: '2026-06-28', dueDate: '2026-06-28', description: 'Pediatric Visit — Dr. Fatima Khan', amount: 800, status: 'paid', category: 'consultation' },
    { id: 'INV-2026-0035', date: '2026-06-25', dueDate: '2026-07-02', description: 'MRI Scan — Neurological Assessment', amount: 8500, status: 'paid', category: 'diagnostic' },
    { id: 'INV-2026-0034', date: '2026-06-20', dueDate: '2026-06-20', description: 'Priority Plan Upgrade — Early Assist', amount: 499, status: 'paid', category: 'subscription' },
    { id: 'INV-2026-0033', date: '2026-06-15', dueDate: '2026-06-22', description: 'Physiotherapy Session (3 of 6)', amount: 1500, status: 'processing', category: 'consultation' },
]

// ── Format currency ────────────────────────────────────────────
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}

export default function BillingInvoice() {
    const [filter, setFilter] = useState('all')
    const [expandedInvoice, setExpandedInvoice] = useState(null)
    const [showPlanUpgrade, setShowPlanUpgrade] = useState(false)
    const [activePlan, setActivePlan] = useState('free')

    const filteredInvoices = INVOICES.filter(inv => {
        if (filter === 'all') return true
        return inv.status === filter
    })

    // ── Financial Summary ──────────────────────────────────────
    const totalPaid = INVOICES.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
    const totalPending = INVOICES.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0)
    const totalOverdue = INVOICES.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0)

    return (
        <div className="space-y-6">
            {/* ── Financial Summary Cards ────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded-lg bg-emerald-500/10">
                            <Check style={{ width: 12, height: 12 }} className="text-emerald-400" />
                        </div>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wide font-medium">Total Paid</p>
                    </div>
                    <p className="text-xl font-bold text-white">{formatCurrency(totalPaid)}</p>
                    <p className="text-[10px] text-zinc-600 mt-1">
                        {INVOICES.filter(i => i.status === 'paid').length} invoices cleared
                    </p>
                </div>

                <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded-lg bg-amber-500/10">
                            <Clock style={{ width: 12, height: 12 }} className="text-amber-400" />
                        </div>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wide font-medium">Pending</p>
                    </div>
                    <p className="text-xl font-bold text-amber-400">{formatCurrency(totalPending)}</p>
                    <p className="text-[10px] text-zinc-600 mt-1">
                        {INVOICES.filter(i => i.status === 'pending').length} awaiting payment
                    </p>
                </div>

                <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded-lg bg-red-500/10">
                            <AlertCircle style={{ width: 12, height: 12 }} className="text-red-400" />
                        </div>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wide font-medium">Overdue</p>
                    </div>
                    <p className="text-xl font-bold text-red-400">{formatCurrency(totalOverdue)}</p>
                    <p className="text-[10px] text-zinc-600 mt-1">
                        {INVOICES.filter(i => i.status === 'overdue').length} past due date
                    </p>
                </div>
            </div>

            {/* ── Subscription Plan / Upgrade Card ──────────── */}
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl overflow-hidden">
                <button
                    onClick={() => setShowPlanUpgrade(!showPlanUpgrade)}
                    className="w-full flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-zinc-800/20 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-emerald-500/10">
                            <Crown style={{ width: 16, height: 16 }} className="text-emerald-400" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-semibold text-white">Premium Care Plans</p>
                            <p className="text-[11px] text-zinc-500">Upgrade your tier for priority queue access and dedicated care</p>
                        </div>
                    </div>
                    <ChevronDown
                        style={{ width: 16, height: 16 }}
                        className={`text-zinc-500 transition-transform duration-200 ${showPlanUpgrade ? 'rotate-180' : ''}`}
                    />
                </button>

                <AnimatePresence>
                    {showPlanUpgrade && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                        >
                            <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {PLANS.map(plan => {
                                    const Icon = plan.icon
                                    const isActive = activePlan === plan.key
                                    return (
                                        <motion.div
                                            key={plan.key}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setActivePlan(plan.key)}
                                            className={`relative p-4 rounded-xl border cursor-pointer transition-all ${
                                                isActive
                                                    ? `${plan.border} ${plan.bg}`
                                                    : 'border-zinc-800/40 bg-zinc-900/20 hover:border-zinc-700'
                                            }`}
                                        >
                                            {plan.popular && (
                                                <span className="absolute -top-2 right-3 text-[9px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                                                    Popular
                                                </span>
                                            )}
                                            <div className="flex items-center gap-2 mb-3">
                                                <Icon style={{ width: 14, height: 14 }} className={isActive ? plan.color : 'text-zinc-600'} />
                                                <span className={`text-[13px] font-semibold ${isActive ? plan.color : 'text-zinc-400'}`}>
                                                    {plan.label}
                                                </span>
                                            </div>
                                            <div className="mb-3">
                                                <span className={`text-lg font-bold ${isActive ? 'text-white' : 'text-zinc-300'}`}>{plan.price}</span>
                                                <span className="text-[11px] text-zinc-600">{plan.period}</span>
                                            </div>
                                            <ul className="space-y-1.5">
                                                {plan.features.map((f, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-[11px] text-zinc-500 leading-relaxed">
                                                        <Check style={{ width: 10, height: 10, marginTop: 3 }} className={`shrink-0 ${isActive ? plan.color : 'text-zinc-600'}`} />
                                                        {f}
                                                    </li>
                                                ))}
                                            </ul>
                                            {plan.key !== 'free' && (
                                                <button
                                                    className={`w-full mt-3 py-2 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                                                        isActive
                                                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                                            : 'bg-zinc-800/60 text-zinc-500 hover:text-zinc-300'
                                                    }`}
                                                >
                                                    {isActive ? 'Current Plan' : 'Upgrade'}
                                                </button>
                                            )}
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Invoice List ───────────────────────────────── */}
            <div className="space-y-4">
                {/* Header + Filter */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                        <Receipt style={{ width: 16, height: 16 }} className="text-emerald-400" />
                        <h2 className="text-base font-semibold text-white">Invoice History</h2>
                        <span className="text-xs text-zinc-600">({filteredInvoices.length} items)</span>
                    </div>

                    <div className="flex items-center gap-1.5 p-0.5 bg-zinc-900/60 rounded-lg border border-zinc-800/40">
                        {[
                            { key: 'all', label: 'All' },
                            { key: 'paid', label: 'Paid' },
                            { key: 'pending', label: 'Pending' },
                            { key: 'overdue', label: 'Overdue' },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setFilter(tab.key)}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                                    filter === tab.key
                                        ? 'bg-zinc-800 text-white'
                                        : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Invoice Items */}
                <div className="space-y-2">
                    <AnimatePresence mode="popLayout">
                        {filteredInvoices.map((inv, idx) => {
                            const status = STATUS_CONFIG[inv.status]
                            const StatusIcon = status.icon
                            const isExpanded = expandedInvoice === inv.id

                            return (
                                <motion.div
                                    key={inv.id}
                                    layout
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: idx * 0.03, duration: 0.2 }}
                                    className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl overflow-hidden
                                               hover:border-zinc-700/60 transition-colors"
                                >
                                    <div
                                        onClick={() => setExpandedInvoice(isExpanded ? null : inv.id)}
                                        className="flex items-center gap-3.5 p-4 cursor-pointer"
                                    >
                                        {/* Status Icon */}
                                        <div className={`p-2 rounded-xl ${status.bg} shrink-0`}>
                                            <StatusIcon style={{ width: 14, height: 14 }} className={status.color} />
                                        </div>

                                        {/* Description */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="text-sm font-semibold text-white truncate">{inv.description}</p>
                                                <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>
                                                    <span className={`h-1 w-1 rounded-full ${status.dot}`} />
                                                    {status.label}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-zinc-500 mt-0.5">
                                                {inv.id} · Issued: {inv.date}
                                                {inv.status === 'overdue' && <span className="text-red-400/80"> · Due: {inv.dueDate}</span>}
                                            </p>
                                        </div>

                                        {/* Amount */}
                                        <div className="text-right shrink-0">
                                            <p className="text-sm font-bold text-white">{formatCurrency(inv.amount)}</p>
                                            <p className="text-[10px] text-zinc-600 capitalize">{inv.category}</p>
                                        </div>
                                    </div>

                                    {/* Expanded Detail Row */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden border-t border-zinc-800/40"
                                            >
                                                <div className="px-4 py-3 flex items-center justify-between flex-wrap gap-3">
                                                    <div className="flex items-center gap-6 text-[11px] text-zinc-500">
                                                        <div>
                                                            <span className="text-zinc-600 uppercase tracking-wide">Issue Date</span>
                                                            <p className="text-white font-medium mt-0.5">{inv.date}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-zinc-600 uppercase tracking-wide">Due Date</span>
                                                            <p className="text-white font-medium mt-0.5">{inv.dueDate}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-zinc-600 uppercase tracking-wide">Category</span>
                                                            <p className="text-white font-medium mt-0.5 capitalize">{inv.category}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800/50 text-zinc-400
                                                                           hover:text-white hover:bg-zinc-800 text-[11px] font-medium
                                                                           transition-colors cursor-pointer">
                                                            <Download style={{ width: 11, height: 11 }} />
                                                            PDF
                                                        </button>

                                                        {(inv.status === 'pending' || inv.status === 'overdue') && (
                                                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600
                                                                               hover:bg-emerald-500 text-white text-[11px] font-semibold
                                                                               transition-colors cursor-pointer shadow-sm shadow-emerald-950/30">
                                                                <CreditCard style={{ width: 11, height: 11 }} />
                                                                Pay Now
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>

                {filteredInvoices.length === 0 && (
                    <div className="py-12 text-center text-zinc-600 text-sm">
                        No invoices match the selected filter.
                    </div>
                )}

                {/* Privacy / Encrypted Notice */}
                <div className="mt-4 p-3 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-xl">
                    <p className="text-[11px] text-emerald-500/60 leading-relaxed">
                        🔒 All billing data is encrypted and accessible only to you. Payment transactions are processed
                        through a PCI-DSS compliant gateway. AuraHealth does not store credit card details.
                    </p>
                </div>
            </div>
        </div>
    )
}
