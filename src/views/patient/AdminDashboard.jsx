import { motion } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'
import { Activity, Users, ShieldCheck, Database, Server, RefreshCw } from 'lucide-react'

export default function AdminDashboard() {
    const { isDark } = useTheme()

    const metrics = [
        { title: 'Total Consultations', value: '14,239', icon: Activity, trend: '+12%' },
        { title: 'Active Practitioners', value: '342', icon: Users, trend: '+4%' },
        { title: 'System Uptime', value: '99.99%', icon: Server, trend: 'Stable' },
        { title: 'Database Health', value: 'Optimal', icon: Database, trend: 'Synced' },
    ]

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                        System Overview
                    </h2>
                    <p className={`text-sm mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        Real-time telemetry and access control matrices.
                    </p>
                </div>
                <button className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-900 shadow-sm'
                }`}>
                    <RefreshCw style={{ width: 16, height: 16, minWidth: 16, minHeight: 16, flexShrink: 0 }} />
                    Refresh Metrics
                </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((m, idx) => {
                    const Icon = m.icon
                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`p-5 rounded-2xl border ${
                                isDark ? 'bg-[#18181b] border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-2 rounded-lg ${
                                    isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                                }`}>
                                    <Icon style={{ width: 20, height: 20, minWidth: 20, minHeight: 20, flexShrink: 0 }} />
                                </div>
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                    isDark ? 'bg-zinc-800 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                                }`}>
                                    {m.trend}
                                </span>
                            </div>
                            <h3 className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-zinc-900'}`}>{m.value}</h3>
                            <p className={`text-sm font-medium ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>{m.title}</p>
                        </motion.div>
                    )
                })}
            </div>

            {/* Approvals Panel */}
            <div className={`p-6 rounded-2xl border ${
                isDark ? 'bg-[#18181b] border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
            }`}>
                <div className="flex items-center gap-3 mb-6">
                    <ShieldCheck style={{ width: 24, height: 24, minWidth: 24, minHeight: 24, flexShrink: 0 }} className="text-emerald-500" />
                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>Pending Doctor Approvals</h3>
                </div>
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`flex items-center justify-between p-4 rounded-xl border flex-wrap sm:flex-nowrap gap-4 ${
                            isDark ? 'border-zinc-800 bg-zinc-900/50' : 'border-zinc-100 bg-zinc-50'
                        }`}>
                            <div className="flex items-center gap-4 min-w-0">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                                    isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-200 text-zinc-700'
                                }`}>DR</div>
                                <div className="min-w-0">
                                    <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-zinc-900'}`}>Dr. Sarah Jenkins</p>
                                    <p className={`text-xs truncate ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>License: MED-89420 • Cardiology</p>
                                </div>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer">
                                    Verify
                                </button>
                                <button className={`flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                                    isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700'
                                }`}>
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
