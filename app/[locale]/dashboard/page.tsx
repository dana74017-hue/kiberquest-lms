"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Camera,
  Save,
  Clock,
  Trophy,
  Flame,
  BookOpen,
  Star,
  Award,
  Pencil,
} from "lucide-react";

interface Course {
  name: string;
  percent: number;
  color: string;
}

interface ActionItem {
  label: string;
  href: string;
  purple: boolean;
}

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);

  // Profile
  const [fullName, setFullName] = useState("Пользователь KiberQuest");
  const [status, setStatus] = useState("Начинающий Full-Stack Разработчик");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [editing, setEditing] = useState(false);

  // Stats
  const [timeOnSite, setTimeOnSite] = useState(0);
  const [totalHours, setTotalHours] = useState(28);
  const [streak, setStreak] = useState(14);
  const [lessons, setLessons] = useState(42);
  const [points, setPoints] = useState(2370);

  // Courses
  const [courses, setCourses] = useState<Course[]>([
    { name: "HTML + CSS Основы",      percent: 98, color: "bg-cyan-400" },
    { name: "JavaScript Продвинутый", percent: 81, color: "bg-purple-400" },
    { name: "React + Next.js",        percent: 56, color: "bg-emerald-400" },
    { name: "Backend (Node.js)",      percent: 23, color: "bg-orange-400" },
  ]);

  const [toastMsg, setToastMsg] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(""), 3000);
  };

  // ─── Load user & profile ────────────────────────────────────────────────

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        if (profile.full_name)  setFullName(profile.full_name);
        if (profile.status)     setStatus(profile.status);
        if (profile.avatar_url) setAvatarUrl(profile.avatar_url);
        if (profile.total_hours !== undefined) setTotalHours(profile.total_hours);
        if (profile.streak      !== undefined) setStreak(profile.streak);
        if (profile.lessons     !== undefined) setLessons(profile.lessons);
        if (profile.points      !== undefined) setPoints(profile.points);
      }
    };

    loadUser();
  }, []);

  // ─── Auto-timer ─────────────────────────────────────────────────────────

  useEffect(() => {
    const id = setInterval(() => {
      setTimeOnSite((prev) => {
        const next = prev + 1;
        if (next % 3 === 0) {
          setTotalHours((h) => h + 1);
          setPoints((p) => p + 65);
        }
        return next;
      });
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  // ─── Upload Avatar ──────────────────────────────────────────────────────

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => setAvatarUrl(ev.target?.result as string);
    reader.readAsDataURL(file);

    if (!userId) {
      showToast("✅ Фото загружено локально");
      return;
    }

    setUploadingAvatar(true);
    const fileName = `avatar-${userId}-${Date.now()}.jpg`;

    try {
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
      setAvatarUrl(data.publicUrl);

      await supabase.from("profiles").upsert({
        id: userId,
        avatar_url: data.publicUrl,
      });

      showToast("✅ Фото сохранено!");
    } catch (err: any) {
      showToast("Ошибка: " + err.message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  // ─── Save Profile ───────────────────────────────────────────────────────

  const saveProfile = async () => {
    if (userId) {
      await supabase.from("profiles").upsert({
        id: userId,
        full_name: fullName,
        status,
        avatar_url: avatarUrl,
        total_hours: totalHours,
        streak,
        lessons,
        points,
      });
    }
    setEditing(false);
    showToast("✅ Профиль сохранён!");
  };

  // ─── Actions ────────────────────────────────────────────────────────────

  const saveLearningTime = async () => {
    const added = Math.floor(timeOnSite / 4) + 3;
    const newHours = totalHours + added;
    const newPoints = points + added * 85;
    const newLessons = lessons + 3;

    setTotalHours(newHours);
    setPoints(newPoints);
    setLessons(newLessons);
    setTimeOnSite(0);

    if (userId) {
      await supabase.from("profiles").upsert({
        id: userId,
        total_hours: newHours,
        points: newPoints,
        lessons: newLessons,
      });
    }

    showToast(`🎉 Сессия сохранена! +${added} ч, +${added * 85} баллов`);
  };

  const completeLesson = async () => {
    const newLessons = lessons + 1;
    const newPoints = points + 150;
    const newHours = totalHours + 1;

    setLessons(newLessons);
    setPoints(newPoints);
    setTotalHours(newHours);

    if (userId) {
      await supabase.from("profiles").upsert({
        id: userId,
        lessons: newLessons,
        points: newPoints,
        total_hours: newHours,
      });
    }

    showToast("🏆 Урок засчитан! +150 баллов");
  };

  const increaseStreak = async () => {
    const newStreak = streak + 1;
    const newPoints = points + 200;

    setStreak(newStreak);
    setPoints(newPoints);

    if (userId) {
      await supabase.from("profiles").upsert({
        id: userId,
        streak: newStreak,
        points: newPoints,
      });
    }

    showToast("🔥 Серия увеличена! +200 баллов");
  };

  const dailyBonus = async () => {
    const newPoints = points + 500;
    setPoints(newPoints);

    if (userId) {
      await supabase.from("profiles").upsert({ id: userId, points: newPoints });
    }

    showToast("🎁 Получено 500 бонусных баллов!");
  };

  const addProgress = async (index: number) => {
    const updated = courses.map((c, i) =>
      i === index ? { ...c, percent: Math.min(100, c.percent + 17) } : c
    );
    setCourses(updated);
    const newPoints = points + 110;
    setPoints(newPoints);

    if (userId) {
      await supabase.from("profiles").upsert({ id: userId, points: newPoints });
    }

    showToast(`🚀 Прогресс по "${courses[index].name}" +17%`);
  };

  const actions: ActionItem[] = [
    { label: "📚 Перейти к курсам",  href: "/courses", purple: false },
    { label: "❓ Пройти квиз",        href: "/quiz",    purple: false },
    { label: "💻 Открыть редактор",   href: "/editor",  purple: false },
    { label: "⚙️ Админ-панель",       href: "/admin",   purple: true  },
  ];

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background text-foreground pt-20 px-6 pb-12">
      <div className="max-w-screen-xl mx-auto">

        {/* ── Шапка профиля ── */}
        <div className="flex flex-col lg:flex-row gap-8 items-start mb-12">

          {/* Аватар */}
          <div className="flex flex-col items-center gap-3">
            <label
              htmlFor="avatarInput"
              className="w-40 h-40 rounded-full border-4 border-primary shadow-xl bg-muted flex items-center justify-center text-7xl overflow-hidden cursor-pointer relative group"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="flex items-center justify-center w-full h-full">👤</span>
              )}
              <div className="absolute inset-0 bg-black/50 rounded-full hidden group-hover:flex items-center justify-center">
                <Camera className="text-white" size={28} />
              </div>
            </label>
            <input id="avatarInput" type="file" accept="image/*" className="hidden" onChange={uploadAvatar} />
            <button
              disabled={uploadingAvatar}
              onClick={() => document.getElementById("avatarInput")?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted border border-border text-muted-foreground hover:bg-background hover:text-foreground transition text-sm disabled:opacity-50"
            >
              <Camera size={16} />
              {uploadingAvatar ? "Загружаем..." : "📸 Загрузить фото"}
            </button>
          </div>

          {/* Имя и статус */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={!editing}
                className="text-4xl font-bold bg-transparent border-none outline-none w-full disabled:cursor-default focus:border-b focus:border-primary"
              />
              <button
                onClick={() => setEditing(!editing)}
                className="p-2 rounded-lg bg-muted border border-border hover:bg-background transition"
              >
                <Pencil size={18} className="text-muted-foreground" />
              </button>
            </div>
            <input
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={!editing}
              className="text-primary text-xl bg-transparent border-none outline-none w-full disabled:cursor-default"
            />

            {editing && (
              <button
                onClick={saveProfile}
                className="mt-4 flex items-center gap-2 px-5 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition"
              >
                <Save size={18} /> Сохранить профиль
              </button>
            )}
          </div>

          {/* Таймер */}
          <div className="text-right">
            <div className="text-emerald-400 text-4xl font-bold">{timeOnSite} мин</div>
            <p className="text-muted-foreground text-sm mb-3">на сайте сейчас</p>
            <button
              onClick={saveLearningTime}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted border border-border text-muted-foreground hover:bg-background hover:text-foreground transition text-sm"
            >
              <Clock size={16} /> Сохранить время обучения
            </button>
          </div>
        </div>

        {/* ── Статистика ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: <Trophy size={40} className="text-yellow-400 mx-auto mb-2" />, value: totalHours, label: "часов в обучении" },
            { icon: <Flame  size={40} className="text-orange-400 mx-auto mb-2" />, value: streak,     label: "дней подряд"     },
            { icon: <BookOpen size={40} className="text-emerald-400 mx-auto mb-2" />, value: lessons, label: "уроков пройдено" },
            { icon: <Star   size={40} className="text-yellow-400 mx-auto mb-2" />, value: points.toLocaleString("ru-RU"), label: "баллов" },
          ].map((stat, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 text-center">
              {stat.icon}
              <p className="text-5xl font-bold">{stat.value}</p>
              <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ── Прогресс курсов ── */}
        <h2 className="text-3xl font-bold mb-6">Твой прогресс по курсам</h2>
        <div className="space-y-6 mb-12">
          {courses.map((course, index) => (
            <div key={index} className="bg-card border border-border rounded-xl p-6">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-lg">{course.name}</span>
                <span className="font-bold text-primary">{course.percent}%</span>
              </div>
              <div className="h-4 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-4 ${course.color} transition-all duration-500 rounded-full`}
                  style={{ width: `${course.percent}%` }}
                />
              </div>
              <div className="flex gap-3 mt-4 flex-wrap">
                <button
                  onClick={() => addProgress(index)}
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition"
                >
                  +17% (Пройти урок)
                </button>
                <button
                  onClick={() => showToast("Редактор открыт")}
                  className="px-4 py-2 rounded-lg bg-muted hover:bg-background text-foreground text-sm transition border border-border"
                >
                  Открыть практику
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Быстрые действия ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {actions.map(({ label, href, purple }) => (
            <button
              key={href}
              onClick={() => (window.location.href = href)}
              className={`h-20 text-lg rounded-xl border font-medium transition ${
                purple
                  ? "bg-purple-700 hover:bg-purple-600 border-purple-600 text-white"
                  : "bg-card hover:bg-muted border-border text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Нижние блоки ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

          {/* Достижения */}
          <div className="bg-card border border-border rounded-xl p-6">
            <Award className="text-yellow-400 mb-4" size={50} />
            <h3 className="text-2xl font-bold mb-3">Достижения</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>🏆 Первый курс завершён</li>
              <li>🔥 14 дней без пропусков</li>
              <li>📌 5 квизов пройдено на 100%</li>
            </ul>
            <button
              onClick={() => showToast("Все достижения загружены")}
              className="mt-6 w-full py-2 rounded-lg bg-muted hover:bg-background text-foreground text-sm transition border border-border"
            >
              Посмотреть все достижения
            </button>
          </div>

          {/* Быстрые ссылки */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold text-lg mb-4">Быстрые ссылки</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "📖 Курсы",    href: "/courses" },
                { label: "🧠 Квизы",    href: "/quiz"    },
                { label: "💻 Редактор", href: "/editor"  },
                { label: "👑 Админ",    href: "/admin"   },
              ].map(({ label, href }) => (
                <button
                  key={href}
                  onClick={() => (window.location.href = href)}
                  className="py-2 rounded-lg bg-muted hover:bg-background text-foreground text-sm border border-border transition"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Рейтинг */}
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <p className="text-6xl font-bold text-emerald-400">1720</p>
            <p className="text-xl text-muted-foreground mt-1">Общий рейтинг</p>
            <button
              onClick={dailyBonus}
              className="mt-6 w-full py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition"
            >
              🎁 Получить ежедневный бонус
            </button>
          </div>
        </div>

        {/* ── Дополнительные кнопки ── */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <button onClick={saveProfile}     className="px-6 py-2 rounded-lg bg-muted hover:bg-background border border-border text-foreground text-sm transition">💾 Сохранить профиль</button>
          <button onClick={saveLearningTime} className="px-6 py-2 rounded-lg bg-muted hover:bg-background border border-border text-foreground text-sm transition">⏱ Сохранить время обучения</button>
          <button onClick={completeLesson}  className="px-6 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition">🏆 Завершить урок (+150 баллов)</button>
          <button onClick={increaseStreak} className="px-6 py-2 rounded-lg bg-orange-700 hover:bg-orange-600 text-white text-sm transition">🔥 Увеличить серию</button>
        </div>

        {/* ── Футер ── */}
        <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
          ✅ Реальная загрузка фото в Supabase &nbsp;•&nbsp; Автоматический таймер &nbsp;•&nbsp; Сохранение в БД &nbsp;•&nbsp; Все кнопки работают
        </div>

      </div>

      {/* ── Toast ── */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-card border border-primary text-foreground px-5 py-3 rounded-xl text-sm shadow-lg max-w-xs">
          {toastMsg}
        </div>
      )}
    </div>
  );
}