"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, LogOut, Sun, Moon, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/lib/supabase";
import { useTheme } from "next-themes";

interface Language {
  code: string;
  label: string;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>("student");
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const getCurrentLocale = () => {
    const segments = pathname.split("/");
    const lang = segments[1];
    return ["ru", "en", "kz"].includes(lang) ? lang : "ru";
  };

  const currentLocale = getCurrentLocale();

  const languages: Language[] = [
    { code: "ru", label: "Рус" },
    { code: "en", label: "Eng" },
    { code: "kz", label: "Қаз" },
  ];

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push(`/${currentLocale}`);
    setIsOpen(false);
  };

  const changeLanguage = (newLocale: string) => {
    if (newLocale === currentLocale) return;

    const segments = pathname.split("/");
    if (segments.length < 2) {
      router.push(`/${newLocale}`);
    } else {
      segments[1] = newLocale;
      const newPath = segments.join("/");
      router.push(newPath);
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur-md border-border">
      <div className="max-w-screen-2xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Логотип */}
        <Link href={`/${currentLocale}`} className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center">
            <span className="text-black font-bold text-2xl">K</span>
          </div>
          <span className="font-bold text-2xl">KiberQuest</span>
        </Link>

        {/* Десктоп меню */}
        <div className="hidden md:flex items-center gap-2 text-sm">
          {navLinks.map((link) => {
            const fullHref = link.href === "/" 
              ? `/${currentLocale}` 
              : `/${currentLocale}${link.href}`;

            return (
              <Link
                key={link.href}
                href={fullHref}
                className={`px-5 py-2.5 rounded-lg text-base transition-colors hover:bg-muted ${
                  pathname === fullHref 
                    ? "text-primary font-medium" 
                    : "text-foreground/80"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {isAdminOrTeacher && (
            <Link
              href={`/${currentLocale}/admin`}
              className="px-5 py-2.5 rounded-lg text-base hover:bg-muted text-purple-400"
            >
              ⚙️ Админ
            </Link>
          )}
        </div>

        {/* Правая часть десктопа */}
        <div className="hidden md:flex items-center gap-3">
          {/* Язык */}
          <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`px-4 py-2 text-sm rounded-lg transition ${
                  currentLocale === lang.code 
                    ? "bg-background text-foreground font-medium" 
                    : "hover:bg-background text-muted-foreground"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Тема */}
          <Button
            variant="ghost"
            size="lg"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-12 w-12"
          >
            {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
          </Button>

          {/* Пользователь */}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden lg:block">
                {user.email?.split("@")[0]}
              </span>
              <Button 
                variant="ghost" 
                size="lg" 
                onClick={handleLogout} 
                className="text-red-500 h-12 w-12"
              >
                <LogOut size={20} />
              </Button>
            </div>
          ) : (
            <Link href={`/${currentLocale}/login`}>
              <Button size="lg">Войти</Button>
            </Link>
          )}
        </div>

        {/* Мобильное меню */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="lg" className="h-12 w-12">
                <Menu className="w-7 h-7" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="bg-background w-80 p-0">
              <div className="flex flex-col h-full pt-8">
                {/* Информация о пользователе */}
                {user && (
                  <div className="px-6 pb-6 border-b">
                    <p className="text-base text-muted-foreground">{user.email}</p>
                    <Button 
                      variant="ghost" 
                      onClick={handleLogout} 
                      className="mt-3 text-red-500 text-lg w-full justify-start"
                    >
                      Выйти
                    </Button>
                  </div>
                )}

                {/* Навигация */}
                <div className="px-2 py-4">
                  {navLinks.map((link) => {
                    const fullHref = link.href === "/" 
                      ? `/${currentLocale}` 
                      : `/${currentLocale}${link.href}`;

                    return (
                      <Link
                        key={link.href}
                        href={fullHref}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center px-5 py-5 text-xl rounded-2xl hover:bg-muted"
                      >
                        {link.label}
                      </Link>
                    );
                  })}

                  {isAdminOrTeacher && (
                    <Link
                      href={`/${currentLocale}/admin`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-5 py-5 text-xl rounded-2xl hover:bg-muted text-purple-400"
                    >
                      ⚙️ Админ-панель
                    </Link>
                  )}
                </div>

                {/* Кнопка "Войти" для неавторизованных пользователей */}
                {!user && (
                  <div className="px-6 py-4">
                    <Link href={`/${currentLocale}/login`} onClick={() => setIsOpen(false)}>
                      <Button className="w-full py-6 text-lg">Войти</Button>
                    </Link>
                  </div>
                )}

                {/* Нижняя часть — Язык и Тема */}
                <div className="mt-auto p-6 border-t space-y-6">
                  <div>
                    <div className="flex items-center gap-2 text-base text-muted-foreground mb-4">
                      <Globe size={20} /> Язык
                    </div>
                    <div className="flex gap-3">
                      {languages.map((lang) => (
                        <Button
                          key={lang.code}
                          variant={currentLocale === lang.code ? "default" : "outline"}
                          size="lg"
                          onClick={() => changeLanguage(lang.code)}
                          className="flex-1 py-6 text-base"
                        >
                          {lang.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full justify-start py-6 text-base"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  >
                    {theme === "dark" ? "☀️ Светлая тема" : "🌙 Тёмная тема"}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}