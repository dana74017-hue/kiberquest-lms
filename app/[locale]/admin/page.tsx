"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: "student" | "teacher" | "admin";
  created_at: string;
};

export default function AdminPanel() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [stats, setStats] = useState({ users: 0, courses: 0, quizzes: 0 });
  const [loading, setLoading] = useState(true);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    // Простой и надёжный способ
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("id, full_name, role, created_at")
      .order("created_at", { ascending: false });

    // Получаем email отдельно из auth.users
    const userIds = profilesData?.map(p => p.id) || [];
    const { data: authUsers } = await supabase.auth.admin.listUsers();

    const profilesWithEmail = (profilesData || []).map(profile => {
      const authUser = authUsers?.users.find(u => u.id === profile.id);
      return {
        ...profile,
        email: authUser?.email || "Нет email",
      };
    });

    // Статистика
    const [{ count: usersCount }, { count: coursesCount }, { count: quizzesCount }] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("courses").select("*", { count: "exact", head: true }),
      supabase.from("quizzes").select("*", { count: "exact", head: true }),
    ]);

    setProfiles(profilesWithEmail);
    setStats({
      users: usersCount || 0,
      courses: coursesCount || 0,
      quizzes: quizzesCount || 0,
    });
    setLoading(false);
  };

  const changeRole = async (userId: string, newRole: "student" | "teacher" | "admin") => {
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);

    if (!error) {
      setProfiles(prev =>
        prev.map(p => (p.id === userId ? { ...p, role: newRole } : p))
      );
      alert("Роль успешно изменена!");
    } else {
      alert("Ошибка: " + error.message);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        Загрузка пользователей...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-20 px-6">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-bold">Админ-панель</h1>
          
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="h-10 w-10"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            <Button onClick={loadData} variant="outline">Обновить данные</Button>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-card border-border">
            <CardHeader><CardTitle>Пользователи</CardTitle></CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-cyan-400">{stats.users}</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader><CardTitle>Курсы</CardTitle></CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-purple-400">{stats.courses}</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader><CardTitle>Квизы</CardTitle></CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-emerald-400">{stats.quizzes}</div>
            </CardContent>
          </Card>
        </div>

        {/* Таблица пользователей */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl">Пользователи ({profiles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4">Имя</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Роль</th>
                    <th className="text-left py-3 px-4">Дата регистрации</th>
                    <th className="text-left py-3 px-4">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((profile) => (
                    <tr key={profile.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-4 px-4 font-medium">
                        {profile.full_name || "Без имени"}
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">
                        {profile.email}
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={
                          profile.role === "admin" ? "bg-red-500" :
                          profile.role === "teacher" ? "bg-purple-500" : "bg-cyan-500"
                        }>
                          {profile.role}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">
                        {new Date(profile.created_at).toLocaleDateString("ru-RU")}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => changeRole(profile.id, "student")} 
                            disabled={profile.role === "student"}
                          >
                            Студент
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => changeRole(profile.id, "teacher")} 
                            disabled={profile.role === "teacher"}
                          >
                            Преподаватель
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => changeRole(profile.id, "admin")} 
                            disabled={profile.role === "admin"}
                          >
                            Админ
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}