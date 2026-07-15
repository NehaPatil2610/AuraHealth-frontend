import { motion } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'
import { Activity, Shield, Lock, Server, Cpu, HeartPulse } from 'lucide-react'

export default function AboutAuraHealth() {
    const { isDark } = useTheme()

    const features = [
        {
            title: 'Multi-Factor Queue Prioritization',
            icon: Activity,
            description: 'Our proprietary algorithm analyzes patient history, urgency signals, and practitioner availability to dynamically sort the care queue, ensuring critical cases are seen first without manual triage.',
        },
        {
            title: 'End-to-End Data Isolation',
            icon: Lock,
            description: 'AuraHealth employs strict tenant-level isolation. Each patient-doctor interaction is encrypted using AES-256 at rest, meaning even platform administrators cannot read clinical notes or diagnostics.',
        },
        {
            title: 'Distributed Gateway Architecture',
            icon: Server,
            description: 'Traffic is routed through a reactive Spring Cloud Gateway, providing seamless OAuth2 termination, rate limiting, and secure internal key exchange before touching the core clinical monolith.',
        },
        {
            title: 'Real-Time Telemetry',
            icon: Cpu,
            description: 'Administrators have access to real-time metrics including queue depths, consultation durations, and system health, enabling proactive scaling and resource allocation.',
        },
    ]

    return (
        <div className="max-w-4xl mx-auto py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-emerald-500/10 text-emerald-500">
                    <HeartPulse size={32} />
                </div>
                <h1 className={`text-4xl font-bold tracking-tight mb-4 ${
                    isDark ? 'text-white' : 'text-zinc-900'
                }`}>
                    Precision Care Platform
                </h1>
                <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${
                    isDark ? 'text-zinc-400' : 'text-zinc-600'
                }`}>
                    AuraHealth is engineered to bridge the gap between advanced clinical operations and 
                    uncompromising patient privacy. Discover how our architecture protects and serves.
                </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
                {features.map((feature, idx) => {
                    const Icon = feature.icon
                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`p-6 rounded-2xl border transition-all ${
                                isDark 
                                    ? 'bg-[#18181b] border-zinc-800/80 hover:border-emerald-500/30' 
                                    : 'bg-white border-zinc-200 hover:border-emerald-500/30 shadow-sm'
                            }`}
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                                isDark ? 'bg-zinc-800 text-emerald-400' : 'bg-zinc-100 text-emerald-600'
                            }`}>
                                <Icon size={24} />
                            </div>
                            <h3 className={`text-lg font-semibold mb-2 ${
                                isDark ? 'text-white' : 'text-zinc-900'
                            }`}>
                                {feature.title}
                            </h3>
                            <p className={`text-sm leading-relaxed ${
                                isDark ? 'text-zinc-400' : 'text-zinc-600'
                            }`}>
                                {feature.description}
                            </p>
                        </motion.div>
                    )
                })}
            </div>
            
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className={`mt-16 p-8 rounded-2xl border text-center ${
                    isDark ? 'bg-zinc-900/50 border-zinc-800/80' : 'bg-zinc-50 border-zinc-200'
                }`}
            >
                <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    Technical Stack
                </h4>
                <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    React (Vite + Tailwind CSS v4 + Framer Motion) • Spring Cloud Gateway • Spring Boot • MySQL & Flyway
                </p>
            </motion.div>
        </div>
    )
}
