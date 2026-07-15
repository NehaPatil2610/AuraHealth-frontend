import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Crown, Shield, LogOut, CheckCircle2, User, Settings, LayoutDashboard, Heart, Zap, Star } from 'lucide-react'

import AuraHealthLogo from '../components/AuraHealthLogo'
import ThemeToggle from '../components/ThemeToggle'
import NotificationPanel from '../components/NotificationPanel'
import Footer from '../components/Footer'

import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

import DoctorWorkspace from '../views/patient/DoctorWorkspace' // Assuming based on user provided directory tree structure
import AdminDashboard from '../views/patient/AdminDashboard'
import PatientWorkspace from '../views/patient/PatientWorkspace'

const SUBSCRIPTION_TIERS = [
    { key: 'FREE', label: 'Free Tier', icon: Heart, color: 'text-zinc-400', price: '$0', period: '/m' },
    { key: 'EARLY_ASSISTANCE', label: 'Early Assist', icon: Zap, color: 'text-blue-400', price: '$9', period: '/m' },
    { key: 'PERSONAL_ASSISTANCE', label: 'Personal Care', icon: Star, color: 'text-purple-400', price: '$24', period: '/m' },
    { key: 'COMPREHENSIVE_PRIORITY', label: 'Wellness+', icon: Crown, color: 'text-[#10b981]', price: '$49', period: '/m' },
]

