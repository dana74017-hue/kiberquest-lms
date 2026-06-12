"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Универсальная функция отправки письма (с возможностью копии админу)
  const sendEmail = async (
    to: string, 
    subject: string, 
    html: string, 
    sendCopyToAdmin: boolean = false
  ) => {
    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          to, 
          subject, 
          html, 
          sendCopyToAdmin 
        }),
      });
    } catch (error) {
      console.error("Ошибка при отправке письма:", error);
    }
  };

  const handleAuth = async () => {
    if (!email || !password) {
      alert("Введите email и пароль");
      return;
    }

    setLoading(true);

    if (isLogin) {
      // ==================== ВХОД ====================
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        alert("Ошибка входа: " + error.message);
      } else {
        // Отправляем уведомление о входе + копию админу
        await sendEmail(
          email,
          "Вход в KiberQuest",
          `
            <h2>Уведомление о входе</h2>
            <p>В ваш аккаунт <strong>KiberQuest LMS</strong> был выполнен вход.</p>
            <p><strong>Время:</strong> ${new Date().toLocaleString("ru-RU")}</p>
            <p>Если это были не вы — немедленно смените пароль.</p>
          `,
          true // ← true = отправить копию тебе (админу)
        );

        router.push("/dashboard");
      }
    } else {
      // ==================== РЕГИСТРАЦИЯ ====================
      const { error } = await supabase.auth.signUp({ email, password });

      if (error) {
        alert("Ошибка регистрации: " + error.message);
      } else {
        // Отправляем приветственное письмо (без копии админу)
        await sendEmail(
          email,
          "Добро пожаловать в KiberQuest!",
          `
            <h2>Здравствуйте!</h2>
            <p>Ваш аккаунт в <strong>KiberQuest LMS</strong> успешно зарегистрирован.</p>
            <p>Теперь вы можете войти и начать обучение веб-разработке.</p>
            <br />
            <p>С уважением,<br>Команда KiberQuest</p>
          `
        );

        alert("Регистрация прошла успешно! Проверьте почту для подтверждения аккаунта.");
        setIsLogin(true);
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-card rounded-3xl p-10 border border-border">
        <h1 className="text-4xl font-bold text-center mb-2">
          {isLogin ? "Вход" : "Регистрация"}
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          {isLogin ? "Войди в свой аккаунт" : "Создай новый аккаунт"}
        </p>

        <div className="space-y-6">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-muted border-border"
          />
          <Input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-muted border-border"
          />

          <Button
            onClick={handleAuth}
            disabled={loading}
            className="w-full py-7 text-lg"
          >
            {loading 
              ? "Подождите..." 
              : isLogin 
                ? "Войти" 
                : "Зарегистрироваться"}
          </Button>

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-primary hover:underline"
          >
            {isLogin 
              ? "Ещё нет аккаунта? Зарегистрироваться" 
              : "Уже есть аккаунт? Войти"}
          </button>
        </div>
      </div>
    </div>
  );
}