import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    User, Settings, ChevronRight, Crown, Shield, LogOut,
    Zap, Star, Heart, Check, Menu, X
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import AuraHealthLogo from './AuraHealthLogo'

const SUBSCRIPTION_TIERS = [
    {
        key: 'FREE',
        label: 'Free Tier',
        icon: Heart,
        color: 'text-zinc-400',
        bg: 'bg-zinc-800/50',
        bgLight: 'bg-zinc-100',
        price: '$0',
        period: '/month',
        features: ['Basic appointment booking', 'Standard queue priority', 'Email notifications'],
    },
    {
        key: 'EARLY_ASSISTANCE',
        label: 'Early Assist',
        icon: Zap,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        bgLight: 'bg-blue-50',
        price: '$9.99',
        period: '/month',
        features: ['Priority queue placement', 'SMS + email alerts', '24-hour booking window'],
    },
    {
        key: 'PERSONAL_ASSISTANCE',
        label: 'Personal Care',
        icon: Star,
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        bgLight: 'bg-purple-50',
        price: '$24.99',
        period: '/month',
        features: ['Dedicated care coordinator', 'Same-day bookings', 'Video consultations', 'Health reports'],
    },
    {
        key: 'COMPREHENSIVE_PRIORITY',
        label: 'Wellness+',
        icon: Crown,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        bgLight: 'bg-emerald-50',
        price: '$49.99',
        period: '/month',
        features: ['All Personal Care features', 'Priority emergency access', 'Family plan (up to 4)', 'Annual health screening'],
    },
]

export default function LeftSidebar({ isOpen, setIsOpen }) {
    const { user, logout, isPatient, isDoctor, isAdmin } = useAuth()
    const { isDark } = useTheme()

    const currentTier = SUBSCRIPTION_TIERS.find(t => t.key === user?.subscription) || SUBSCRIPTION_TIERS[0]
    const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'AU'

    return (
        <>
            {/* Mobile overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar drawer */}
            <motion.aside
                initial={false}
                animate={{ x: isOpen ? 0 : -320 }}
                className={`fixed lg:sticky top-0 left-0 h-screen w-[280px] shrink-0 border-r z-50 flex flex-col transition-colors duration-300 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                } ${
                    isDark
                        ? 'bg-[#09090b] border-zinc-800'
                        : 'bg-zinc-50 border-zinc-200'
                }`}
                style={{ x: 0 }} // Override framer-motion x on desktop via CSS classes instead of inline style if possible, but animate is used.
            >
                {/* ── Brand Header ── */}
                <div className={`h-14 flex items-center justify-between px-5 border-b shrink-0 ${
                    isDark ? 'border-zinc-800' : 'border-zinc-200'
                }`}>
                    <div className="flex items-center gap-2.5">
                        <AuraHealthLogo size={22} />
                        <span className={`text-sm font-semibold tracking-tight ${
                            isDark ? 'text-white' : 'text-zinc-900'
                        }`}>AuraHealth</span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="lg:hidden text-zinc-500 hover:text-zinc-300">
                        <X style={{ width: 18, height: 18 }} />
                    </button>
                </div>

                {/* ── Profile Section ── */}
                <div className={`p-5 border-b shrink-0 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
                    <div className="flex items-center gap-3.5 mb-4">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800
                                        flex items-center justify-center text-xs font-bold text-white shrink-0
                                        shadow-lg shadow-emerald-900/30">
                            {initials}
                        </div>
                        <div className="min-w-0">
                            <p className={`text-sm font-semibold truncate ${
                                isDark ? 'text-white' : 'text-zinc-900'
                            }`}>{user?.name}</p>
                            <p className="text-[11px] truncate text-zinc-500">{user?.email}</p>
                        </div>
                    </div>

                    {/* Role Badge */}
                    <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg mb-2 ${
                        isDark ? 'bg-zinc-800/50' : 'bg-zinc-200/50'
                    }`}>
                        <Shield style={{ width: 12, height: 12 }} className={isDark ? 'text-zinc-400' : 'text-zinc-500'} />
                        <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
                            {user?.role}
                        </span>
                    </div>

                    {/* Subscription Badge */}
                    {isPatient && (
                        <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg ${
                            isDark ? currentTier.bg : currentTier.bgLight
                        }`}>
                            <Crown style={{ width: 12, height: 12 }} className={currentTier.color} />
                            <span className={`text-[11px] font-semibold ${currentTier.color}`}>
                                {currentTier.label} Plan
                            </span>
                        </div>
                    )}
                </div>

                {/* ── Scrollable Content ── */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    
                    {/* Navigation Links */}
                    <div className="space-y-1">
                        <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                            isDark ? 'bg-zinc-800/50 text-white' : 'bg-white shadow-sm border border-zinc-200 text-zinc-900'
                        }`}>
                            <User style={{ width: 16, height: 16 }} className={isDark ? 'text-emerald-400' : 'text-emerald-600'} />
                            <span className="text-sm font-medium">My Dashboard</span>
                        </button>
                        <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                            isDark ? 'hover:bg-zinc-800/40 text-zinc-400 hover:text-white' : 'hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900'
                        }`}>
                            <Settings style={{ width: 16, height: 16 }} />
                            <span className="text-sm font-medium">Profile Settings</span>
                        </button>
                    </div>

                    {/* Premium Plan Matrix (Patient Only) */}
                    {isPatient && (
                        <div>
                            <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-3 px-1">
                                Premium Care Plans
                            </p>
                            <div className="space-y-2">
                                {SUBSCRIPTION_TIERS.map(tier => {
                                    const TierIcon = tier.icon
                                    const isCurrentPlan = currentTier.key === tier.key
                                    return (
                                        <div
                                            key={tier.key}
                                            className={`p-3 rounded-xl border transition-all ${
                                                isCurrentPlan
                                                    ? isDark
                                                        ? 'border-emerald-500/50 bg-emerald-500/[0.05]'
                                                        : 'border-emerald-500/50 bg-emerald-50/80'
                                                    : isDark
                                                        ? 'border-zinc-800/60 bg-zinc-900/30'
                                                        : 'border-zinc-200 bg-white'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    <TierIcon style={{ width: 14, height: 14 }} className={tier.color} />
                                                    <p className={`text-xs font-semibold ${
                                                        isDark ? 'text-white' : 'text-zinc-900'
                                                    }`}>{tier.label}</p>
                                                </div>
                                                {isCurrentPlan && (
                                                    <span className="text-[9px] font-bold text-emerald-400 uppercase bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                            <p className={`text-[10px] mb-2 ${tier.color}`}>
                                                <span className="font-bold text-xs">{tier.price}</span>{tier.period}
                                            </p>
                                            {!isCurrentPlan && (
                                                <button className={`w-full py-1.5 mt-1 rounded-lg text-[10px] font-semibold transition-colors ${
                                                    isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900'
                                                }`}>
                                                    Upgrade
                                                </button>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Footer / Logout ── */}
                <div className={`p-4 border-t shrink-0 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
                    <button
                        onClick={logout}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl transition-colors text-sm font-medium ${
                            isDark 
                                ? 'text-red-400 hover:bg-red-500/10' 
                                : 'text-red-600 hover:bg-red-50 border border-red-100'
                        }`}
                    >
                        <LogOut style={{ width: 16, height: 16 }} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </motion.aside>
        </>
    )
}
