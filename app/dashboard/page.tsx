"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Save } from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState({ 
    full_name: "", 
    status: "Начинающий разработчик" 
  });
  const [editing, setEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        const { data } = await supabase
          .from("profiles")
          .select("full_name, status, avatar_url")
          .eq("id", session.user.id)
          .single();

        if (data) {
          setProfile({
            full_name: data.full_name || session.user.email?.split('@')[0] || "",
            status: data.status || "Начинающий разработчик"
          });
          setAvatarUrl(data.avatar_url || "");
        }
      }
    });
  }, []);

  const saveProfile = async () => {
    if (!user) return alert("Ошибка авторизации");

    let newAvatarUrl = avatarUrl;

    if (avatarFile) {
      const fileName = `${user.id}-${Date.now()}.jpg`;
      const { error } = await supabase.storage
        .from("avatars")
        .upload(fileName, avatarFile);

      if (!error) {
        newAvatarUrl = supabase.storage.from("avatars").getPublicUrl(fileName).data.publicUrl;
      }
    }

    await supabase.from("profiles").upsert({
      id: user.id,
      email: user.email,
      full_name: profile.full_name,
      status: profile.status,
      avatar_url: newAvatarUrl,
    });

    setAvatarUrl(newAvatarUrl);
    setEditing(false);
    alert("✅ Профиль успешно обновлён!");
  };

  const uploadAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarUrl(URL.createObjectURL(file)); // предпросмотр
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-20 px-6">
      <div className="max-w-screen-2xl mx-auto">
        {/* Шапка профиля */}
        <div className="flex flex-col md:flex-row gap-6 items-start mb-12">
          <div className="relative group">
            <Avatar className="w-32 h-32 border-4 border-cyan-400 overflow-hidden">
              <img 
                src={avatarUrl || ""} 
                alt="avatar"
                className="object-cover w-full h-full"
              />
              <AvatarFallback className="text-6xl bg-gradient-to-br from-cyan-400 to-blue-500">
                {profile.full_name?.[0] || "D"}
              </AvatarFallback>
            </Avatar>
            <label className="absolute bottom-3 right-3 bg-cyan-500 hover:bg-cyan-400 text-black p-3 rounded-full cursor-pointer shadow-lg">
              <Camera size={20} />
              <input type="file" accept="image/*" onChange={uploadAvatar} className="hidden" />
            </label>
          </div>

          <div className="flex-1 pt-3">
            {editing ? (
              <div className="space-y-4">
                <Input
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  placeholder="Твоё имя"
                  className="text-3xl font-bold"
                />
                <textarea
                  value={profile.status}
                  onChange={(e) => setProfile({ ...profile, status: e.target.value })}
                  placeholder="Статус / уровень"
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-700 rounded-3xl p-4 text-white"
                />
                <div className="flex gap-3">
                  <Button onClick={saveProfile} className="flex items-center gap-2">
                    <Save size={18} /> Сохранить изменения
                  </Button>
                  <Button variant="outline" onClick={() => setEditing(false)}>Отмена</Button>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-5xl font-bold flex items-center gap-4">
                  Добро пожаловать, {profile.full_name || user?.email?.split('@')[0] || "Студент"}!
                  <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
                    ✏️ Изменить
                  </Button>
                </h1>
                <p className="text-cyan-400 text-xl mt-1">{profile.status}</p>
              </div>
            )}
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex gap-4 flex-wrap mb-12">
          <Button size="lg" onClick={() => window.location.href = "/courses"}>Продолжить обучение</Button>
          <Button size="lg" variant="outline" onClick={() => window.location.href = "/quiz"}>Пройти квиз</Button>
          <Button size="lg" variant="outline" onClick={() => window.location.href = "/editor"}>Открыть редактор</Button>
        </div>

        <p className="text-center text-slate-400">Остальные блоки (прогресс, статистика) можно добавить позже. Сейчас главное — редактирование профиля работает.</p>
      </div>
    </div>
  );
}