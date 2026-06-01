"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function NewQuizPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return alert("Введите название квиза");

    setLoading(true);

    try {
      let imageUrl = null;

      // Загрузка обложки
      if (imageFile) {
        const fileName = `quiz-${Date.now()}-${imageFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("course-images")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        imageUrl = supabase.storage.from("course-images").getPublicUrl(fileName).data.publicUrl;
      }

      const { error } = await supabase.from("quizzes").insert({
        title,
        description: description || null,
        image_url: imageUrl,
      });

      if (error) throw error;

      alert("✅ Квиз успешно создан!");
      window.location.href = "/quiz";
    } catch (err: any) {
      alert("Ошибка: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-20 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Создать новый квиз</h1>
        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                placeholder="Название квиза"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <textarea
                placeholder="Описание квиза (необязательно)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-slate-950 border border-slate-700 rounded-3xl p-5"
              />

              <div>
                <label className="block text-sm mb-2">Обложка квиза (картинка)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-slate-300"
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full py-7 text-lg bg-gradient-to-r from-purple-400 to-pink-500 text-black font-semibold"
              >
                {loading ? "Создаём квиз..." : "Создать квиз"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}