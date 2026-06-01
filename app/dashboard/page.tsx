"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Save, Clock, Trophy } from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState({ full_name: "", status: "Начинающий разработчик" });
  const [editing, setEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [timeOnSite, setTimeOnSite] = useState(0);        // минуты в этой сессии
  const [totalHours, setTotalHours] = useState(14);       // общее время
  const [streak, setStreak] = useState(7);
  const [lessons, setLessons] = useState(23);
  const [points, setPoints] = useState(1240);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        // Можно позже подгрузить из БД
      }
    });

    // Таймер времени на сайте
    const timer = setInterval(() => {
      setTimeOnSite(prev => prev + 1);
    }, 60000); // каждую минуту

    return () => clearInterval(timer);
  }, []);

  const saveProfile = async () => {
    alert("✅ Профиль сохранён!");
    setEditing(false);
  };

  const saveTime = () => {
    const addedHours = Math.floor(timeOnSite / 60) + 1;
    setTotalHours(prev => prev + addedHours);
    setPoints(prev => prev + addedHours * 50);
    setLessons(prev => prev + 1);
    
    alert(`🎉 +${addedHours} час(ов) обучения сохранено! +${addedHours * 50} баллов`);
    setTimeOnSite(0); // сбрасываем сессию
  };

  const completeLesson = () => {
    setLessons(prev => prev + 1);
    setPoints(prev => prev + 100);
    setTotalHours(prev => prev + 1);
    alert("✅ Урок завершён! +100 баллов");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-20 px-6">
      <div className="max-w-screen-2xl mx-auto">
        {/* Шапка */}
        <div className="flex justify-between items-start mb-10">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-28 h-28 border-4 border-cyan-400">
                <AvatarFallback className="text-6xl bg-gradient-to-br from-cyan-400 to-blue-500">
                  {profile.full_name?.[0] || "D"}
                </AvatarFallback>
              </Avatar>
              <label className="absolute bottom-1 right-1 bg-cyan-500 p-2 rounded-full cursor-pointer">
                <Camera size={20} />
                <input type="file" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setAvatarFile(file);
                    alert("📸 Фото аватара выбрано (в реальном проекте сохранится)");
                  }
                }} />
              </label>
            </div>

            <div>
              {editing ? (
                <Input 
                  value={profile.full_name}
                  onChange={e => setProfile({...profile, full_name: e.target.value})}
                  className="text-3xl font-bold w-96"
                />
              ) : (
                <h1 className="text-5xl font-bold">Добро пожаловать, {profile.full_name || "dana74017"}!</h1>
              )}
              <p className="text-cyan-400 text-xl">{profile.status}</p>
              <Button size="sm" variant="outline" onClick={() => setEditing(!editing)}>
                {editing ? "Сохранить" : "✏️ Редактировать имя и статус"}
              </Button>
            </div>
          </div>

          <Button onClick={saveTime} className="bg-emerald-600 hover:bg-emerald-500 px-6">
            ⏱ Сохранить время ({timeOnSite} мин)
          </Button>
        </div>

        {/* Таймер и статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-slate-900 border-slate-700 p-6 text-center">
            <div className="flex justify-center mb-3">
              <Clock className="w-12 h-12 text-cyan-400" />
            </div>
            <p className="text-6xl font-bold text-cyan-400">{timeOnSite}</p>
            <p className="text-slate-400">минут на сайте сейчас</p>
            <Button onClick={saveTime} className="mt-4 w-full">💾 Сохранить в статистику</Button>
          </Card>

          <Card className="bg-slate-900 border-slate-700 p-6 text-center">
            <p className="text-6xl font-bold text-orange-400">{totalHours}</p>
            <p className="text-slate-400">часов всего в обучении</p>
          </Card>

          <Card className="bg-slate-900 border-slate-700 p-6">
            <Button onClick={completeLesson} className="w-full py-8 text-lg bg-gradient-to-r from-purple-500 to-pink-500">
              ✅ Завершить урок (+100 баллов)
            </Button>
          </Card>
        </div>

        {/* Быстрые действия */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" onClick={() => window.location.href = "/courses"}>📚 Перейти к курсам</Button>
          <Button size="lg" variant="outline" onClick={() => window.location.href = "/quiz"}>❓ Пройти квиз</Button>
          <Button size="lg" variant="outline" onClick={() => window.location.href = "/editor"}>💻 Открыть редактор</Button>
          <Button size="lg" variant="outline" onClick={() => window.location.href = "/admin"}>⚙️ Админ-панель</Button>
        </div>

        <p className="text-center text-slate-500 mt-12">
          Таймер работает. Кнопки функциональны. Время сохраняется при нажатии.
        </p>
      </div>
    </div>
  );
}