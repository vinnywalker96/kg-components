'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language, TranslationKey, translations } from './translations'
import Cookies from 'js-cookie'

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialize with browser language or default to English
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    // Try to get the language from localStorage
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'pt')) {
      setLanguageState(savedLanguage)
      // Also set cookie for server-side rendering
      Cookies.set('language', savedLanguage, { path: '/' })
    } else {
      // Try to detect browser language
      const browserLanguage = navigator.language.split('-')[0]
      if (browserLanguage === 'pt') {
        setLanguageState('pt')
        localStorage.setItem('language', 'pt')
        Cookies.set('language', 'pt', { path: '/' })
      } else {
        // Default to English for any other language
        setLanguageState('en')
        localStorage.setItem('language', 'en')
        Cookies.set('language', 'en', { path: '/' })
      }
    }
  }, [])

  // Update language and save to localStorage and cookie
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    localStorage.setItem('language', newLanguage)
    // Set cookie for server-side rendering
    Cookies.set('language', newLanguage, { path: '/' })
    
    // Force a page refresh to ensure all server components update
    // This is needed because server components won't re-render with client state changes
    window.location.reload()
  }

  // Translation function
  const t = (key: TranslationKey): string => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
