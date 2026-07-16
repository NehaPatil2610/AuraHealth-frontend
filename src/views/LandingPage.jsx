import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
    ArrowRight, Shield, Calendar, Stethoscope, BarChart3, Clock,
    Lock, ChevronRight, Star, Zap, Users, Activity, CheckCircle2,
    Menu, X, Heart, Globe, Sparkles, Play
} from 'lucide-react'
import AuraHealthLogo from '../components/AuraHealthLogo'
import DottedSurface from '../components/DottedSurface'
import { Footer } from '../components/ui/footer'

/* ─── Animation Variants ──────────────────────────────────── */
const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }
    })
}

const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
}

const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i = 0) => ({
        opacity: 1, scale: 1,
        transition: { duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }
    })
}

/* ─── Animated Counter Component ──────────────────────────── */
function AnimatedCounter({ end, suffix = '', prefix = '', duration = 2000 }) {
    const [count, setCount] = useState(0)
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })

    useEffect(() => {
        if (!isInView) return
        let start = 0
        const increment = end / (duration / 16)
        const timer = setInterval(() => {
            start += increment
            if (start >= end) {
                setCount(end)
                clearInterval(timer)
            } else {
                setCount(Math.floor(start))
            }
        }, 16)
        return () => clearInterval(timer)
    }, [isInView, end, duration])

    return (
        <span ref={ref}>
            {prefix}{count.toLocaleString()}{suffix}
        </span>
    )
}

/* ─── Section Wrapper ─────────────────────────────────────── */
function Section({ children, className = '', id }) {
    return (
        <section id={id} className={`landing-section relative ${className}`}>
            <div className="max-w-7xl mx-auto">
                {children}
            </div>
        </section>
    )
}

/* ─── Section Header ──────────────────────────────────────── */
function SectionHeader({ badge, title, subtitle }) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            className="text-center mb-16"
        >
            {badge && (
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wider uppercase mb-6">
                    <Sparkles style={{ width: 12, height: 12 }} />
                    {badge}
                </span>
            )}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                {title}
            </h2>
            {subtitle && (
                <p className="mt-4 text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                    {subtitle}
                </p>
            )}
        </motion.div>
    )
}

/* ─── Feature Data ────────────────────────────────────────── */
const FEATURES = [
    {
        icon: Shield,
        title: 'Secure Appointments',
        desc: 'End-to-end encrypted consultations with HIPAA-compliant data handling and audit trails.',
        gradient: 'from-emerald-500/20 to-teal-500/20',
    },
    {
        icon: Calendar,
        title: 'Smart Scheduling',
        desc: 'AI-powered slot optimization that adapts to patient demand and doctor availability in real-time.',
        gradient: 'from-cyan-500/20 to-blue-500/20',
    },
    {
        icon: Stethoscope,
        title: 'Doctor Workspace',
        desc: 'Unified clinical workstation with patient history, notes, prescriptions, and priority queuing.',
        gradient: 'from-violet-500/20 to-purple-500/20',
    },
    {
        icon: Zap,
        title: 'Priority Queuing',
        desc: 'Smart triage system that automatically prioritizes urgent cases while maintaining fairness.',
        gradient: 'from-amber-500/20 to-orange-500/20',
    },
    {
        icon: BarChart3,
        title: 'Real-time Analytics',
        desc: 'Live dashboards with patient flow metrics, revenue tracking, and operational intelligence.',
        gradient: 'from-rose-500/20 to-pink-500/20',
    },
    {
        icon: Lock,
        title: 'HIPAA Compliance',
        desc: 'Built-in compliance framework with automatic audit logging, access controls, and data encryption.',
        gradient: 'from-emerald-500/20 to-green-500/20',
    },
]

