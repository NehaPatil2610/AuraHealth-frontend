import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck, Heart, Stethoscope, Loader2, ArrowRight, ArrowLeft, BadgeCheck } from 'lucide-react'
import AuraHealthLogo from '../../components/AuraHealthLogo'
import { useAuth } from '../../contexts/AuthContext'

function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ minWidth: 18, minHeight: 18, flexShrink: 0 }}>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
    )
}

function AuthInput({ icon: Icon, type = 'text', placeholder, value, onChange, name, disabled }) {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'

    return (
        <div className="relative group">
            <Icon style={{ width: 16, height: 16, minWidth: 16, minHeight: 16, flexShrink: 0 }} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#10b981] transition-colors" />
            <input
                type={isPassword && showPassword ? 'text' : type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required
                disabled={disabled}
                className="w-full pl-11 pr-10 py-3.5 bg-[#09090b]/60 border border-[#27272a] rounded-xl text-sm text-white
                           placeholder-zinc-600 focus:outline-none focus:border-[#10b981]/50 focus:ring-1
                           focus:ring-[#10b981]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {isPassword && (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer"
                    tabIndex={-1}
                >
                    {showPassword
                        ? <EyeOff style={{ width: 16, height: 16, minWidth: 16, minHeight: 16, flexShrink: 0 }} />
                        : <Eye style={{ width: 16, height: 16, minWidth: 16, minHeight: 16, flexShrink: 0 }} />
                    }
                </button>
            )}
        </div>
    )
}

export default function AuthView({ initialMode = 'signin', onBackToLanding }) {
    const { loginWithGoogle, credentialLogin, credentialRegister, isLoading: contextLoading, authError, setAuthError } = useAuth()
    const [authMode, setAuthMode] = useState(initialMode)
    const [selectedRole, setSelectedRole] = useState('PATIENT')
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({ name: '', email: '', password: '' })

    const updateField = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const isSignUp = authMode === 'signup'
    const loading = isLoading || contextLoading

    // Surface an OAuth failure the backend signalled via ?error= on the
    // redirect-back, then strip the query so a refresh doesn't re-show it.
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        if (params.has('error')) {
            setAuthError('Google sign-in failed. Please try again or use email.')
            window.history.replaceState({}, '', window.location.pathname)
        }
    }, [setAuthError])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setAuthError(null)
        
        if (isSignUp) {
            await credentialRegister({ ...formData, role: selectedRole.toLowerCase() })
        } else {
            await credentialLogin(formData.email, formData.password)
        }
        setIsLoading(false)
    }

    return (
        <div className="h-screen w-screen bg-[#09090b] flex overflow-hidden font-sans select-none text-white">
            {/* Back to Landing */}
            {onBackToLanding && (
                <button
                    onClick={onBackToLanding}
                    className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3 py-2 text-sm text-zinc-500 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-zinc-800/40"
                >
                    <ArrowLeft style={{ width: 16, height: 16 }} />
                    Back
                </button>
            )}
            {/* Left Split Layout */}
            <div className="hidden lg:flex w-1/2 relative flex-col items-center justify-center p-12 border-r border-[#27272a] bg-[#09090b]">
                <div className="relative z-10 flex flex-col items-center max-w-md text-center space-y-8">
                    <AuraHealthLogo size={80} />
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="p-8 rounded-3xl border border-[#27272a] bg-[#18181b] shadow-2xl"
                    >
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <ShieldCheck style={{ width: 24, height: 24, minWidth: 24, minHeight: 24, flexShrink: 0 }} className="text-[#10b981]" />
                            <h2 className="text-2xl font-bold text-white tracking-tight">Precision Care Platform</h2>
                        </div>
                        <p className="text-base text-zinc-400 leading-relaxed">
                            Experience healthcare evolved. AuraHealth provides secure, priority-driven clinical workspaces and seamless telemetry.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right Split Layout */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-[#09090b]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-[420px] p-8 rounded-3xl border border-[#27272a] bg-[#18181b] shadow-2xl relative z-10"
                >
                    <div className="lg:hidden flex flex-col items-center text-center mb-8">
                        <AuraHealthLogo size={48} />
                        <h1 className="text-xl font-bold tracking-tight text-white mt-4">AuraHealth</h1>
                    </div>

                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-bold text-white tracking-tight">
                            {isSignUp ? 'Create Account' : 'Sign In'}
                        </h2>
                        <p className="text-sm text-zinc-500 mt-2">
                            {isSignUp ? 'Join the future of precision healthcare.' : 'Welcome back to your workspace.'}
                        </p>
                    </div>

                    <AnimatePresence>
                        {authError && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden mb-6"
                            >
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-center text-xs text-red-400 font-bold">
                                    {authError}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Role Selector */}
                    <div className="mb-6">
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => !loading && setSelectedRole('PATIENT')}
                                disabled={loading}
                                className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border transition-all cursor-pointer ${
                                    selectedRole === 'PATIENT'
                                        ? 'border-[#10b981]/50 bg-[#10b981]/10 text-[#10b981]'
                                        : 'border-[#27272a] bg-[#09090b]/40 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                                }`}
                            >
                                <Heart style={{ width: 16, height: 16, minWidth: 16, minHeight: 16, flexShrink: 0 }} />
                                <span className="text-sm font-semibold">Patient</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => !loading && setSelectedRole('DOCTOR')}
                                disabled={loading}
                                className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border transition-all cursor-pointer ${
                                    selectedRole === 'DOCTOR'
                                        ? 'border-[#10b981]/50 bg-[#10b981]/10 text-[#10b981]'
                                        : 'border-[#27272a] bg-[#09090b]/40 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                                }`}
                            >
                                <Stethoscope style={{ width: 16, height: 16, minWidth: 16, minHeight: 16, flexShrink: 0 }} />
                                <span className="text-sm font-semibold">Doctor</span>
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={loginWithGoogle}
                        disabled={loading}
                        type="button"
                        className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white hover:bg-zinc-100 text-zinc-900
                                   rounded-xl text-sm font-bold shadow-lg transition-all active:scale-[0.98] cursor-pointer mb-6
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <GoogleIcon />
                        <span>Continue with Google</span>
                    </button>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex-1 h-px bg-[#27272a]" />
                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">or continue with email</span>
                        <div className="flex-1 h-px bg-[#27272a]" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatePresence mode="wait">
                            {isSignUp && (
                                <motion.div
                                    key="signup-name"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="pb-4">
                                        <AuthInput
                                            icon={User}
                                            placeholder="Full Name"
                                            name="name"
                                            value={formData.name}
                                            onChange={updateField}
                                            disabled={loading}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AuthInput
                            icon={Mail}
                            type="email"
                            placeholder="Email Address"
                            name="email"
                            value={formData.email}
                            onChange={updateField}
                            disabled={loading}
                        />
                        <AuthInput
                            icon={Lock}
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={updateField}
                            disabled={loading}
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-[#10b981] hover:bg-emerald-400
                                       text-white rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(16,185,129,0.2)]
                                       transition-all active:scale-[0.98] mt-2 cursor-pointer"
                        >
                            {loading ? (
                                <Loader2 style={{ width: 18, height: 18, minWidth: 18, minHeight: 18, flexShrink: 0 }} className="animate-spin" />
                            ) : isSignUp ? (
                                <>
                                    <BadgeCheck style={{ width: 18, height: 18, minWidth: 18, minHeight: 18, flexShrink: 0 }} />
                                    Secure Account
                                </>
                            ) : (
                                <>
                                    Access Workspace
                                    <ArrowRight style={{ width: 18, height: 18, minWidth: 18, minHeight: 18, flexShrink: 0 }} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm">
                        <button
                            type="button"
                            onClick={() => { setAuthMode(isSignUp ? 'signin' : 'signup'); setAuthError(null); }}
                            disabled={loading}
                            className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
                        >
                            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
