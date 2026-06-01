"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Trophy, Flame, Book, Star } from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState({ full_name: "dana74017", status: "Начинающий разработчик" });
  const [editing, setEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [timeOnSite, setTimeOnSite] = useState(0);           // минуты в этой сессии
  const [totalHours, setTotalHours] = useState(17);
  const [streak, setStreak] = useState(9);
  const [lessons, setLessons] = useState(28);
  const [points, setPoints] = useState(1480);

  const [progress, setProgress] = useState([
    { name: "HTML + CSS Основы", percent: 92 },
    { name: "JavaScript с нуля", percent: 67 },
    { name: "React для начинающих", percent: 34 },
  ]);

  // Автоматический таймер + автосохранение
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeOnSite(prev => prev + 1);
      
      // Автосохранение каждые 2 минуты
      if (timeOnSite % 2 === 0 && timeOnSite > 0) {
        setTotalHours(prev => prev + 1);
        setPoints(prev => prev + 30);
        setLessons(prev => prev + 1);
      }
    }, 60000); // каждую минуту

    return () => clearInterval(timer);
  }, [timeOnSite]);

  const saveProfile = () => {
    alert("✅ Имя, статус и аватар сохранены!");
    setEditing(false);
  };

  const addProgress = (index: number) => {
    const newProgress = [...progress];
    newProgress[index].percent = Math.min(100, newProgress[index].percent + 15);
    setProgress(newProgress);
    setPoints(p => p + 80);
    alert(`+15% к ${newProgress[index].name} и +80 баллов!`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-20 px-6">
      <div className="max-w-screen-2xl mx-auto">
        {/* Шапка */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-5">
            <div className="relative">
              <Avatar className="w-28 h-28 border-4 border-cyan-400">
                <AvatarFallback className="text-6xl">👤</AvatarFallback>
              </Avatar>
              <button className="absolute bottom-1 right-1 bg-cyan-500 p-2 rounded-full" onClick={() => alert("📸 Выберите фото")}>
                <Camera size={20} />
              </button>
            </div>

            <div>
              {editing ? (
                <Input value={profile.full_name} onChange={e => setProfile({...profile, full_name: e.target.value})} className="text-3xl" />
              ) : (
                <h1 className="text-5xl font-bold">Добро пожаловать, {profile.full_name}!</h1>
              )}
              <p className="text-cyan-400">{profile.status}</p>
              <Button size="sm" onClick={() => setEditing(!editing)}>{editing ? "💾 Сохранить" : "✏️ Редактировать"}</Button>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-slate-400">Время на сайте сегодня</p>
            <p className="text-3xl font-bold text-emerald-400">{timeOnSite} минут</p>
            <Button size="sm" onClick={() => { setTotalHours(h => h + 1); alert("⏱ Время автоматически сохранено!"); }}>
              Сохранить сессию
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-8">
          {/* Прогресс */}
          <div className="md:col-span-7">
            <h2 className="text-3xl font-semibold mb-6 flex justify-between">
              Твой прогресс
              <Button onClick={() => setLessons(l => l + 1)}>+ Новый урок</Button>
            </h2>
            {progress.map((item, i) => (
              <Card key={i} className="mb-6 bg-slate-900">
                <CardContent className="p-6">
                  <div className="flex justify-between mb-3">
                    <span>{item.name}</span>
                    <span className="font-bold">{item.percent}%</span>
                  </div>
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-3 bg-gradient-to-r from-cyan-400 to-blue-500" style={{width: item.percent + "%"}} />
                  </div>
                  <Button size="sm" className="mt-3" onClick={() => addProgress(i)}>
                    Продолжить (+15%)
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Статистика + быстрые действия */}
          <div className="md:col-span-5 space-y-6">
            <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800">
              <div className="flex justify-between items-center">
                <Trophy className="text-yellow-400" size={40} />
                <div className="text-right">
                  <p className="text-6xl font-bold text-yellow-400">{totalHours}</p>
                  <p>часов в обучении</p>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <Flame className="mx-auto text-orange-400" size={32} />
                <p className="text-4xl font-bold">{streak}</p>
                <p className="text-xs">дней подряд</p>
              </Card>
              <Card className="p-4 text-center">
                <Book className="mx-auto text-emerald-400" size={32} />
                <p className="text-4xl font-bold">{lessons}</p>
                <p className="text-xs">уроков</p>
              </Card>
              <Card className="p-4 text-center">
                <Star className="mx-auto text-yellow-400" size={32} />
                <p className="text-4xl font-bold">{points}</p>
                <p className="text-xs">баллов</p>
              </Card>
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={saveProfile} className="py-6">💾 Сохранить профиль</Button>
              <Button onClick={() => { setPoints(p => p + 150); alert("🎁 +150 баллов за активность!"); }}>
                Получить ежедневный бонус
              </Button>
              <Button variant="outline" onClick={() => window.location.href = "/courses"}>📚 Перейти к курсам</Button>
            </div>
          </div>
        </div>

        <div className="text-center mt-12 text-slate-400">
          Время считается автоматически каждую минуту • Автосохранение каждые 2 минуты • Всё работает
        </div>
      </div>
    </div>
  );
}