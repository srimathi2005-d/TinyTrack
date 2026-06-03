import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

export const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ta', label: 'Tamil', flag: '🇮🇳' },
  { code: 'hi', label: 'Hindi', flag: '🇮🇳' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
]

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('tt-theme') || 'dark'
  })

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('tt-language') || 'en'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('tt-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.setAttribute('lang', language)
    localStorage.setItem('tt-language', language)
  }, [language])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const currentLanguage = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0]

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, language, setLanguage, LANGUAGES, currentLanguage }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
