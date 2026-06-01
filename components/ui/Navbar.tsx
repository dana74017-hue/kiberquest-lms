"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>("student");
  const pathname = usePathname();

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
    window.location.href = "/";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-screen-2xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center">
            <span className="text-black font-bold text-2xl">K</span>
          </div>
          <span className="font-bold text-2xl">KiberQuest</span>
        </Link>

        {/* Десктоп меню */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={`hover:text-cyan-400 transition-colors ${pathname === link.href ? "text-cyan-400" : "text-slate-300"}`}>
              {link.label}
            </Link>
          ))}

          {/* Вкладка Админ (только для админа и преподавателя) */}
          {isAdminOrTeacher && (
            <Link href="/admin" className={`font-medium hover:text-purple-400 transition-colors ${pathname.startsWith("/admin") ? "text-purple-400" : "text-slate-300"}`}>
              ⚙️ Админ
            </Link>
          )}
        </div>

        {/* Правая часть */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-slate-400">{user.email?.split("@")[0]}</span>
              <Button variant="ghost" onClick={handleLogout} className="text-red-400 hover:text-red-500">
                Выйти
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button>Войти</Button>
            </Link>
          )}
        </div>

        {/* Мобильное меню */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-slate-950">
            <div className="flex flex-col gap-6 mt-10">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="text-xl">
                  {link.label}
                </Link>
              ))}

              {isAdminOrTeacher && (
                <Link href="/admin" onClick={() => setIsOpen(false)} className="text-xl text-purple-400">
                  ⚙️ Админ-панель
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}