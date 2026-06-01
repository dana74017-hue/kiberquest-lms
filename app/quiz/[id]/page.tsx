"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function TakeQuizPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuiz();
  }, [id]);

  const loadQuiz = async () => {
    // Загружаем квиз
    const { data: quizData } = await supabase
      .from("quizzes")
      .select("*")
      .eq("id", id)
      .single();

    // Загружаем вопросы
    const { data: qData } = await supabase
      .from("quiz_questions")
      .select("*")
      .eq("quiz_id", id);

    setQuiz(quizData);
    setQuestions(qData || []);
    setLoading(false);
  };

  const selectAnswer = (questionIndex: number, optionIndex: number) => {
    setAnswers({ ...answers, [questionIndex]: optionIndex });
  };

  const finishQuiz = () => {
    let score = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correct_index) score++;
    });

    setResult(score);
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-2xl">Загрузка квиза...</div>;
  if (!quiz) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-2xl">Квиз не найден</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">{quiz.title}</h1>
        {quiz.description && <p className="text-slate-400 mb-8">{quiz.description}</p>}

        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="p-8">
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="mb-10 border-b border-slate-700 pb-8 last:border-none">
                <p className="text-lg font-medium mb-6">{qIndex + 1}. {q.question}</p>
                
                <div className="space-y-3">
                  {q.options.map((option: string, optIndex: number) => (
                    <button
                      key={optIndex}
                      onClick={() => selectAnswer(qIndex, optIndex)}
                      className={`w-full text-left p-5 rounded-2xl border transition-all ${
                        answers[qIndex] === optIndex 
                          ? "border-purple-500 bg-purple-500/20" 
                          : "border-slate-700 hover:border-slate-500"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {result === null ? (
              <Button onClick={finishQuiz} className="w-full py-8 text-xl bg-gradient-to-r from-purple-500 to-pink-500">
                Завершить квиз и посмотреть результат
              </Button>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-5xl font-bold text-purple-400 mb-4">
                  {result} / {questions.length}
                </h2>
                <p className="text-2xl">Твой результат</p>
                <Button onClick={() => window.location.reload()} className="mt-8">
                  Пройти заново
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}