"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";

type QuestionType = "text" | "image";

interface Question {
  type: QuestionType;
  question: string;
  options: string[];
  optionImages: string[];
  correctIndex: number;
}

export default function NewQuizPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<Question[]>([
    {
      type: "text",
      question: "",
      options: ["", "", "", ""],
      optionImages: ["", "", "", ""],
      correctIndex: 0,
    },
  ]);
  const [loading, setLoading] = useState(false);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        type: "text",
        question: "",
        options: ["", "", ""],
        optionImages: ["", "", ""],
        correctIndex: 0,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const changeQuestionType = (index: number, type: QuestionType) => {
    const updated = [...questions];
    updated[index].type = type;

    if (type === "image" && updated[index].options.length < 2) {
      updated[index].options = ["", ""];
      updated[index].optionImages = ["", ""];
    }
    setQuestions(updated);
  };

  const addOption = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options.push("");
    if (updated[qIndex].type === "image") {
      updated[qIndex].optionImages.push("");
    }
    setQuestions(updated);
  };

  const removeOption = (qIndex: number, optIndex: number) => {
    const updated = [...questions];
    if (updated[qIndex].options.length <= 2) return;

    updated[qIndex].options.splice(optIndex, 1);
    if (updated[qIndex].type === "image") {
      updated[qIndex].optionImages.splice(optIndex, 1);
    }

    if (updated[qIndex].correctIndex >= updated[qIndex].options.length) {
      updated[qIndex].correctIndex = 0;
    }
    setQuestions(updated);
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions];
    (updated[index] as any)[field] = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const updateOptionImage = (qIndex: number, optIndex: number, file: File | null) => {
    const updated = [...questions];
    const current = { ...updated[qIndex] } as any;

    if (!current.imageFiles) current.imageFiles = [];
    current.imageFiles = [...current.imageFiles];
    current.imageFiles[optIndex] = file;

    updated[qIndex] = current;
    setQuestions(updated);
  };

  // ==================== СОХРАНЕНИЕ ====================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return alert("Введите название квиза");

    setLoading(true);

    try {
      // 1. Обложка квиза
      let quizImageUrl = null;
      if (imageFile) {
        const fileName = `quiz-cover-${Date.now()}-${imageFile.name}`;
        const { error } = await supabase.storage.from("course-images").upload(fileName, imageFile);
        if (error) throw error;
        quizImageUrl = supabase.storage.from("course-images").getPublicUrl(fileName).data.publicUrl;
      }

      // 2. Создаём квиз
      const { data: quiz, error: quizError } = await supabase
        .from("quizzes")
        .insert({ title, description, image_url: quizImageUrl })
        .select()
        .single();

      if (quizError) throw quizError;

      // 3. Загружаем картинки вариантов
      const finalQuestions = await Promise.all(
        questions.map(async (q, qIndex) => {
          let optionImagesUrls: string[] = [];
          const imageFiles = (q as any).imageFiles || [];

          if (q.type === "image" && imageFiles.length > 0) {
            optionImagesUrls = await Promise.all(
              imageFiles.map(async (file: File | null, i: number) => {
                if (!file) return "";
                const fileName = `quiz-option-${quiz.id}-${qIndex}-${i}-${Date.now()}`;
                const { error } = await supabase.storage.from("course-images").upload(fileName, file);
                if (error) throw error;
                return supabase.storage.from("course-images").getPublicUrl(fileName).data.publicUrl;
              })
            );
          }

          return {
            quiz_id: quiz.id,
            type: q.type,
            question: q.question,
            options: q.options,
            option_images: optionImagesUrls,
            correct_index: q.correctIndex,
          };
        })
      );

      // 4. Сохраняем вопросы
      const { error: qError } = await supabase.from("quiz_questions").insert(finalQuestions);
      if (qError) throw qError;

      alert("✅ Квиз успешно создан!");
      window.location.href = "/quiz";
    } catch (err: any) {
      alert("Ошибка: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Создать новый квиз</h1>

        <Card>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-10">
              <Input 
                placeholder="Название квиза" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="text-xl" 
              />
              
              <textarea 
                placeholder="Описание квиза" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                rows={3} 
                className="w-full bg-muted border border-border rounded-3xl p-5" 
              />

              <div>
                <label className="block text-sm mb-2 text-muted-foreground">Обложка квиза</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
              </div>

              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Вопросы</h2>
                  <Button type="button" onClick={addQuestion} variant="outline">
                    <Plus className="mr-2" size={18} /> Добавить вопрос
                  </Button>
                </div>

                {questions.map((q, qIndex) => (
                  <Card key={qIndex} className="bg-card border-border">
                    <CardContent className="p-6">
                      <div className="flex justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">Вопрос {qIndex + 1}</span>
                          <select 
                            value={q.type} 
                            onChange={(e) => changeQuestionType(qIndex, e.target.value as QuestionType)} 
                            className="bg-muted border border-border px-3 py-1 rounded-lg text-sm"
                          >
                            <option value="text">Текст</option>
                            <option value="image">Выбор картинки</option>
                          </select>
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeQuestion(qIndex)} className="text-red-400">
                          <Trash2 size={18} />
                        </Button>
                      </div>

                      <Input 
                        placeholder="Текст вопроса" 
                        value={q.question} 
                        onChange={(e) => updateQuestion(qIndex, "question", e.target.value)} 
                        className="mb-6" 
                      />

                      <div className="space-y-4">
                        {q.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex gap-3 items-start">
                            <input 
                              type="radio" 
                              name={`correct-${qIndex}`} 
                              checked={q.correctIndex === optIndex} 
                              onChange={() => updateQuestion(qIndex, "correctIndex", optIndex)} 
                              className="mt-3" 
                            />

                            {q.type === "text" ? (
                              <Input 
                                placeholder={`Вариант ${optIndex + 1}`} 
                                value={option} 
                                onChange={(e) => updateOption(qIndex, optIndex, e.target.value)} 
                                className="flex-1" 
                              />
                            ) : (
                              <div className="flex-1 space-y-2">
                                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                                  <ImageIcon size={16} /> Картинка {optIndex + 1}
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) updateOptionImage(qIndex, optIndex, file);
                                    }} 
                                  />
                                </label>
                                <Input 
                                  placeholder="Подпись (необязательно)" 
                                  value={option} 
                                  onChange={(e) => updateOption(qIndex, optIndex, e.target.value)} 
                                />
                              </div>
                            )}

                            {q.options.length > 2 && (
                              <Button type="button" variant="ghost" size="sm" onClick={() => removeOption(qIndex, optIndex)} className="text-red-400 mt-1">
                                <Trash2 size={16} />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>

                      <Button type="button" variant="outline" size="sm" onClick={() => addOption(qIndex)} className="mt-3">
                        <Plus size={16} className="mr-1" /> Добавить вариант
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button type="submit" disabled={loading} className="w-full py-8 text-xl">
                {loading ? "Создаём квиз..." : "Создать квиз"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}