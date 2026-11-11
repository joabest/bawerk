"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { translations, type Language, type Translation } from "./translations"

type I18nContextValue = { language: Language; setLanguage: (language: Language) => void; t: Translation }

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("pt-BR")

  useEffect(() => {
    const saved = window.localStorage.getItem("bawerk-language")
    if (saved === "en") setLanguageState("en")
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
    window.localStorage.setItem("bawerk-language", language)
    document.title = translations[language].seo.title
    document.querySelector('meta[name="description"]')?.setAttribute("content", translations[language].seo.description)
  }, [language])

  return (
    <I18nContext.Provider value={{ language, setLanguage: setLanguageState, t: translations[language] }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error("useI18n must be used within I18nProvider")
  return context
}
