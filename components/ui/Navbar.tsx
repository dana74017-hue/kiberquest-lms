"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, Sun, Moon, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/lib/supabase";
import { useTheme } from "next-themes";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>("student");
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        if (data) setUserRole(data.role);
      }
    });
  }, []);

  const isAdminOrTeacher = userRole === "admin" || userRole === "teacher";

  const navLinks = [
    { href: "/", label: "Главная" },
    { href: "/courses", label: "Курсы" },
    { href: "/editor", label: "Редактор" },
    { href: "/quiz", label: "Квизы" },
    { href: "/dashboard", label: "Кабинет" },
  ];

  const languages = [
    { code: "ru", label: "Рус" },
    { code: "en", label: "Eng" },
    { code: "kz", label: "Қаз" },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  // Простая смена языка (можно улучшить через next-intl)
  const changeLanguage = (locale: string) => {
    // Если используешь next-intl, раскомментируй:
    // router.push(pathname, { locale });
    alert(`Смена языка на: ${locale} (добавь логику next-intl)`);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-screen-2xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Логотип */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center">
            <span className="text-black font-bold text-2xl">K</span>
          </div>
          <span className="font-bold text-2xl">KiberQuest</span>
        </Link>

        {/* Десктоп меню */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-cyan-400 transition-colors ${pathname === link.href ? "text-cyan-400 font-medium" : "text-slate-300"}`}
            >
              {link.label}
            </Link>
          ))}

          {isAdminOrTeacher && (
            <Link href="/admin" className={`font-medium hover:text-purple-400 transition-colors ${pathname.startsWith("/admin") ? "text-purple-400" : "text-slate-300"}`}>
              ⚙️ Админ
            </Link>
          )}
        </div>

        {/* Правая часть десктопа */}
        <div className="hidden md:flex items-center gap-3">
          {/* Переключатель языка */}
          <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className="px-3 py-1 text-sm rounded-md hover:bg-slate-800 transition"
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Переключатель темы */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>

          {/* Пользователь */}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400 hidden lg:block">{user.email?.split("@")[0]}</span>
              <Button variant="ghost" onClick={handleLogout} className="text-red-400 hover:text-red-500">
                <LogOut size={18} />
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button>Войти</Button>
            </Link>
          )}
        </div>

        {/* Мобильное меню */}
<div className="md:hidden">
  <Sheet open={isOpen} onOpenChange={setIsOpen}>
    <SheetTrigger asChild>
      <Button variant="ghost" size="icon">
        <Menu className="w-6 h-6" />
      </Button>
    </SheetTrigger>

    <SheetContent side="right" className="bg-slate-950 w-80 p-0">
      <div className="flex flex-col h-full">
        
        {/* Верхняя часть с пользователем */}
        {user && (
          <div className="px-6 pt-8 pb-6 border-b border-slate-800">
            <p className="text-sm text-slate-400 truncate">{user.email}</p>
            <Button 
              variant="ghost" 
              onClick={handleLogout} 
              className="mt-3 -ml-3 text-red-400 hover:text-red-500 hover:bg-red-950/50"
            >
              <LogOut size={18} className="mr-2" /> Выйти
            </Button>
          </div>
        )}

        {/* Навигация */}
        <div className="px-2 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center px-4 py-3 text-lg rounded-xl mx-2 my-1 transition-colors ${
                pathname === link.href 
                  ? "bg-slate-900 text-cyan-400 font-medium" 
                  : "text-slate-200 hover:bg-slate-900"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {isAdminOrTeacher && (
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className={`flex items-center px-4 py-3 text-lg rounded-xl mx-2 my-1 transition-colors ${
                pathname.startsWith("/admin") 
                  ? "bg-purple-950 text-purple-400 font-medium" 
                  : "text-purple-300 hover:bg-purple-950/50"
              }`}
            >
              ⚙️ Админ-панель
            </Link>
          )}
        </div>

        {/* Нижняя часть — Язык и Тема */}
        <div className="mt-auto border-t border-slate-800 px-6 py-6 space-y-6">
          
          {/* Язык */}
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
              <Globe size={16} /> Язык
            </div>
            <div className="flex gap-2">
              {[
                { code: "ru", label: "Рус" },
                { code: "en", label: "Eng" },
                { code: "kz", label: "Қаз" },
              ].map((lang) => (
                <Button
                  key={lang.code}
                  variant="outline"
                  size="sm"
                  onClick={() => changeLanguage(lang.code)}
                  className="flex-1"
                >
                  {lang.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Тема */}
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
              Тема
            </div>
            <Button 
              variant="outline" 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-full justify-start"
            >
              {theme === "dark" ? "☀️ Светлая тема" : "🌙 Тёмная тема"}
            </Button>
          </div>
        </div>

      </div>
    </SheetContent>
  </Sheet>
</div>
      </div>
    </nav>
  );
}