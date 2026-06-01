"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [progress, setProgress] = useState([
    { name: "HTML + CSS Основы", percent: 85, color: "from-cyan-400 to-blue-500" },
    { name: "JavaScript с нуля", percent: 40, color: "from-purple-400 to-pink-500" },
    { name: "React для начинающих", percent: 15, color: "from-emerald-400 to-cyan-500" },
  ]);
  const [stats, setStats] = useState({ hours: 14, streak: 7, lessons: 23, points: 1240 });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const updateProgress = (index: number, newPercent: number) => {
    const updated = [...progress];
    updated[index].percent = newPercent;
    setProgress(updated);
    alert(`Прогресс по "${updated[index].name}" обновлён до ${newPercent}%`);
  };

  const completeLesson = () => {
    setStats(prev => ({
      hours: prev.hours + 1,
      streak: prev.streak + 1,
      lessons: prev.lessons + 1,
      points: prev.points + 50
    }));
    alert("🎉 Урок засчитан! +1 час, +50 баллов");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-20 px-6">
      <div className="max-w-screen-2xl mx-auto">
        {/* Приветствие */}
        <div className="flex items-center gap-6 mb-12">
          <Avatar className="w-24 h-24 border-4 border-cyan-400">
            <AvatarFallback className="text-5xl bg-gradient-to-br from-cyan-400 to-blue-500">
              {user?.email?.[0]?.toUpperCase() || "D"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-5xl font-bold">Добро пожаловать, {user?.email?.split('@')[0]}!</h1>
            <p className="text-cyan-400 text-xl">Уровень: Начинающий разработчик • 1240 баллов</p>
          </div>
          <Button onClick={completeLesson} className="ml-auto bg-emerald-500 hover:bg-emerald-600">
            ✅ Завершить урок (+50 баллов)
          </Button>
        </div>

        <div className="grid md:grid-cols-12 gap-8">
          {/* Прогресс */}
          <div className="md:col-span-7 space-y-6">
            <h2 className="text-3xl font-semibold">Твой прогресс</h2>
            {progress.map((course, i) => (
              <Card key={i} className="bg-slate-900 border-slate-700 p-6">
                <div className="flex justify-between mb-3">
                  <span className="font-medium">{course.name}</span>
                  <span className="font-bold text-cyan-400">{course.percent}%</span>
                </div>
                <Progress value={course.percent} className="h-3" />
                <Button 
                  size="sm" 
                  className="mt-3"
                  onClick={() => updateProgress(i, Math.min(100, course.percent + 10))}
                >
                  +10% (Продолжить обучение)
                </Button>
              </Card>
            ))}
          </div>

          {/* Статистика */}
          <div className="md:col-span-5 space-y-6">
            <Card className="bg-slate-900 border-slate-700 p-8 text-center">
              <div className="text-7xl mb-2">🏆</div>
              <h3 className="text-7xl font-bold text-cyan-400">{stats.hours}</h3>
              <p className="text-slate-400 text-xl">Часов в обучении</p>
            </Card>

            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-slate-900 border-slate-700 p-6 text-center">
                <div className="text-5xl mb-2">🔥</div>
                <p className="text-5xl font-bold text-orange-400">{stats.streak}</p>
                <p className="text-sm text-slate-400">дней подряд</p>
              </Card>
              <Card className="bg-slate-900 border-slate-700 p-6 text-center">
                <div className="text-5xl mb-2">📚</div>
                <p className="text-5xl font-bold text-emerald-400">{stats.lessons}</p>
                <p className="text-sm text-slate-400">уроков</p>
              </Card>
              <Card className="bg-slate-900 border-slate-700 p-6 text-center">
                <div className="text-5xl mb-2">⭐</div>
                <p className="text-5xl font-bold text-yellow-400">{stats.points}</p>
                <p className="text-sm text-slate-400">баллов</p>
              </Card>
            </div>

            <Button onClick={() => {
              setStats(prev => ({ ...prev, points: prev.points + 100 }));
              alert("🎁 +100 бонусных баллов за активность!");
            }} className="w-full py-6 text-lg">
              Получить бонус (+100 баллов)
            </Button>
          </div>
        </div>

        <div className="mt-12 flex gap-4 justify-center">
          <Button size="lg" onClick={() => window.location.href = "/courses"}>Продолжить обучение</Button>
          <Button size="lg" variant="outline" onClick={() => window.location.href = "/quiz"}>Пройти квиз</Button>
          <Button size="lg" variant="outline" onClick={() => window.location.href = "/editor"}>Открыть редактор</Button>
        </div>
      </div>
    </div>
  );
}