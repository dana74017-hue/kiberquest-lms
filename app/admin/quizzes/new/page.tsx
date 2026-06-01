"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

export default function NewQuizPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<any[]>([
    { question: "", options: ["", "", "", ""], correctIndex: 0 }
  ]);
  const [loading, setLoading] = useState(false);

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctIndex: 0 }]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return alert("Введите название квиза");

    setLoading(true);

    try {
      let imageUrl = null;

      if (imageFile) {
        const fileName = `quiz-${Date.now()}-${imageFile.name}`;
        const { error } = await supabase.storage
          .from("course-images")
          .upload(fileName, imageFile);
        if (error) throw error;
        imageUrl = supabase.storage.from("course-images").getPublicUrl(fileName).data.publicUrl;
      }

      // Создаём квиз
      const { data: quiz, error: quizError } = await supabase
        .from("quizzes")
        .insert({ title, description, image_url: imageUrl })
        .select()
        .single();

      if (quizError) throw quizError;

      // Добавляем вопросы
      const questionsToInsert = questions.map(q => ({
        quiz_id: quiz.id,
        question: q.question,
        options: q.options,
        correct_index: q.correctIndex
      }));

      const { error: qError } = await supabase
        .from("quiz_questions")
        .insert(questionsToInsert);

      if (qError) throw qError;

      alert("✅ Квиз и вопросы успешно созданы!");
      window.location.href = "/quiz";
    } catch (err: any) {
      alert("Ошибка: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Создать новый квиз</h1>

        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Основная информация */}
              <Input
                placeholder="Название квиза"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xl"
              />

              <textarea
                placeholder="Описание квиза (необязательно)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded-3xl p-5"
              />

              <div>
                <label className="block text-sm mb-2">Обложка квиза</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-slate-300"
                />
              </div>

              {/* Динамические вопросы */}
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Вопросы</h2>
                  <Button type="button" onClick={addQuestion} variant="outline">
                    <Plus className="mr-2" size={18} />
                    Добавить вопрос
                  </Button>
                </div>

                {questions.map((q, qIndex) => (
                  <Card key={qIndex} className="bg-slate-800 border-slate-600">
                    <CardContent className="p-6">
                      <div className="flex justify-between mb-4">
                        <span className="font-medium">Вопрос {qIndex + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuestion(qIndex)}
                          className="text-red-400"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>

                      <Input
                        placeholder="Текст вопроса"
                        value={q.question}
                        onChange={(e) => updateQuestion(qIndex, "question", e.target.value)}
                        className="mb-6"
                      />

                      <div className="space-y-3">
                        {q.options.map((option: string, optIndex: number) => (
                          <div key={optIndex} className="flex gap-3 items-center">
                            <input
                              type="radio"
                              name={`correct-${qIndex}`}
                              checked={q.correctIndex === optIndex}
                              onChange={() => updateQuestion(qIndex, "correctIndex", optIndex)}
                            />
                            <Input
                              placeholder={`Вариант ${optIndex + 1}`}
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...q.options];
                                newOptions[optIndex] = e.target.value;
                                updateQuestion(qIndex, "options", newOptions);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full py-8 text-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              >
                {loading ? "Создаём квиз и вопросы..." : "Создать квиз"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}