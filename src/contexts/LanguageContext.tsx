
import React, { createContext, useState, useContext, useEffect } from "react";
import { en } from "@/translations/en";
import { ar } from "@/translations/ar";

type Language = "ar" | "en";
type TranslationDictionary = Record<string, string>;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, any>) => string;
  toggleLanguage: () => void;
  isRTL: boolean;
}

const translations: Record<Language, TranslationDictionary> = {
  ar,
  en,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    return savedLanguage || "ar"; // Default to Arabic
  });

  const isRTL = language === "ar";

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };

  const toggleLanguage = () => {
    setLanguageState(prevLang => (prevLang === "ar" ? "en" : "ar"));
  };

  const t = (key: string, params?: Record<string, any>): string => {
    let text = translations[language][key] || key;

    if (params) {
      Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, params[param]);
      });
    }

    return text;
  };

  const value = {
    language,
    setLanguage,
    t,
    toggleLanguage,
    isRTL,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
