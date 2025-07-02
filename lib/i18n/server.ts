import { cookies } from 'next/headers'
import { translations, TranslationKey, Language } from './translations'

export function getServerTranslation() {
  const cookieStore = cookies()
  const languageCookie = cookieStore.get('language')
  const language = (languageCookie?.value as Language) || 'en'
  
  // Ensure language is valid
  const validLanguage: Language = language === 'pt' ? 'pt' : 'en'
  
  return {
    t: (key: TranslationKey): string => {
      return translations[validLanguage][key] || key
    },
    language: validLanguage
  }
}

