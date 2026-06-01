"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export default function QuizDetailPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchQuiz = async () => {
      const { data } = await supabase
        .from("quizzes")
        .select("*")
        .eq("id", id)
        .single();

      setQuiz(data);
      setLoading(false);
    };

    fetchQuiz();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-2xl">Загрузка квиза...</div>;
  }

  if (!quiz) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-2xl">Квиз не найден</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Обложка */}
        {quiz.image_url && (
          <div className="relative h-80 w-full rounded-3xl overflow-hidden mb-8">
            <img
              src={quiz.image_url}
              alt={quiz.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="p-10">
            <h1 className="text-4xl font-bold mb-4">{quiz.title}</h1>
            {quiz.description && <p className="text-slate-400 text-lg mb-8">{quiz.description}</p>}

            <div className="flex items-center gap-3 text-slate-400 mb-10">
              <Eye size={22} />
              <span className="text-xl">{quiz.views || 0} человек уже прошли этот квиз</span>
            </div>

            <Button 
              size="lg"
              className="w-full py-8 text-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
              onClick={() => alert("Пока что здесь будет прохождение квиза. Скоро добавим вопросы!")}
            >
              🚀 Начать квиз
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}