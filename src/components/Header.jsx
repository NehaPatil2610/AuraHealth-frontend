import { Bell, Moon, Sun } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header({ onOpenNotifications }) {
    const { isDark, toggleTheme } = useTheme()

    return (
        <header className={`h-16 shrink-0 border-b px-8 flex items-center justify-end z-30 transition-colors duration-300 ${
            isDark ? 'bg-[#09090b]/80 border-zinc-800/60 backdrop-blur-md' : 'bg-white/80 border-zinc-200 backdrop-blur-md'
        }`}>
            <div className="flex items-center gap-4">
                {/* Theme Toggle directly at top-right */}
                <button 
                    onClick={toggleTheme}
                    className={`relative p-2 rounded-full transition-colors cursor-pointer ${
                        isDark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-500'
                    }`}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={isDark ? 'dark' : 'light'}
                            initial={{ y: -20, opacity: 0, rotate: -90 }}
                            animate={{ y: 0, opacity: 1, rotate: 0 }}
                            exit={{ y: 20, opacity: 0, rotate: 90 }}
                            transition={{ duration: 0.2 }}
                        >
                            {isDark ? (
                                <Moon style={{ width: 20, height: 20, minWidth: 20, minHeight: 20, flexShrink: 0 }} />
                            ) : (
                                <Sun style={{ width: 20, height: 20, minWidth: 20, minHeight: 20, flexShrink: 0 }} />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </button>

                {/* Notification Bell */}
                <button 
                    onClick={onOpenNotifications}
                    className={`relative p-2 rounded-full transition-colors cursor-pointer ${
                        isDark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-500'
                    }`}
                >
                    <Bell style={{ width: 20, height: 20, minWidth: 20, minHeight: 20, flexShrink: 0 }} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-transparent"></span>
                </button>
            </div>
        </header>
    )
}
