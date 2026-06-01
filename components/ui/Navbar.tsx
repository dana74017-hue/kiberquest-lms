"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  // Проверка авторизации
  useState(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  });

  const navLinks = [
    { href: "/", label: "Главная" },
    { href: "/courses", label: "Курсы" },
    { href: "/editor", label: "Редактор" },
    { href: "/quiz", label: "Квизы" },
    { href: "/dashboard", label: "Личный кабинет" },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-screen-2xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Логотип */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center">
            <span className="text-black font-bold text-xl">K</span>
          </div>
          <span className="font-bold text-2xl text-white">KiberQuest</span>
        </Link>

        {/* Десктоп меню */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-cyan-400 ${
                pathname === link.href ? "text-cyan-400" : "text-slate-300"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Правая часть (десктоп) */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400">{user.email?.split("@")[0]}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-400 hover:text-red-500">
                <LogOut className="w-4 h-4 mr-2" /> Выйти
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button className="bg-white text-black hover:bg-cyan-400">Войти</Button>
            </Link>
          )}
        </div>

        {/* Мобильное меню (Гамбургер) */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-slate-950 border-slate-800 w-72 p-0">
              <div className="flex flex-col h-full">
                {/* Заголовок мобильного меню */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                  <span className="font-bold text-xl text-white">Меню</span>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Ссылки */}
                <div className="flex flex-col p-6 gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`px-4 py-3 rounded-2xl text-lg transition-colors ${
                        pathname === link.href 
                          ? "bg-slate-800 text-cyan-400" 
                          : "text-slate-200 hover:bg-slate-900"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Кнопки авторизации в мобильном меню */}
                <div className="mt-auto p-6 border-t border-slate-800">
                  {user ? (
                    <div className="space-y-3">
                      <div className="text-sm text-slate-400 px-2">{user.email}</div>
                      <Button 
                        onClick={handleLogout} 
                        className="w-full bg-red-500/10 text-red-400 hover:bg-red-500/20"
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Выйти из аккаунта
                      </Button>
                    </div>
                  ) : (
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-white text-black hover:bg-cyan-400">
                        Войти в аккаунт
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}