/* ─── Steps Data ──────────────────────────────────────────── */
const STEPS = [
    {
        num: '01',
        title: 'Create Your Profile',
        desc: 'Sign up as a patient or doctor. Complete your profile with secure verification in under 2 minutes.',
        icon: Users,
    },
    {
        num: '02',
        title: 'Book or Manage',
        desc: 'Patients find and book with top-rated doctors. Doctors manage their schedule, queue, and consultations.',
        icon: Calendar,
    },
    {
        num: '03',
        title: 'Experience Precision Care',
        desc: 'Real-time appointments, secure records, smart billing — healthcare that works seamlessly for everyone.',
        icon: Heart,
    },
]

/* ─── Testimonials Data ───────────────────────────────────── */
const TESTIMONIALS = [
    {
        quote: 'AuraHealth transformed our clinic. Patient wait times dropped 60% and our doctors finally have a system that works with them, not against them.',
        name: 'Dr. Priya Sharma',
        role: 'Chief of Medicine, MedVista Hospital',
        rating: 5,
    },
    {
        quote: 'The scheduling intelligence is remarkable. I can book appointments, view my history, and get prescriptions — all from one beautiful interface.',
        name: 'Arjun Mehta',
        role: 'Patient since 2024',
        rating: 5,
    },
    {
        quote: 'As an administrator, the analytics dashboard gives me visibility I never had. Revenue tracking, doctor utilization, patient satisfaction — all real-time.',
        name: 'Kavita Reddy',
        role: 'Operations Director, HealthBridge Network',
        rating: 5,
    },
]

/* ─── Pricing Data ────────────────────────────────────────── */
const PRICING = [
    {
        name: 'Starter',
        price: 'Free',
        period: 'forever',
        desc: 'Perfect for individual practitioners getting started.',
        features: [
            'Up to 50 appointments/month',
            'Basic scheduling',
            'Patient records',
            'Email support',
            'Standard encryption',
        ],
        cta: 'Start Free',
        highlighted: false,
    },
    {
        name: 'Professional',
        price: '$49',
        period: '/month',
        desc: 'For growing practices that need power and flexibility.',
        features: [
            'Unlimited appointments',
            'AI-powered scheduling',
            'Priority queuing system',
            'Real-time analytics dashboard',
            'HIPAA compliance suite',
            'Priority support (2hr SLA)',
            'Custom branding',
        ],
        cta: 'Start 14-day Trial',
        highlighted: true,
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        period: 'pricing',
        desc: 'For hospitals and multi-location health networks.',
        features: [
            'Everything in Professional',
            'Multi-location support',
            'Advanced analytics & BI',
            'SSO & SAML integration',
            'Dedicated account manager',
            'Custom SLA (99.99% uptime)',
            'On-premise deployment option',
        ],
        cta: 'Contact Sales',
        highlighted: false,
    },
]

/* ─── Nav Links ───────────────────────────────────────────── */
const NAV_LINKS = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Pricing', href: '#pricing' },
]

