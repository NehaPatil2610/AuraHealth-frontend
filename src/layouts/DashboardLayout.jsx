import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Crown, Shield, LogOut, CheckCircle2, User, Settings, LayoutDashboard, Heart, Zap, Star, X, Info } from 'lucide-react'

import AuraHealthLogo from '../components/AuraHealthLogo'
import ThemeToggle from '../components/ThemeToggle'
import NotificationPanel from '../components/NotificationPanel'

import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { ProfileDropdown } from '../components/ui/profile-dropdown'
import PricingCardTwo from '../components/ui/pricing-card-triple'
import HoverGradientNavBar from '../components/ui/hover-gradient-nav-bar'

import DoctorWorkspace from '../views/patient/DoctorWorkspace'
import AdminDashboard from '../views/patient/AdminDashboard'
import PatientWorkspace from '../views/patient/PatientWorkspace'

function BillingModal({ isOpen, onClose, selectedPlan, onActivate }) {
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
                    <div className={`p-6 border-b flex items-center justify-between ${isDark ? 'border-[#27272a]' : 'border-zinc-200'}`}>
                        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>Complete Billing</h2>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-800 transition-colors text-zinc-400">
                            <X style={{ width: 20, height: 20, minWidth: 20, minHeight: 20, flexShrink: 0 }} />
                        </button>
                    </div>
                    <div className="p-6 overflow-y-auto custom-scrollbar flex-1 max-h-[80vh]">
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
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

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
    const [showPromoModal, setShowPromoModal] = useState(false)
    const [billingPlan, setBillingPlan] = useState(null)

    const initials = user?.name ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'AU'
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

    const handleSelectPlan = (plan) => {
        setBillingPlan(plan)
    }

    const handleActivatePlan = () => {
        setActivePlan(billingPlan.key)
        setSuccessBanner(`Successfully upgraded to ${billingPlan.name}!`)
        setTimeout(() => setSuccessBanner(null), 3000)
        setBillingPlan(null)
        setShowPromoModal(false)
    }

    const navItems = [
        { icon: <LayoutDashboard className="h-5 w-5" />, label: "Home", onClick: () => setCurrentView('overview'), gradient: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(5,150,105,0.06) 50%, rgba(4,120,87,0) 100%)", iconColor: "group-hover:text-emerald-500" },
        isPatient ? { icon: <Star className="h-5 w-5" />, label: "Plans", onClick: () => setShowPromoModal(true), gradient: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(5,150,105,0.06) 50%, rgba(4,120,87,0) 100%)", iconColor: "group-hover:text-emerald-500" } : null,
        { icon: <Info className="h-5 w-5" />, label: "About", onClick: () => setCurrentView('about'), gradient: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(5,150,105,0.06) 50%, rgba(4,120,87,0) 100%)", iconColor: "group-hover:text-emerald-500" },
        { component: <NotificationPanel /> },
        { component: <ThemeToggle /> },
        { icon: <Settings className="h-5 w-5" />, label: "Settings", onClick: () => setCurrentView('settings'), gradient: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(5,150,105,0.06) 50%, rgba(4,120,87,0) 100%)", iconColor: "group-hover:text-emerald-500" },
        { component: <ProfileDropdown data={{ name: user?.name, email: user?.email, initials, role }} onNavigate={setCurrentView} onLogout={logout} iconOnly={true} /> }
    ].filter(Boolean)

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
        if (currentView === 'about') {
            return (
                <div className={`p-8 rounded-2xl border ${isDark ? 'bg-[#18181b] border-[#27272a]' : 'bg-white border-zinc-200'}`}>
                    <div className="flex items-center justify-center mb-6">
                        <AuraHealthLogo size={48} />
                    </div>
                    <h2 className={`text-2xl font-bold mb-4 text-center ${isDark ? 'text-white' : 'text-zinc-900'}`}>About AuraHealth</h2>
                    <p className={`text-center max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        AuraHealth is a cutting-edge platform designed to bridge the gap between patients and medical professionals.
                        Our mission is to provide accessible, efficient, and personalized healthcare solutions through innovative technology and dedicated service.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-500'}`}>Version 1.0.0</span>
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
            {/* Promo Modal (Overlay) */}
            <AnimatePresence>
                {showPromoModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowPromoModal(false)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-5xl rounded-3xl"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <PricingCardTwo
                                    tone='emerald'
                                    icon={<Zap />}
                                    name='Early Assist'
                                    price={9}
                                    periodLabel='/mo'
                                    features={[
                                        { label: 'Priority matching' },
                                        { label: '24/7 nurse line' },
                                        { label: 'Basic insights' },
                                    ]}
                                    cta={{ onClick: () => handleSelectPlan({ key: 'EARLY_ASSISTANCE', name: 'Early Assist' }), label: 'Upgrade' }}
                                />
                                <PricingCardTwo
                                    tone='emerald'
                                    icon={<Star />}
                                    name='Personal Care'
                                    price={24}
                                    periodLabel='/mo'
                                    features={[
                                        { label: 'Dedicated doctor' },
                                        { label: 'Unlimited messaging' },
                                        { label: 'Advanced insights' },
                                    ]}
                                    cta={{ onClick: () => handleSelectPlan({ key: 'PERSONAL_ASSISTANCE', name: 'Personal Care' }), label: 'Upgrade' }}
                                />
                                <PricingCardTwo
                                    tone='emerald'
                                    icon={<Crown />}
                                    name='Wellness+'
                                    price={49}
                                    periodLabel='/mo'
                                    features={[
                                        { label: 'Everything included' },
                                        { label: 'In-home visits (select areas)' },
                                        { label: 'Genetic screening' },
                                    ]}
                                    cta={{ onClick: () => handleSelectPlan({ key: 'COMPREHENSIVE_PRIORITY', name: 'Wellness+' }), label: 'Upgrade' }}
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <BillingModal isOpen={!!billingPlan} onClose={() => setBillingPlan(null)} selectedPlan={billingPlan} onActivate={handleActivatePlan} />

            <AnimatePresence>
                {successBanner && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                                className="fixed top-20 right-8 z-[60] bg-[#10b981] text-white px-6 py-3 rounded-xl shadow-2xl font-bold text-sm flex items-center gap-3">
                        <CheckCircle2 style={{ width: 18, height: 18, minWidth: 18, minHeight: 18, flexShrink: 0 }} />
                        {successBanner}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── DYNAMIC CENTER VIEWPORT PANEL ── */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
                
                {/* Floating Logo Anchor */}
                <div className="absolute top-6 left-6 sm:left-8 z-50 pointer-events-none hidden sm:block">
                    <AuraHealthLogo size={36} />
                </div>

                {/* Gradient Navbar */}
                <div className="pt-2 sm:pt-6 px-2 sm:px-4 md:px-0 relative z-40">
                    <HoverGradientNavBar menuItems={navItems} />
                </div>

                <main className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 transition-colors duration-300 ${
                    isDark ? 'bg-transparent' : 'bg-transparent'
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
            </div>
        </div>
    )
}
