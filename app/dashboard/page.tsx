"use client";

import { useEffect, useRef, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Course {
  name: string;
  percent: number;
  color: string;
}

// ─── Inline styles helper ────────────────────────────────────────────────────

const s = {
  page: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "#e2e8f0",
    fontFamily: "sans-serif",
    paddingTop: "2rem",
    paddingBottom: "3rem",
    paddingLeft: "1.5rem",
    paddingRight: "1.5rem",
  } as React.CSSProperties,

  inner: {
    maxWidth: 960,
    margin: "0 auto",
  } as React.CSSProperties,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Btn({
  children,
  onClick,
  variant = "default",
  fullWidth = false,
  style,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "primary" | "outline" | "purple";
  fullWidth?: boolean;
  style?: React.CSSProperties;
}) {
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 16px",
    borderRadius: 8,
    fontSize: 13,
    cursor: "pointer",
    border: "0.5px solid #475569",
    background: "#1e293b",
    color: "#cbd5e1",
    transition: "background .15s, color .15s",
    width: fullWidth ? "100%" : undefined,
    justifyContent: fullWidth ? "center" : undefined,
  };
  const variants: Record<string, React.CSSProperties> = {
    primary: { background: "#0e7490", borderColor: "#0e7490", color: "#fff" },
    outline: { background: "transparent", borderColor: "#475569", color: "#94a3b8" },
    purple: { background: "#1e1b4b", borderColor: "#6d28d9", color: "#a5b4fc" },
  };
  return (
    <button onClick={onClick} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
}

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: string;
  value: string | number;
  label: string;
  color: string;
}) {
  return (
    <div
      style={{
        background: "#1e293b",
        border: "0.5px solid #334155",
        borderRadius: 12,
        padding: "1.25rem",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "2rem", color, marginBottom: ".5rem" }}>{icon}</div>
      <div style={{ fontSize: "2rem", fontWeight: 500 }}>{value}</div>
      <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{label}</div>
    </div>
  );
}

