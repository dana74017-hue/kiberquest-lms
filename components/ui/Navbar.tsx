"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl border-b border-cyan-500/20">
      <div className="max-w-screen-2xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center text-2xl">🚀</div>
          <span className="text-2xl font-bold tracking-tighter">KiberQuest</span>
        </Link>

        {/* Навигация */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/courses" className="hover:text-cyan-400 transition-colors">Курсы</Link>
          <Link href="/editor" className="hover:text-cyan-400 transition-colors">Редактор</Link>
          <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">Кабинет</Link>
          <Link href="/quiz" className="hover:text-cyan-400 transition-colors">Квизы</Link>
          <Link href="/admin" className="hover:text-cyan-400 transition-colors">Админ</Link>
        </div>

        {/* Правая часть */}
        <div className="flex items-center gap-4">
          {user ? (
            // Когда пользователь залогинен
            <>
              <Link href="/dashboard" className="hidden md:block text-sm hover:text-cyan-400 transition-colors">
                {user.email}
              </Link>
              <Button onClick={handleLogout} variant="outline" size="sm" className="flex items-center gap-2">
                <LogOut size={16} />
                Выйти
              </Button>
            </>
          ) : (
            // Когда не залогинен
            <Link href="/login">
              <Button className="bg-cyan-500 hover:bg-cyan-400 text-black px-6">
                Войти
              </Button>
            </Link>
          )}

          {/* Мобильное меню */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>
    </nav>
  );
}