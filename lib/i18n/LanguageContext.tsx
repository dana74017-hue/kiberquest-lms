"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { translations, type Locale } from "./translations";

interface LanguageContextType {
  locale: Locale;
  t: (key: string) => string;
  changeLanguage: (newLocale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // Получаем язык из URL
  const getLocaleFromPath = (): Locale => {
    const segments = pathname.split("/");
    const lang = segments[1] as Locale;
    return ["ru", "en", "kz"].includes(lang) ? lang : "ru";
  };

  const [locale, setLocale] = useState<Locale>(getLocaleFromPath());

  // Обновляем язык при смене URL
  useEffect(() => {
    setLocale(getLocaleFromPath());
  }, [pathname]);

  // Функция получения перевода
  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[locale];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key; // если перевода нет — возвращаем ключ
      }
    }

    return typeof value === "string" ? value : key;
  };

  // Смена языка
  const changeLanguage = (newLocale: Locale) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/");
    window.location.href = newPath;
  };

  return (
    <LanguageContext.Provider value={{ locale, t, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};