/* ═══════════════════════════════════════════════════════════
   LANDING PAGE COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function LandingPage({ onSignIn, onGetStarted }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollTo = (id) => {
        setMobileMenuOpen(false)
        document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <div className="min-h-screen text-white font-sans overflow-x-hidden">
            {/* ─── DOTTED SURFACE (fixed fullscreen, z-0 = animated background behind entire page) ─── */}
            <DottedSurface />

            {/* ─── NAVBAR ────────────────────────────────────── */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                scrolled ? 'glass-nav shadow-lg shadow-black/20' : 'bg-transparent'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 sm:h-20">
                        {/* Logo */}
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            <AuraHealthLogo size={32} />
                            <span className="text-lg font-bold tracking-tight text-white">AuraHealth</span>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-8">
                            {NAV_LINKS.map(link => (
                                <button
                                    key={link.href}
                                    onClick={() => scrollTo(link.href)}
                                    className="text-sm text-zinc-400 hover:text-white transition-colors font-medium cursor-pointer"
                                >
                                    {link.label}
                                </button>
                            ))}
                        </div>

                        {/* Desktop CTAs */}
                        <div className="hidden md:flex items-center gap-3">
                            <button
                                onClick={onSignIn}
                                className="px-5 py-2.5 text-sm font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={onGetStarted}
                                className="px-5 py-2.5 text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 active:scale-[0.97] cursor-pointer"
                            >
                                Get Started
                            </button>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        >
                            {mobileMenuOpen
                                ? <X style={{ width: 22, height: 22 }} />
                                : <Menu style={{ width: 22, height: 22 }} />
                            }
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden glass-nav overflow-hidden"
                        >
                            <div className="px-6 py-4 space-y-3">
                                {NAV_LINKS.map(link => (
                                    <button
                                        key={link.href}
                                        onClick={() => scrollTo(link.href)}
                                        className="block w-full text-left text-sm text-zinc-400 hover:text-white transition-colors font-medium py-2 cursor-pointer"
                                    >
                                        {link.label}
                                    </button>
                                ))}
                                <div className="flex gap-3 pt-3 border-t border-zinc-800/40">
                                    <button onClick={onSignIn} className="flex-1 py-2.5 text-sm font-semibold text-zinc-300 border border-zinc-700 rounded-xl cursor-pointer hover:bg-zinc-800/40 transition-colors">Sign In</button>
                                    <button onClick={onGetStarted} className="flex-1 py-2.5 text-sm font-bold bg-emerald-500 text-white rounded-xl cursor-pointer hover:bg-emerald-400 transition-colors">Get Started</button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* ─── HERO SECTION ──────────────────────────────── */}
            <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20 overflow-hidden z-[2]">
                {/* Subtle emerald radial glow — very low opacity so dots remain visible */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.04)_0%,_transparent_60%)] pointer-events-none" />

                <div className="relative z-10 text-center max-w-5xl mx-auto">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-widest uppercase mb-8">
                            <Activity style={{ width: 14, height: 14 }} />
                            Precision Care Platform — v2.0 Beta
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
                    >
                        <span className="gradient-text-hero">Healthcare</span>
                        <br />
                        <span className="text-white">Reimagined for the </span>
                        <span className="gradient-text">Modern Era</span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.6 }}
                        className="text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10"
                    >
                        Secure appointments, intelligent scheduling, real-time clinical workspaces — 
                        everything your practice needs in one{' '}
                        <span className="text-emerald-400 font-semibold">beautifully designed</span> platform.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <button
                            onClick={onGetStarted}
                            className="group flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl text-base font-bold shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.45)] transition-all active:scale-[0.97] cursor-pointer"
                        >
                            Start Free Trial
                            <ArrowRight style={{ width: 18, height: 18 }} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => scrollTo('#how-it-works')}
                            className="group flex items-center gap-2 px-8 py-4 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/50 rounded-2xl text-base font-semibold transition-all cursor-pointer"
                        >
                            <Play style={{ width: 16, height: 16 }} className="text-emerald-400" />
                            See How It Works
                        </button>
                    </motion.div>

                    {/* Floating Stats Badges */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1.2 }}
                        className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-16"
                    >
                        {[
                            { label: 'Active Patients', value: '50K+', icon: Users },
                            { label: 'Uptime SLA', value: '99.95%', icon: Activity },
                            { label: 'Licensed Doctors', value: '2,000+', icon: Stethoscope },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.4 + i * 0.15 }}
                                className="flex items-center gap-3 px-5 py-3 glass-card rounded-2xl"
                            >
                                <stat.icon style={{ width: 16, height: 16 }} className="text-emerald-400" />
                                <div className="text-left">
                                    <p className="text-sm font-bold text-white">{stat.value}</p>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{stat.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-6 h-10 rounded-full border-2 border-zinc-700 flex items-start justify-center p-1.5"
                    >
                        <div className="w-1.5 h-2.5 bg-emerald-400 rounded-full" />
                    </motion.div>
                </motion.div>
            </section>

            {/* ─── CONTENT SECTIONS (transparent so animated dots show behind the whole page) ─── */}
            <div className="relative z-[2]">

            {/* ─── SOCIAL PROOF BAR ──────────────────────────── */}
            <section className="relative py-12 border-y border-zinc-800/40 overflow-hidden">
                <div className="text-center mb-8">
                    <p className="text-xs text-zinc-600 uppercase tracking-[0.2em] font-semibold">
                        Trusted by leading healthcare institutions
                    </p>
                </div>
                <div className="flex animate-ticker-scroll whitespace-nowrap">
                    {[...Array(2)].map((_, dupeIdx) => (
                        <div key={dupeIdx} className="flex items-center gap-12 sm:gap-16 px-8">
                            {['MedVista Hospital', 'HealthBridge Network', 'CareFirst Clinics', 'NovaMed Solutions', 'PulsePoint Health', 'Zenith Medical Group', 'Apex Healthcare', 'VitalCore Systems'].map((name) => (
                                <span key={`${dupeIdx}-${name}`} className="text-zinc-600 text-sm font-semibold tracking-wider uppercase whitespace-nowrap">
                                    {name}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── FEATURES GRID ─────────────────────────────── */}
            <Section id="features">
                <SectionHeader
                    badge="Features"
                    title={<>Everything You Need to <span className="gradient-text">Deliver Precision Care</span></>}
                    subtitle="A complete suite of tools designed for modern healthcare practices — from intelligent scheduling to real-time analytics."
                />

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {FEATURES.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            custom={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-60px' }}
                            variants={scaleIn}
                            className="group glass-card rounded-2xl p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 cursor-default"
                        >
                            {/* Icon */}
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                                <feature.icon style={{ width: 22, height: 22 }} className="text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 tracking-tight">{feature.title}</h3>
                            <p className="text-sm text-zinc-400 leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </Section>

            {/* ─── HOW IT WORKS ───────────────────────────────── */}
            <Section id="how-it-works" className="bg-gradient-to-b from-transparent via-emerald-500/[0.03] to-transparent">
                <SectionHeader
                    badge="How It Works"
                    title={<>Get Started in <span className="gradient-text">Three Simple Steps</span></>}
                    subtitle="From signup to seamless healthcare management — we've made every step effortless."
                />

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connecting line (desktop) */}
                    <div className="hidden md:block absolute top-16 left-[17%] right-[17%] h-px bg-gradient-to-r from-emerald-500/30 via-emerald-500/50 to-emerald-500/30" />

                    {STEPS.map((step, i) => (
                        <motion.div
                            key={step.num}
                            custom={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-60px' }}
                            variants={fadeUp}
                            className="relative text-center"
                        >
                            {/* Step number circle */}
                            <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 mb-6 animate-glow-pulse">
                                <span className="text-xl font-extrabold gradient-text">{step.num}</span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                            <p className="text-sm text-zinc-400 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </Section>

            {/* ─── STATS SECTION ──────────────────────────────── */}
            <Section className="border-y border-zinc-800/40">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
                    {[
                        { value: 99.95, suffix: '%', label: 'Uptime SLA', icon: Activity },
                        { value: 50000, suffix: '+', label: 'Active Patients', icon: Users },
                        { value: 2000, suffix: '+', label: 'Licensed Doctors', icon: Stethoscope },
                        { value: 256, suffix: '-bit', label: 'AES Encryption', icon: Lock },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            custom={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-60px' }}
                            variants={fadeUp}
                            className="text-center"
                        >
                            <stat.icon style={{ width: 24, height: 24 }} className="text-emerald-400 mx-auto mb-4" />
                            <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold gradient-text mb-2">
                                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                            </p>
                            <p className="text-xs sm:text-sm text-zinc-500 uppercase tracking-wider font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </Section>

            {/* ─── TESTIMONIALS ───────────────────────────────── */}
            <Section id="testimonials">
                <SectionHeader
                    badge="Testimonials"
                    title={<>Loved by <span className="gradient-text">Healthcare Professionals</span></>}
                    subtitle="See what doctors, patients, and administrators have to say about AuraHealth."
                />

                <div className="grid md:grid-cols-3 gap-6">
                    {TESTIMONIALS.map((t, i) => (
                        <motion.div
                            key={t.name}
                            custom={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-60px' }}
                            variants={scaleIn}
                            className="glass-card rounded-2xl p-6 sm:p-7 flex flex-col"
                        >
                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                                {Array.from({ length: t.rating }).map((_, si) => (
                                    <Star key={si} style={{ width: 14, height: 14 }} className="text-amber-400 fill-amber-400" />
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-sm text-zinc-300 leading-relaxed flex-1 mb-6">
                                "{t.quote}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3 pt-4 border-t border-zinc-800/40">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
                                    {t.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">{t.name}</p>
                                    <p className="text-xs text-zinc-500">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Section>

            {/* ─── PRICING ────────────────────────────────────── */}
            <Section id="pricing" className="bg-gradient-to-b from-transparent via-emerald-500/[0.03] to-transparent">
                <SectionHeader
                    badge="Pricing"
                    title={<>Simple, <span className="gradient-text">Transparent Pricing</span></>}
                    subtitle="No hidden fees. Start free and scale as your practice grows."
                />

                <div className="grid md:grid-cols-3 gap-6 items-start">
                    {PRICING.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            custom={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-60px' }}
                            variants={scaleIn}
                            className={`relative rounded-2xl p-7 sm:p-8 flex flex-col transition-all duration-300 ${
                                plan.highlighted
                                    ? 'bg-gradient-to-b from-emerald-500/10 to-transparent border-2 border-emerald-500/40 animate-border-glow shadow-[0_0_40px_rgba(16,185,129,0.1)] md:-mt-4 md:mb-0'
                                    : 'glass-card'
                            }`}
                        >
                            {plan.highlighted && (
                                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                                    Most Popular
                                </span>
                            )}

                            <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                            <p className="text-xs text-zinc-500 mb-5">{plan.desc}</p>

                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                                <span className="text-sm text-zinc-500">{plan.period}</span>
                            </div>

                            <ul className="space-y-3 flex-1 mb-8">
                                {plan.features.map((f) => (
                                    <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-300">
                                        <CheckCircle2 style={{ width: 16, height: 16, minWidth: 16, flexShrink: 0 }} className="text-emerald-400 mt-0.5" />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={plan.highlighted ? onGetStarted : onSignIn}
                                className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all active:scale-[0.97] cursor-pointer ${
                                    plan.highlighted
                                        ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20'
                                        : 'bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/50'
                                }`}
                            >
                                {plan.cta}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </Section>

            {/* ─── CTA BANNER ─────────────────────────────────── */}
            <Section>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    variants={fadeUp}
                    className="relative overflow-hidden rounded-3xl p-10 sm:p-16 text-center bg-gradient-to-br from-emerald-500/10 via-[#18181b] to-teal-500/10 border border-emerald-500/20"
                >
                    {/* Decorative blurs */}
                    <div className="absolute top-0 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-teal-500/10 rounded-full blur-[80px] pointer-events-none" />

                    <div className="relative z-10">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
                            Ready to Transform Your Practice?
                        </h2>
                        <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto mb-8">
                            Join thousands of healthcare professionals already using AuraHealth to deliver precision care.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={onGetStarted}
                                className="group flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl text-base font-bold shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.45)] transition-all active:scale-[0.97] cursor-pointer"
                            >
                                Get Started for Free
                                <ArrowRight style={{ width: 18, height: 18 }} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={onSignIn}
                                className="flex items-center gap-2 px-8 py-4 text-zinc-400 hover:text-white text-base font-semibold transition-colors cursor-pointer"
                            >
                                Already have an account?
                                <ChevronRight style={{ width: 16, height: 16 }} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </Section>

            {/* ─── FOOTER ─────────────────────────────────────── */}
            <Footer 
                className="bg-transparent border-t border-zinc-800/40 relative z-10"
                onSubscribe={async (email) => {
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    return Math.random() > 0.3;
                }}
            />

            </div>{/* end opaque content wrapper */}
        </div>
    )
}
