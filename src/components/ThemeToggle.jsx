import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export default function ThemeToggle() {
    const { theme, toggleTheme, isDark } = useTheme()

    return (
        <button
            onClick={toggleTheme}
            className={`relative h-9 w-9 rounded-xl flex items-center justify-center
                       border transition-all duration-300
                       cursor-pointer group ${
                isDark
                    ? 'bg-zinc-900/60 border-zinc-800/50 hover:border-emerald-500/30'
                    : 'bg-white border-zinc-200 hover:border-emerald-500/40 shadow-sm'
            }`}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
            <motion.div
                key={theme}
                initial={{ rotate: -90, scale: 0, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 90, scale: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
                {isDark ? (
                    <Moon className="h-4 w-4 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                ) : (
                    <Sun className="h-4 w-4 text-amber-500 group-hover:text-amber-400 transition-colors" />
                )}
            </motion.div>

            {/* Glow ring on hover */}
            <div className="absolute inset-0 rounded-xl bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-colors duration-300" />
        </button>
    )
}
