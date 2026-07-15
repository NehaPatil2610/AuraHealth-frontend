import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FileText, Shield, HelpCircle, ChevronUp, Mail,
    Clock, BookOpen, Lock, Scale, ExternalLink
} from 'lucide-react'
import AuraHealthLogo from './AuraHealthLogo'
import { useTheme } from '../contexts/ThemeContext'

const FOOTER_SECTIONS = [
    {
        id: 'policies',
        label: 'Privacy & Policies',
        icon: Shield,
        items: [
            {
                title: 'Privacy Policy',
                description: 'All patient-doctor appointment data is encrypted end-to-end. Appointment records are strictly private between the involved parties. AuraHealth employs AES-256 encryption for all data at rest and TLS 1.3 for data in transit.',
                icon: Lock,
            },
            {
                title: 'Data Retention',
                description: 'Medical records are retained for 7 years per regulatory requirements. You may request data export or deletion at any time through your profile settings or by contacting our data protection officer.',
                icon: Clock,
            },
            {
                title: 'HIPAA Compliance',
                description: 'AuraHealth is fully HIPAA-compliant. All systems undergo quarterly security audits. Business Associate Agreements (BAAs) are in place with all third-party service providers.',
                icon: Shield,
            },
        ],
    },
    {
        id: 'terms',
        label: 'Terms of Service',
        icon: Scale,
        items: [
            {
                title: 'Clinical Standards',
                description: 'By using AuraHealth, you agree to our clinical data handling standards. All consultations are conducted by licensed, verified healthcare practitioners.',
                icon: FileText,
            },
            {
                title: 'Platform Usage',
                description: 'AuraHealth is intended for scheduling and managing medical consultations. It is not a replacement for emergency medical services. In case of emergency, please contact your local emergency number.',
                icon: BookOpen,
            },
            {
                title: 'Intellectual Property',
                description: 'All content, features, and functionality of AuraHealth — including algorithms, visual design, and the AuraHealth brand identity — are owned by AuraHealth Technologies and protected by copyright.',
                icon: Shield,
            },
        ],
    },
    {
        id: 'help',
        label: 'Help & Support',
        icon: HelpCircle,
        items: [
            {
                title: 'Contact Support',
                description: 'Reach us at support@aurahealth.io. Our support team is available Monday–Friday, 9 AM – 6 PM IST. Premium plan members receive priority response within 2 hours.',
                icon: Mail,
            },
            {
                title: 'Documentation',
                description: 'Visit docs.aurahealth.io for comprehensive API references, integration guides, developer SDKs, and frequently asked questions.',
                icon: BookOpen,
            },
            {
                title: 'System Status',
                description: 'Check real-time platform health and uptime at status.aurahealth.io. We maintain 99.95% uptime SLA for all production services.',
                icon: ExternalLink,
            },
        ],
    },
]

export default function Footer() {
    const [expandedSection, setExpandedSection] = useState(null)
    const { isDark } = useTheme()

    const toggleSection = (id) => {
        setExpandedSection(prev => prev === id ? null : id)
    }

    return (
        <footer className={`border-t transition-colors duration-300 ${
            isDark
                ? 'bg-[#0a0a0c] border-zinc-800/60'
                : 'bg-zinc-50 border-zinc-200'
        }`}>
            {/* ── Expandable Sections ─────────────────────────── */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                {FOOTER_SECTIONS.map(section => {
                    const SectionIcon = section.icon
                    const isExpanded = expandedSection === section.id

                    return (
                        <div key={section.id} className={`border-b last:border-b-0 ${
                            isDark ? 'border-zinc-800/40' : 'border-zinc-200'
                        }`}>
                            <button
                                onClick={() => toggleSection(section.id)}
                                className={`w-full flex items-center justify-between py-3.5 px-1
                                           transition-colors cursor-pointer group ${
                                    isDark
                                        ? 'text-zinc-400 hover:text-white'
                                        : 'text-zinc-500 hover:text-zinc-900'
                                }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <SectionIcon style={{ width: 14, height: 14, minWidth: 14, minHeight: 14, flexShrink: 0 }} />
                                    <span className="text-[13px] font-medium">{section.label}</span>
                                </div>
                                <motion.div
                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ChevronUp style={{ width: 14, height: 14, minWidth: 14, minHeight: 14, flexShrink: 0 }} className={isDark ? 'text-zinc-600' : 'text-zinc-400'} />
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pb-4 px-1 grid gap-2.5 sm:grid-cols-3">
                                            {section.items.map((item, idx) => {
                                                const ItemIcon = item.icon
                                                return (
                                                    <motion.div
                                                        key={idx}
                                                        initial={{ opacity: 0, y: 6 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: idx * 0.06 }}
                                                        className={`p-3.5 rounded-xl border transition-colors ${
                                                            isDark
                                                                ? 'bg-zinc-900/40 border-zinc-800/40 hover:border-zinc-700/60'
                                                                : 'bg-white border-zinc-200 hover:border-zinc-300'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <ItemIcon style={{ width: 13, height: 13, minWidth: 13, minHeight: 13, flexShrink: 0 }} className="text-emerald-500" />
                                                            <p className={`text-[12px] font-semibold ${
                                                                isDark ? 'text-white' : 'text-zinc-900'
                                                            }`}>{item.title}</p>
                                                        </div>
                                                        <p className={`text-[11px] leading-relaxed ${
                                                            isDark ? 'text-zinc-500' : 'text-zinc-500'
                                                        }`}>{item.description}</p>
                                                    </motion.div>
                                                )
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )
                })}
            </div>

            {/* ── Footer Bottom Bar ──────────────────────────── */}
            <div className={`border-t ${isDark ? 'border-zinc-800/40' : 'border-zinc-200'}`}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    {/* Brand */}
                    <div className="flex items-center gap-2.5">
                        <AuraHealthLogo size={18} />
                        <span className={`text-[12px] font-medium ${
                            isDark ? 'text-zinc-500' : 'text-zinc-500'
                        }`}>
                            © 2026 AuraHealth Technologies
                        </span>
                    </div>

                    {/* Version + Tagline */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 rounded-full">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" style={{ minWidth: 6, minHeight: 6, flexShrink: 0 }} />
                            <span className="text-[10px] font-semibold text-emerald-400">v2.0.0-beta</span>
                        </div>
                        <span className={`text-[10px] tracking-wider uppercase hidden sm:inline ${
                            isDark ? 'text-zinc-600' : 'text-zinc-400'
                        }`}>
                            Precision Care · Total Privacy
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
