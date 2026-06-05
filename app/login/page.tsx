"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        alert("Ошибка входа: " + error.message);
      } else {
        window.location.href = "/dashboard";
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        alert("Ошибка регистрации: " + error.message);
      } else {
        alert("Проверь почту для подтверждения аккаунта!");
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