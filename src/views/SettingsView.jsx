import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, Mail, User, ShieldCheck } from 'lucide-react'

export default function AuthView({ onLoginSuccess }) {
    const [isLogin, setIsLogin] = useState(true)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({ name: '', email: '', password: '' })

    const handleSubmit = (e) => {
        e.preventDefault()
        // For now, let's bypass to the dashboard instantly on submit!
        onLoginSuccess()
    }

    return (
        <div className="min-h-screen w-screen bg-[#09090b] flex items-center justify-center p-4 relative overflow-hidden font-sans text-zinc-50">

            {/* Decorative premium radial glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md bg-zinc-950 border border-zinc-900 rounded-2xl p-8 shadow-2xl relative z-10"
            >
                {/* Brand Header */}
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="h-12 w-12 rounded-xl bg-emerald-600 flex items-center justify-center mb-4 shadow-lg shadow-emerald-950">
                        <ShieldCheck className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">
                        {isLogin ? 'Welcome back' : 'Create an account'}
                    </h2>
                    <p className="text-sm text-zinc-500 mt-1.5 leading-relaxed">
                        {isLogin ? 'Enter your credentials to access the admin portal' : 'Get started with your clinical workstation dashboard'}
                    </p>
                </div>

                {/* Input Form Mesh */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-400">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                                <input
                                    type="text"
                                    required
                                    placeholder="Dr. Alexander"
                                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-white placeholder-zinc-600 transition-colors"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                            <input
                                type="email"
                                required
                                placeholder="admin@aurahealth.com"
                                className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-white placeholder-zinc-600 transition-colors"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                placeholder="••••••••"
                                className="w-full pl-10 pr-10 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-white placeholder-zinc-600 transition-colors"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-emerald-950/20 transition-all active:scale-[0.98] mt-2"
                    >
                        {isLogin ? 'Sign In to Dashboard' : 'Register Workstation'}
                    </button>
                </form>

                {/* Footer Toggle Switch */}
                <div className="mt-6 text-center text-sm">
          <span className="text-zinc-500">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
          </span>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-emerald-400 hover:underline font-medium transition-all"
                    >
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                </div>
            </motion.div>
        </div>
    )
}