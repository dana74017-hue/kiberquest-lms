"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [userRole, setUserRole] = useState<"student" | "teacher" | "admin">("student");
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuizTitle, setNewQuizTitle] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();
      if (data) setUserRole(data.role as any);
    }

    const { data: quizzesData } = await supabase
      .from("quizzes")
      .select("*")
      .order("created_at", { ascending: false });

    setQuizzes(quizzesData || []);
    setLoading(false);
  };

  const addNewQuiz = async () => {
    if (!newQuizTitle) return;

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("quizzes")
      .insert({
        title: newQuizTitle,
        created_by: user?.id
      });

    if (!error) {
      setNewQuizTitle("");
      setShowAddForm(false);
      loadData();
      alert("Квиз успешно добавлен!");
    } else {
      alert("Ошибка: " + error.message);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Загрузка квизов...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-20 px-6">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-bold">Квизы</h1>

          {(userRole === "teacher" || userRole === "admin") && (
            <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-cyan-500 hover:bg-cyan-400 text-black">
              + Добавить новый квиз
            </Button>
          )}
        </div>

        {showAddForm && (
          <Card className="bg-slate-900 border-cyan-400 mb-8">
            <CardContent className="p-8">
              <Input
                placeholder="Название нового квиза"
                value={newQuizTitle}
                onChange={(e) => setNewQuizTitle(e.target.value)}
                className="mb-4"
              />
              <Button onClick={addNewQuiz} className="w-full bg-cyan-500 text-black">
                Создать квиз
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="bg-slate-900 border border-slate-700 hover:border-cyan-400 transition-all">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-white mb-4">{quiz.title}</h3>
                <Button className="w-full bg-white text-black hover:bg-cyan-400">
                  Пройти квиз →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}