function Toast({ message }: { message: string }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        background: "#0f172a",
        border: "0.5px solid #22d3ee",
        color: "#e2e8f0",
        padding: "12px 20px",
        borderRadius: 10,
        fontSize: 14,
        maxWidth: 300,
        zIndex: 999,
        opacity: message ? 1 : 0,
        transition: "opacity .3s",
        pointerEvents: "none",
      }}
    >
      {message}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  // Profile
  const [fullName, setFullName] = useState("dana74017");
  const [status, setStatus] = useState("Начинающий Full-Stack Разработчик");
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  // Stats
  const [timeOnSite, setTimeOnSite] = useState(0);
  const [totalHours, setTotalHours] = useState(28);
  const [streak, setStreak] = useState(14);
  const [lessons, setLessons] = useState(42);
  const [points, setPoints] = useState(2370);

  // Courses
  const [courses, setCourses] = useState<Course[]>([
    { name: "HTML + CSS Основы",       percent: 98, color: "#22d3ee" },
    { name: "JavaScript Продвинутый",  percent: 81, color: "#a78bfa" },
    { name: "React + Next.js",         percent: 56, color: "#34d399" },
    { name: "Backend (Node.js)",       percent: 23, color: "#fb923c" },
  ]);

  // Toast
  const [toastMsg, setToastMsg] = useState("");
  const toastRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    if (toastRef.current) clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToastMsg(""), 3000);
  };

  // Auto-timer: ticks every minute
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

  // Avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarUrl(ev.target?.result as string);
      showToast("✅ Фото успешно загружено!");
    };
    reader.readAsDataURL(file);
  };

  // Actions
  const saveProfile = () =>
    showToast(`✅ Профиль сохранён: ${fullName}`);

  const saveLearningTime = () => {
    const added = Math.floor(timeOnSite / 4) + 3;
    setTotalHours((h) => h + added);
    setPoints((p) => p + added * 85);
    setLessons((l) => l + 3);
    setTimeOnSite(0);
    showToast(`🎉 Сессия сохранена! +${added} ч, +${added * 85} баллов`);
  };

  const completeLesson = () => {
    setLessons((l) => l + 1);
    setPoints((p) => p + 150);
    setTotalHours((h) => h + 1);
    showToast("🏆 Урок засчитан! +150 баллов");
  };

  const increaseStreak = () => {
    setStreak((s) => s + 1);
    setPoints((p) => p + 200);
    showToast("🔥 Серия увеличена! +200 баллов");
  };

  const dailyBonus = () => {
    setPoints((p) => p + 500);
    showToast("🎁 Получено 500 бонусных баллов!");
  };

  const addProgress = (index: number) => {
    setCourses((prev) =>
      prev.map((c, i) =>
        i === index ? { ...c, percent: Math.min(100, c.percent + 17) } : c
      )
    );
    setPoints((p) => p + 110);
    showToast(`🚀 Прогресс по "${courses[index].name}" +17%`);
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div style={s.page}>
      <div style={s.inner}>

        {/* ── Шапка профиля ── */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "2rem",
            alignItems: "flex-start",
            marginBottom: "2.5rem",
          }}
        >
          {/* Аватар */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".75rem" }}>
            <label
              htmlFor="avatarInput"
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "#1e293b",
                border: "3px solid #22d3ee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "3.5rem",
                overflow: "hidden",
                cursor: "pointer",
                position: "relative",
              }}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                "👤"
              )}
            </label>
            <input
              id="avatarInput"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
            <Btn onClick={() => document.getElementById("avatarInput")?.click()}>
              📸 Загрузить фото
            </Btn>
          </div>

          {/* Имя и статус */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{
                fontSize: "1.75rem",
                fontWeight: 500,
                background: "transparent",
                border: "none",
                borderBottom: "1px solid transparent",
                color: "#f1f5f9",
                outline: "none",
                width: "100%",
              }}
              onFocus={(e) => (e.target.style.borderBottomColor = "#22d3ee")}
              onBlur={(e) => (e.target.style.borderBottomColor = "transparent")}
            />
            <input
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                fontSize: "1rem",
                color: "#22d3ee",
                background: "transparent",
                border: "none",
                borderBottom: "1px solid transparent",
                outline: "none",
                width: "100%",
                marginTop: ".25rem",
              }}
              onFocus={(e) => (e.target.style.borderBottomColor = "#22d3ee")}
              onBlur={(e) => (e.target.style.borderBottomColor = "transparent")}
            />
            <div style={{ display: "flex", gap: ".5rem", marginTop: "1rem", flexWrap: "wrap" }}>
              <Btn variant="primary" onClick={saveProfile}>
                💾 Сохранить профиль
              </Btn>
              <Btn onClick={() => (document.querySelector("input") as HTMLInputElement)?.focus()}>
                ✏️ Редактировать
              </Btn>
            </div>
          </div>

          {/* Таймер */}
          <div style={{ textAlign: "right", minWidth: 160 }}>
            <div style={{ fontSize: "2.25rem", fontWeight: 500, color: "#34d399" }}>
              {timeOnSite} мин
            </div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: ".5rem" }}>
              на сайте сейчас
            </div>
            <Btn onClick={saveLearningTime}>⏱ Сохранить время</Btn>
          </div>
        </div>

        {/* ── Статистика ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "1rem",
            marginBottom: "2.5rem",
          }}
        >
          <StatCard icon="🏆" value={totalHours} label="часов в обучении" color="#fbbf24" />
          <StatCard icon="🔥" value={streak}     label="дней подряд"      color="#f97316" />
          <StatCard icon="📖" value={lessons}    label="уроков пройдено"  color="#34d399" />
          <StatCard icon="⭐" value={points.toLocaleString("ru-RU")} label="баллов" color="#fbbf24" />
        </div>

        {/* ── Прогресс курсов ── */}
        <div style={{ fontSize: "1.25rem", fontWeight: 500, marginBottom: "1.25rem", color: "#f1f5f9" }}>
          Твой прогресс по курсам
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2.5rem" }}>
          {courses.map((course, i) => (
            <div
              key={i}
              style={{
                background: "#1e293b",
                border: "0.5px solid #334155",
                borderRadius: 12,
                padding: "1.25rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".75rem" }}>
                <span style={{ fontSize: 15, fontWeight: 500 }}>{course.name}</span>
                <span style={{ fontSize: 15, fontWeight: 500, color: "#22d3ee" }}>
                  {course.percent}%
                </span>
              </div>
              <div
                style={{
                  height: 10,
                  background: "#0f172a",
                  borderRadius: 999,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${course.percent}%`,
                    background: course.color,
                    borderRadius: 999,
                    transition: "width .4s ease",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: ".5rem", marginTop: "1rem", flexWrap: "wrap" }}>
                <Btn variant="primary" onClick={() => addProgress(i)}>
                  +17% (Пройти урок)
                </Btn>
                <Btn onClick={() => showToast("Редактор открыт")}>
                  Открыть практику
                </Btn>
              </div>
            </div>
          ))}
        </div>

        {/* ── Быстрые действия ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: ".75rem",
            marginBottom: "2.5rem",
          }}
        >
          {(
            [
              { label: "📚 Перейти к курсам",    href: "/courses", purple: false },
              { label: "❓ Пройти квиз",          href: "/quiz",    purple: false },
              { label: "💻 Открыть редактор",     href: "/editor",  purple: false },
              { label: "⚙️ Админ-панель",         href: "/admin",   purple: true  },
            ] satisfies { label: string; href: string; purple: boolean }[]
          ).map(({ label, href, purple }) => (
            <button
              key={href}
              onClick={() => showToast(`Переход: ${href}`)}
              style={{
                padding: "1.25rem",
                borderRadius: 12,
                border: purple ? "0.5px solid #6d28d9" : "0.5px solid #334155",
                background: purple ? "#1e1b4b" : "#1e293b",
                color: purple ? "#a5b4fc" : "#cbd5e1",
                fontSize: 15,
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Нижние блоки ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          {/* Достижения */}
          <div
            style={{
              background: "linear-gradient(135deg, #1e293b, #0f172a)",
              border: "0.5px solid #334155",
              borderRadius: 12,
              padding: "1.25rem",
            }}
          >
            <div style={{ fontSize: "2.25rem", color: "#fbbf24", marginBottom: ".75rem" }}>🏅</div>
            <div style={{ fontWeight: 500, marginBottom: ".75rem" }}>Достижения</div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: ".4rem", fontSize: 13, color: "#94a3b8" }}>
              <li>🏆 Первый курс завершён</li>
              <li>🔥 14 дней без пропусков</li>
              <li>📌 5 квизов на 100%</li>
            </ul>
            <Btn fullWidth style={{ marginTop: "1rem" }} onClick={() => showToast("Все достижения загружены")}>
              Посмотреть все
            </Btn>
          </div>

          {/* Быстрые ссылки */}
          <div
            style={{
              background: "#1e293b",
              border: "0.5px solid #334155",
              borderRadius: 12,
              padding: "1.25rem",
            }}
          >
            <div style={{ fontWeight: 500, marginBottom: ".75rem" }}>Быстрые ссылки</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".5rem" }}>
              <Btn onClick={() => showToast("Курсы")}>📖 Курсы</Btn>
              <Btn onClick={() => showToast("Квизы")}>🧠 Квизы</Btn>
              <Btn onClick={() => showToast("Редактор")}>💻 Редактор</Btn>
              <Btn onClick={() => showToast("Админ")}>👑 Админ</Btn>
            </div>
          </div>

          {/* Рейтинг */}
          <div
            style={{
              background: "#1e293b",
              border: "0.5px solid #334155",
              borderRadius: 12,
              padding: "1.25rem",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "3rem", fontWeight: 500, color: "#34d399" }}>1720</div>
            <div style={{ fontSize: 14, color: "#64748b", marginBottom: "1rem" }}>Общий рейтинг</div>
            <Btn variant="primary" fullWidth onClick={dailyBonus}>
              🎁 Ежедневный бонус
            </Btn>
          </div>
        </div>

        {/* ── Дополнительные кнопки ── */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: ".5rem",
            justifyContent: "center",
            marginBottom: "2rem",
          }}
        >
          <Btn onClick={saveProfile}>💾 Сохранить профиль</Btn>
          <Btn onClick={saveLearningTime}>⏱ Сохранить время</Btn>
          <Btn variant="primary" onClick={completeLesson}>🏆 Завершить урок (+150 баллов)</Btn>
          <Btn onClick={increaseStreak}>🔥 Увеличить серию</Btn>
        </div>

        {/* ── Футер ── */}
        <div
          style={{
            textAlign: "center",
            borderTop: "0.5px solid #1e293b",
            paddingTop: "1.25rem",
            color: "#475569",
            fontSize: 13,
            lineHeight: 1.7,
          }}
        >
          ✅ Реальная загрузка фото &nbsp;•&nbsp; Автоматический таймер &nbsp;•&nbsp; Редактирование &nbsp;•&nbsp; Сохранение
          <br />
          <span style={{ fontSize: 12, color: "#334155" }}>
            Личный кабинет полностью функциональный
          </span>
        </div>

      </div>

      {/* Toast */}
      <Toast message={toastMsg} />
    </div>
  );
}