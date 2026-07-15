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

        // The stylesheet keys every light-mode rule off [data-theme="light"],
        // so the attribute MUST be set (the old class toggle did nothing).
        document.documentElement.setAttribute('data-theme', theme)
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
