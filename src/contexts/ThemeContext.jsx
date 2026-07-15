import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        try {
            return localStorage.getItem('aura-theme') || 'dark'
        } catch {
            return 'dark'
        }
    })

    useEffect(() => {
        localStorage.setItem('aura-theme', theme)
        
        // Directly toggle .light-theme and .dark-theme on document.documentElement as requested
        if (theme === 'dark') {
            document.documentElement.classList.add('dark-theme')
            document.documentElement.classList.remove('light-theme')
            document.body.classList.add('bg-[#09090b]')
            document.body.classList.remove('bg-zinc-50')
        } else {
            document.documentElement.classList.add('light-theme')
            document.documentElement.classList.remove('dark-theme')
            document.body.classList.add('bg-zinc-50')
            document.body.classList.remove('bg-[#09090b]')
        }
    }, [theme])

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')
    const isDark = theme === 'dark'

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const ctx = useContext(ThemeContext)
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
    return ctx
}

export default ThemeContext
