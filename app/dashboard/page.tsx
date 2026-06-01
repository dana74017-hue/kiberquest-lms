"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white text-2xl">Загрузка...</div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center text-white text-2xl">Войдите в аккаунт</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-20 px-6">
      <div className="max-w-screen-2xl mx-auto">
        {/* Приветствие */}
        <div className="flex items-center gap-5 mb-12">
          <Avatar className="w-20 h-20 border-4 border-cyan-400">
            <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-blue-500 text-5xl">
              {user.email?.[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-5xl font-bold text-white">Добро пожаловать, {user.email?.split('@')[0]}!</h1>
            <p className="text-cyan-400 text-xl">Уровень: Начинающий разработчик</p>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-8">
          {/* Прогресс */}
          <div className="md:col-span-7">
            <h2 className="text-3xl font-semibold mb-8 text-white">Твой прогресс</h2>

            <div className="space-y-8">
              <Card className="bg-slate-900 border border-slate-700 p-7">
                <div className="flex justify-between mb-4">
                  <span className="font-medium text-lg text-white">HTML + CSS Основы</span>
                  <span className="font-bold text-cyan-400">85%</span>
                </div>
                <div className="h-5 bg-slate-800 rounded-2xl overflow-hidden">
                  <div className="h-5 w-[85%] bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl"></div>
                </div>
              </Card>

              <Card className="bg-slate-900 border border-slate-700 p-7">
                <div className="flex justify-between mb-4">
                  <span className="font-medium text-lg text-white">JavaScript с нуля</span>
                  <span className="font-bold text-cyan-400">40%</span>
                </div>
                <div className="h-5 bg-slate-800 rounded-2xl overflow-hidden">
                  <div className="h-5 w-[40%] bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl"></div>
                </div>
              </Card>

              <Card className="bg-slate-900 border border-slate-700 p-7">
                <div className="flex justify-between mb-4">
                  <span className="font-medium text-lg text-white">React для начинающих</span>
                  <span className="font-bold text-cyan-400">15%</span>
                </div>
                <div className="h-5 bg-slate-800 rounded-2xl overflow-hidden">
                  <div className="h-5 w-[15%] bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl"></div>
                </div>
              </Card>
            </div>
          </div>

          {/* Статистика */}
          <div className="md:col-span-5 space-y-6">
            <Card className="bg-slate-900 border border-slate-700 p-8 text-center">
              <div className="text-8xl mb-4">🏆</div>
              <h3 className="text-7xl font-bold text-cyan-400">14</h3>
              <p className="text-slate-300 text-2xl">Часов в обучении</p>
            </Card>

            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-slate-900 border border-slate-700 p-6 text-center">
                <div className="text-6xl mb-3">🔥</div>
                <p className="text-5xl font-bold text-orange-400">7</p>
                <p className="text-slate-400 text-sm mt-1">дней подряд</p>
              </Card>
              <Card className="bg-slate-900 border border-slate-700 p-6 text-center">
                <div className="text-6xl mb-3">📚</div>
                <p className="text-5xl font-bold text-emerald-400">23</p>
                <p className="text-slate-400 text-sm mt-1">урока</p>
              </Card>
              <Card className="bg-slate-900 border border-slate-700 p-6 text-center">
                <div className="text-6xl mb-3">⭐</div>
                <p className="text-5xl font-bold text-yellow-400">1240</p>
                <p className="text-slate-400 text-sm mt-1">баллов</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}