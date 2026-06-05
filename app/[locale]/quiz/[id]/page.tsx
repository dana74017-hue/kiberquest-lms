"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Question {
  id: string;
  type: "text" | "image";
  question: string;
  options: string[];
  option_images: string[] | null;
  correct_index: number;
}

export default function TakeQuizPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      const { data: quizData } = await supabase
        .from("quizzes")
        .select("*")
        .eq("id", id)
        .single();

      const { data: qData } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("quiz_id", id);

      setQuiz(quizData);
      setQuestions(qData || []);
      setLoading(false);
    };

    load();
  }, [id]);

  const selectAnswer = (qIndex: number, optIndex: number) => {
    setSelectedAnswers({ ...selectedAnswers, [qIndex]: optIndex });
  };

  const finishQuiz = () => {
    let score = 0;
    questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correct_index) score++;
    });
    setResult(score);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-2xl text-muted-foreground">Загрузка...</div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-2xl text-muted-foreground">Квиз не найден</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">{quiz.title}</h1>

        <Card>
          <CardContent className="p-8">
            {questions.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Вопросы пока не загружены
              </p>
            )}

            {questions.map((q, qIndex) => (
              <div key={qIndex} className="mb-10 last:mb-0">
                <p className="text-xl font-medium mb-6">
                  {qIndex + 1}. {q.question}
                </p>

                <div className="space-y-3">
                  {q.options.map((option, optIndex) => {
                    const isSelected = selectedAnswers[qIndex] === optIndex;
                    const img = q.option_images?.[optIndex];

                    return (
                      <button
                        key={optIndex}
                        onClick={() => selectAnswer(qIndex, optIndex)}
                        className={`w-full flex items-center gap-4 text-left p-4 rounded-2xl border transition-all ${
                          isSelected 
                            ? "border-primary bg-primary/10" 
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {img && (
                          <img 
                            src={img} 
                            alt="" 
                            className="w-28 h-28 object-cover rounded-xl flex-shrink-0 border border-border" 
                          />
                        )}
                        <span className="flex-1 text-lg">
                          {option || (img ? "Вариант " + (optIndex + 1) : "")}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {questions.length > 0 && result === null && (
              <Button 
                onClick={finishQuiz} 
                className="w-full py-8 text-xl mt-6"
              >
                Завершить квиз и посмотреть результат
              </Button>
            )}

            {result !== null && (
              <div className="text-center py-12">
                <div className="text-7xl font-bold text-primary mb-4">
                  {result} / {questions.length}
                </div>
                <p className="text-2xl mb-8">Твой результат</p>
                <Button onClick={() => window.location.reload()} size="lg">
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