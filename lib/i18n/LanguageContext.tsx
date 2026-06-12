"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { translations, type Locale } from "./translations";

interface LanguageContextType {
  locale: Locale;
  t: (key: string) => string;
  changeLanguage: (newLocale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Получаем текущий язык из URL
  const getLocaleFromPath = (): Locale => {
    if (!pathname) return "ru";
    const segments = pathname.split("/");
    const lang = segments[1] as Locale;
    return ["ru", "en", "kz"].includes(lang) ? lang : "ru";
  };

  const [locale, setLocale] = useState<Locale>(getLocaleFromPath);

  // Обновляем язык при смене маршрута
  useEffect(() => {
    const newLocale = getLocaleFromPath();
    if (newLocale !== locale) {
      setLocale(newLocale);
    }
  }, [pathname]);

  // Функция получения перевода
  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[locale];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key; // если перевода нет — возвращаем ключ (для отладки)
      }
    }

    return typeof value === "string" ? value : key;
  };

  // Смена языка (без полной перезагрузки страницы)
  const changeLanguage = (newLocale: Locale) => {
    if (newLocale === locale) return;

    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/");

    router.push(newPath);
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