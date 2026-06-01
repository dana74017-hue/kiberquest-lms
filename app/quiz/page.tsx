"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Eye } from "lucide-react";
import Link from "next/link";

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [userRole, setUserRole] = useState<"student" | "teacher" | "admin">("student");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
    fetchUserRole();
  }, []);

  const fetchUserRole = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();
      if (data) setUserRole(data.role as any);
    }
  };

  const fetchQuizzes = async () => {
    const { data } = await supabase
      .from("quizzes")
      .select("*")
      .order("created_at", { ascending: false });

    setQuizzes(data || []);
    setLoading(false);
  };

  const incrementViews = async (quizId: string) => {
    const { data: current } = await supabase
      .from("quizzes")
      .select("views")
      .eq("id", quizId)
      .single();

    await supabase
      .from("quizzes")
      .update({ views: (current?.views || 0) + 1 })
      .eq("id", quizId);
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Загрузка квизов...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-20 px-6">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-6xl font-bold">Квизы</h1>
            <p className="text-slate-400 text-xl mt-2">Проверь свои знания</p>
          </div>

          {(userRole === "teacher" || userRole === "admin") && (
            <Link href="/admin/quizzes/new">
              <Button className="bg-gradient-to-r from-purple-400 to-pink-500 text-black px-8 py-6 text-lg">
                <Upload size={22} className="mr-3" />
                Добавить новый квиз
              </Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="bg-slate-900 border-slate-700 hover:border-purple-400 transition-all group">
              <CardContent className="p-0">
                {/* Обложка квиза */}
                <div className="h-52 bg-slate-800 relative overflow-hidden">
                  {quiz.image_url ? (
                    <img 
                      src={quiz.image_url} 
                      alt={quiz.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-7xl">❓</div>
                  )}
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-semibold mb-3 group-hover:text-purple-400">{quiz.title}</h3>
                  
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-8">
                    <Eye size={18} />
                    <span>{quiz.views || 0} просмотров</span>
                  </div>

                  <Link href={`/quiz/${quiz.id}`} onClick={() => incrementViews(quiz.id)}>
                    <Button className="w-full py-6 text-lg bg-white text-black hover:bg-purple-400">
                      Пройти квиз →
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}