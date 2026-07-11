import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    LayoutDashboard, Users, UserRound, Calendar,
    ListOrdered, Receipt, UserSquare, Sliders,
    BarChart3, Settings, Bell, LogOut
} from 'lucide-react'

import DashboardView from './views/DashboardView'
import AuthView from './views/AuthView' // Import the login component

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [currentView, setCurrentView] = useState('dashboard')

    const menuItems = [
        { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
        { id: 'patients', name: 'Patients', icon: Users },
        { id: 'doctors', name: 'Doctors', icon: UserRound },
        { id: 'calendar', name: 'Appointment Calendar', icon: Calendar },
        { id: 'queue', name: 'Queue Management', icon: ListOrdered },
        { id: 'billing', name: 'Billing & Invoice', icon: Receipt },
        { id: 'patient-profile', name: 'Patient Profile', icon: UserSquare },
        { id: 'doctor-profile', name: 'Doctor Profile', icon: UserSquare },
        { id: 'analytics', name: 'Reports & Analytics', icon: BarChart3 },
        { id: 'settings', name: 'Settings', icon: Settings },
    ]

    const renderView = () => {
        switch (currentView) {
            case 'dashboard':
                return <DashboardView />
            default:
                return (
                    <div className="text-zinc-400 p-6">
                        <h2 className="text-xl font-semibold capitalize text-white mb-2">{currentView.replace('-', ' ')}</h2>
                        <p className="text-sm text-zinc-500">Custom tailored layout modules coming here next.</p>
                    </div>
                )
        }
    }

    // If the user isn't logged in, intercept them with the premium Auth view
    if (!isAuthenticated) {
        return <AuthView onLoginSuccess={() => setIsAuthenticated(true)} />
    }

    return (
        <div className="flex h-screen w-screen bg-[#09090b] text-zinc-50 overflow-hidden font-sans select-none">

            {/* SIDEBAR NAVIGATION CONTROL PACK */}
            <aside className="w-64 border-r border-zinc-900 bg-[#09090b] flex flex-col justify-between p-4 z-10">
                <div>
                    <div className="flex items-center gap-3 px-2 py-4 mb-4">
                        <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold shadow-lg shadow-emerald-950 text-white">A</div>
                        <span className="text-lg font-bold tracking-tight text-white">AuraHealth</span>
                    </div>

                    <nav className="space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon
                            const isActive = currentView === item.id
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setCurrentView(item.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
                                        isActive ? 'text-emerald-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                                    }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="absolute inset-0 bg-zinc-900 border border-zinc-800 rounded-xl -z-10"
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                    <Icon className="h-4 w-4" />
                                    {item.name}
                                </button>
                            )
                        })}
                    </nav>
                </div>

                {/* Dynamic Log Out Session Block */}
                <button
                    onClick={() => setIsAuthenticated(false)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-zinc-500 hover:text-red-400 rounded-xl text-sm font-medium transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    Exit Workstation
                </button>
            </aside>

            {/* CORE DISPLAY WINDOW CANVAS */}
            <div className="flex-1 flex flex-col overflow-hidden">

                <header className="h-16 border-b border-zinc-900 px-8 flex items-center justify-between bg-[#09090b]/50 backdrop-blur-md">
                    <h1 className="text-sm font-medium tracking-wide text-zinc-400">System Controller</h1>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-zinc-400 hover:text-white transition-colors relative">
                            <Bell className="h-4 w-4" />
                            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        </button>
                        <div className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700" />
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-[#09090b] p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentView}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="h-full w-full"
                        >
                            {renderView()}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    )
}