export default function DashboardLayout() {
    const { user, isDoctor, isAdmin, isPatient, logout } = useAuth()
    const { isDark } = useTheme()
    const [currentView, setCurrentView] = useState('overview')
    const [activePlan, setActivePlan] = useState(user?.subscription || 'FREE')
    const [successBanner, setSuccessBanner] = useState(null)
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
    const [profileName, setProfileName] = useState(user?.name || '')
    const [profileEmail, setProfileEmail] = useState(user?.email || '')
    const [profileSaved, setProfileSaved] = useState(false)

    const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'AU'
    const role = user?.role?.toUpperCase() || 'PATIENT'

    useEffect(() => {
        if (isDark) {
            document.body.classList.remove('light-theme')
            document.body.classList.add('dark-theme')
            document.body.style.backgroundColor = '#09090b'
            document.body.style.color = '#fafafa'
        } else {
            document.body.classList.remove('dark-theme')
            document.body.classList.add('light-theme')
            document.body.style.backgroundColor = '#fafafa'
            document.body.style.color = '#09090b'
        }
    }, [isDark])

    const handleSelectPlan = (planKey, planLabel) => {
        setActivePlan(planKey)
        setSuccessBanner(`Upgraded to ${planLabel}`)
        setTimeout(() => setSuccessBanner(null), 3000)
    }

    const handleSaveProfile = (e) => {
        e.preventDefault()
        if (profileName && profileEmail) {
            setProfileSaved(true)
            setTimeout(() => setProfileSaved(false), 3000)
        }
    }

    const renderWorkspace = () => {
        if (isAdmin) return <AdminDashboard />
        if (isDoctor) return <DoctorWorkspace />
        return <PatientWorkspace />
    }

    const renderMainContent = () => {
        if (currentView === 'profile') {
            return (
                <div className={`p-8 rounded-2xl border ${isDark ? 'bg-[#18181b] border-[#27272a]' : 'bg-white border-zinc-200'}`}>
                    <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-zinc-900'}`}>My Profile</h2>
                    
                    <AnimatePresence>
                        {profileSaved && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                className="mb-6 p-4 bg-[#10b981]/10 border border-[#10b981]/30 rounded-xl flex items-center gap-3 text-[#10b981]">
                                <CheckCircle2 style={{ width: 18, height: 18, minWidth: 18, minHeight: 18, flexShrink: 0 }} />
                                <span className="text-sm font-bold">Profile updated successfully!</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form className="space-y-4 max-w-xl" onSubmit={handleSaveProfile}>
                        <div>
                            <label className={`block text-xs font-bold uppercase mb-2 ${isDark ? 'text-zinc-500' : 'text-zinc-600'}`}>Full Name</label>
                            <input type="text" value={profileName} onChange={e => setProfileName(e.target.value)} required
                                   className={`w-full p-3 rounded-xl border focus:outline-none focus:border-[#10b981] transition-colors ${isDark ? 'bg-[#09090b] border-[#27272a] text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'}`} />
                        </div>
                        <div>
                            <label className={`block text-xs font-bold uppercase mb-2 ${isDark ? 'text-zinc-500' : 'text-zinc-600'}`}>Email Address</label>
                            <input type="email" value={profileEmail} onChange={e => setProfileEmail(e.target.value)} required
                                   className={`w-full p-3 rounded-xl border focus:outline-none focus:border-[#10b981] transition-colors ${isDark ? 'bg-[#09090b] border-[#27272a] text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'}`} />
                        </div>
                        <button type="submit" className="px-6 py-3 bg-[#10b981] hover:bg-emerald-400 text-white text-sm font-bold rounded-xl shadow-lg transition-all cursor-pointer mt-4">
                            Save Changes
                        </button>
                    </form>
                </div>
            )
        }
        if (currentView === 'settings') {
            return (
                <div className={`p-8 rounded-2xl border ${isDark ? 'bg-[#18181b] border-[#27272a]' : 'bg-white border-zinc-200'}`}>
                    <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-zinc-900'}`}>Account Settings</h2>
                    <div className="space-y-6 max-w-xl">
                        <div className={`flex items-center justify-between p-5 rounded-2xl border ${isDark ? 'border-[#27272a] bg-[#09090b]/40' : 'border-zinc-200 bg-zinc-50'}`}>
                            <div>
                                <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>Two-Factor Authentication</h3>
                                <p className={`text-xs mt-1 ${isDark ? 'text-zinc-500' : 'text-zinc-600'}`}>Secure your account with 2FA.</p>
                            </div>
                            <button 
                                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${twoFactorEnabled ? 'bg-[#10b981]' : (isDark ? 'bg-zinc-700' : 'bg-zinc-300')}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    </div>
                </div>
            )
        }
        return renderWorkspace()
    }

    return (
        <div className={`flex h-screen w-screen overflow-hidden font-sans select-none transition-colors duration-300 ${
            isDark ? 'bg-[#09090b] text-zinc-50' : 'bg-zinc-50 text-zinc-900'
        }`}>
            {/* ── LEFT SIDEBAR NAV DRAWER ── */}
            <aside className={`w-[280px] shrink-0 border-r flex flex-col transition-colors duration-300 z-40 sticky top-0 h-screen ${
                isDark ? 'bg-[#09090b] border-[#27272a]' : 'bg-white border-zinc-200 shadow-[2px_0_15px_rgba(0,0,0,0.03)]'
            }`}>
                {/* Brand Header */}
                <div className={`h-16 flex items-center px-6 border-b shrink-0 cursor-pointer ${
                    isDark ? 'border-[#27272a]' : 'border-zinc-200'
                }`} onClick={() => setCurrentView('overview')}>
                    <AuraHealthLogo size={24} />
                    <span className={`font-bold tracking-tight ml-3 ${isDark ? 'text-white' : 'text-zinc-900'}`}>AuraHealth</span>
                </div>

                {/* Profile Card */}
                <div className={`p-6 border-b shrink-0 transition-colors ${
                        isDark ? 'border-[#27272a]' : 'border-zinc-200'
                    }`}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#10b981] to-emerald-700 flex items-center justify-center text-sm font-bold text-white shadow-[0_0_15px_rgba(16,185,129,0.2)] shrink-0">
                            {initials}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-zinc-900'}`}>{user?.name || 'AuraHealth User'}</p>
                            <p className={`text-xs truncate ${isDark ? 'text-zinc-500' : 'text-zinc-500'} mt-0.5`}>{user?.email || 'user@aurahealth.local'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md ${
                            isDark ? 'bg-[#18181b] border border-[#27272a]' : 'bg-zinc-100'
                        }`}>
                            <Shield style={{ width: 12, height: 12, minWidth: 12, minHeight: 12, flexShrink: 0 }} className={isDark ? 'text-zinc-400' : 'text-zinc-500'} />
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{role.replace('ROLE_', '')}</span>
                        </div>
                    </div>
                </div>

                {/* Scrollable Nav & Matrix */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    <div className="space-y-1">
                        <button 
                            onClick={() => setCurrentView('overview')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer ${
                                currentView === 'overview'
                                    ? isDark ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20' : 'bg-emerald-50 text-emerald-700 font-semibold'
                                    : isDark ? 'hover:bg-[#18181b] text-zinc-400 hover:text-white border border-transparent' : 'hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 border border-transparent'
                            }`}
                        >
                            <LayoutDashboard style={{ width: 18, height: 18, minWidth: 18, minHeight: 18, flexShrink: 0 }} />
                            <span className="text-sm font-medium">Workspace</span>
                        </button>
                        <button 
                            onClick={() => setCurrentView('profile')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer ${
                                currentView === 'profile'
                                    ? isDark ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20' : 'bg-emerald-50 text-emerald-700 font-semibold'
                                    : isDark ? 'hover:bg-[#18181b] text-zinc-400 hover:text-white border border-transparent' : 'hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 border border-transparent'
                            }`}
                        >
                            <User style={{ width: 18, height: 18, minWidth: 18, minHeight: 18, flexShrink: 0 }} />
                            <span className="text-sm font-medium">My Profile</span>
                        </button>
                        <button 
                            onClick={() => setCurrentView('settings')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer ${
                                currentView === 'settings'
                                    ? isDark ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20' : 'bg-emerald-50 text-emerald-700 font-semibold'
                                    : isDark ? 'hover:bg-[#18181b] text-zinc-400 hover:text-white border border-transparent' : 'hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 border border-transparent'
                            }`}
                        >
                            <Settings style={{ width: 18, height: 18, minWidth: 18, minHeight: 18, flexShrink: 0 }} />
                            <span className="text-sm font-medium">Account Settings</span>
                        </button>
                    </div>

                    {/* Premium Plan Matrix */}
                    {isPatient && (
                        <div>
                            <div className="flex items-center justify-between px-2 mb-3">
                                <div className="flex items-center gap-2">
                                    <Crown style={{ width: 14, height: 14, minWidth: 14, minHeight: 14, flexShrink: 0 }} className="text-[#10b981]" />
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Premium Care Plans</span>
                                </div>
                            </div>
                            <AnimatePresence>
                                {successBanner && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10, height: 0 }}
                                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                                        exit={{ opacity: 0, y: -10, height: 0 }}
                                        className="mb-3 px-3 py-2 rounded-lg bg-[#10b981]/10 border border-[#10b981]/20 flex items-center gap-2 text-[#10b981]"
                                    >
                                        <CheckCircle2 style={{ width: 14, height: 14, minWidth: 14, minHeight: 14, flexShrink: 0 }} />
                                        <span className="text-[10px] font-bold">{successBanner}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div className="space-y-2">
                                {SUBSCRIPTION_TIERS.map(tier => {
                                    const TierIcon = tier.icon
                                    const isCurrent = activePlan === tier.key
                                    return (
                                        <div key={tier.key} className={`p-3 rounded-xl border transition-all ${
                                            isCurrent
                                                ? isDark ? 'border-[#10b981] bg-[#10b981]/[0.08] shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-emerald-400 bg-emerald-50/80 shadow-sm'
                                                : isDark ? 'border-[#27272a] bg-[#18181b]/50 hover:border-zinc-700' : 'border-zinc-200 bg-white hover:border-zinc-300'
                                        }`}>
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    <TierIcon style={{ width: 14, height: 14, minWidth: 14, minHeight: 14, flexShrink: 0 }} className={tier.color} />
                                                    <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{tier.label}</p>
                                                </div>
                                                {isCurrent && <span className="text-[9px] font-bold text-[#10b981] uppercase bg-[#10b981]/10 px-1.5 py-0.5 rounded shrink-0">Active</span>}
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <p className={`text-[11px] ${tier.color}`}><span className="font-bold text-sm">{tier.price}</span>{tier.period}</p>
                                                {!isCurrent && (
                                                    <button 
                                                        onClick={() => handleSelectPlan(tier.key, tier.label)}
                                                        className={`px-3 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                                                            isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
                                                        }`}
                                                    >
                                                        Select
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Bottom: Logout */}
                <div className={`p-4 border-t shrink-0 ${isDark ? 'border-[#27272a]' : 'border-zinc-200'}`}>
                    <button
                        onClick={logout}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl transition-colors text-sm font-bold cursor-pointer ${
                            isDark ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20' : 'bg-red-50 hover:bg-red-100 text-red-600'
                        }`}
                    >
                        <LogOut style={{ width: 16, height: 16, minWidth: 16, minHeight: 16, flexShrink: 0 }} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* ── DYNAMIC CENTER VIEWPORT PANEL ── */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
                {/* Top Header Area */}
                <header className={`h-16 shrink-0 border-b px-8 flex items-center justify-between z-30 transition-colors duration-300 relative ${
                    isDark ? 'bg-[#09090b]/80 border-[#27272a] backdrop-blur-md' : 'bg-white/80 border-zinc-200 backdrop-blur-md'
                }`}>
                    <div className="flex items-center">
                        <span className={`font-bold tracking-tight text-lg ${isDark ? 'text-white' : 'text-zinc-900'}`}>AuraHealth Workspace</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <NotificationPanel />
                    </div>
                </header>

                <main className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 transition-colors duration-300 ${
                    isDark ? 'bg-[#09090b]' : 'bg-zinc-50'
                }`}>
                    <div className="max-w-6xl mx-auto h-full">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentView}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {renderMainContent()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>

                {/* Footer Section */}
                <Footer />
            </div>
        </div>
    )
}
