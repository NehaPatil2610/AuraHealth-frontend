import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    User, Settings, LogOut, Shield, X
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import AuraHealthLogo from './AuraHealthLogo'

export default function LeftSidebar({ isOpen, setIsOpen }) {
    const { user, logout, isPatient } = useAuth()
    const { isDark } = useTheme()
    const [showPromoModal, setShowPromoModal] = useState(false)

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

            {/* Premium Promo Modal (Overlay) */}
            <AnimatePresence>
                {showPromoModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowPromoModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className={`w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl p-6 ${
                                isDark ? 'bg-[#18181b] border border-[#27272a]' : 'bg-white border border-zinc-200'
                            }`}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>Premium Plans</h2>
                                <button onClick={() => setShowPromoModal(false)} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-500'}`}>
                                    <X style={{ width: 20, height: 20, flexShrink: 0 }} />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className={`p-4 rounded-xl border ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                                    <h3 className={`font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>Early Assist <span className="text-emerald-500 text-sm ml-2">$9/mo</span></h3>
                                    <p className={`text-sm mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Priority matching, 24/7 nurse line, basic insights.</p>
                                </div>
                                <div className={`p-4 rounded-xl border border-emerald-500/30 ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                                    <h3 className="font-bold text-emerald-600 dark:text-emerald-400">Personal Care <span className="text-emerald-500 text-sm ml-2">$24/mo</span></h3>
                                    <p className={`text-sm mt-1 ${isDark ? 'text-emerald-400/80' : 'text-emerald-700/80'}`}>Dedicated doctor, unlimited messaging, advanced insights.</p>
                                </div>
                                <div className={`p-4 rounded-xl border ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                                    <h3 className={`font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>Wellness+ <span className="text-emerald-500 text-sm ml-2">$49/mo</span></h3>
                                    <p className={`text-sm mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Everything included, in-home visits, genetic screening.</p>
                                </div>
                            </div>
                            <button onClick={() => setShowPromoModal(false)} className="w-full mt-6 py-3 rounded-xl bg-[#10b981] hover:bg-emerald-400 text-white font-bold transition-colors">
                                Close Comparisons
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sidebar drawer */}
            <motion.aside
                initial={false}
                animate={{ x: isOpen ? 0 : -320 }}
                className={`fixed lg:sticky top-0 left-0 h-screen w-[280px] shrink-0 border-r z-40 flex flex-col transition-colors duration-300 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                } ${
                    isDark
                        ? 'bg-[#09090b] border-[#27272a]'
                        : 'bg-white border-zinc-200 shadow-[2px_0_15px_rgba(0,0,0,0.03)]'
                }`}
                style={{ x: 0 }}
            >
                {/* ── Brand Header ── */}
                <div className={`h-16 flex items-center justify-between px-6 border-b shrink-0 ${
                    isDark ? 'border-[#27272a]' : 'border-zinc-200'
                }`}>
                    <div className="flex items-center gap-3">
                        <AuraHealthLogo size={24} />
                        <span className={`font-bold tracking-tight ${
                            isDark ? 'text-white' : 'text-zinc-900'
                        }`}>AuraHealth</span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="lg:hidden text-zinc-500 hover:text-zinc-300">
                        <X style={{ width: 18, height: 18, flexShrink: 0 }} />
                    </button>
                </div>

                {/* ── Profile Section ── */}
                <div className={`p-6 border-b shrink-0 ${isDark ? 'border-[#27272a]' : 'border-zinc-200'}`}>
                    <div className="flex items-center gap-3.5 mb-4">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#10b981] to-emerald-800
                                        flex items-center justify-center text-xs font-bold text-white shrink-0
                                        shadow-lg shadow-emerald-900/30">
                            {initials}
                        </div>
                        <div className="min-w-0">
                            <p className={`text-sm font-bold truncate ${
                                isDark ? 'text-white' : 'text-zinc-900'
                            }`}>{user?.name || 'AuraHealth User'}</p>
                            <p className="text-[11px] truncate text-zinc-500">{user?.email || 'user@aurahealth.local'}</p>
                        </div>
                    </div>

                    {/* Role Badge */}
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                        isDark ? 'bg-zinc-800/50' : 'bg-zinc-100'
                    }`}>
                        <Shield style={{ width: 14, height: 14, flexShrink: 0 }} className={isDark ? 'text-zinc-400' : 'text-zinc-500'} />
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                            {user?.role || 'Patient'}
                        </span>
                    </div>
                </div>

                {/* ── Scrollable Content ── */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col">
                    
                    {/* Navigation Links */}
                    <div className="space-y-1 mb-6">
                        <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                            isDark ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20' : 'bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100'
                        }`}>
                            <User style={{ width: 18, height: 18, flexShrink: 0 }} />
                            <span className="text-sm font-medium">Workspace</span>
                        </button>
                        <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors border border-transparent ${
                            isDark ? 'hover:bg-[#18181b] text-zinc-400 hover:text-white' : 'hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900'
                        }`}>
                            <Settings style={{ width: 18, height: 18, flexShrink: 0 }} />
                            <span className="text-sm font-medium">Account Settings</span>
                        </button>
                    </div>

                    <div className="flex-1" />

                    {/* Premium Promo Block */}
                    {isPatient && (
                        <div 
                            onClick={() => setShowPromoModal(true)}
                            className="relative overflow-hidden rounded-2xl cursor-pointer group transition-all duration-300 hover:scale-[1.02] shadow-lg mb-2 border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/50 backdrop-blur-md"
                        >
                            {/* Glowing Left Accent Line */}
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#10b981] to-emerald-900 shadow-[0_0_10px_#10b981]" />
                            
                            <div className="p-4 pl-5">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="text-sm" style={{ flexShrink: 0 }}>⭐</span>
                                    <span className={`text-sm font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                                        Upgrade to Premium
                                    </span>
                                </div>
                                <p className={`text-xs leading-relaxed mb-3 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                    Unlock priority matching & 24/7 care line.
                                </p>
                                <button className={`w-full py-2 rounded-lg text-xs font-bold transition-colors ${
                                    isDark ? 'bg-zinc-800 text-white group-hover:bg-[#10b981] group-hover:text-white' : 'bg-zinc-100 text-zinc-900 group-hover:bg-[#10b981] group-hover:text-white'
                                }`}>
                                    View Plans
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Footer / Logout ── */}
                <div className={`p-4 border-t shrink-0 ${isDark ? 'border-[#27272a]' : 'border-zinc-200'}`}>
                    <button
                        onClick={logout}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-colors text-sm font-bold ${
                            isDark 
                                ? 'text-red-400 hover:bg-red-500/10' 
                                : 'text-red-600 hover:bg-red-50 border border-red-100'
                        }`}
                    >
                        <LogOut style={{ width: 18, height: 18, flexShrink: 0 }} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </motion.aside>
        </>
    )
}
