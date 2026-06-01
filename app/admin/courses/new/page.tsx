"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function NewCoursePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return alert("Заполните название и описание");

    setLoading(true);

    try {
      let pdfUrl = null;
      let imageUrl = null;

      // Загрузка обложки (картинки)
      if (imageFile) {
        const fileName = `images/${Date.now()}-${imageFile.name}`;
        const { error } = await supabase.storage
          .from("course-images")
          .upload(fileName, imageFile);
        if (error) throw error;
        imageUrl = supabase.storage.from("course-images").getPublicUrl(fileName).data.publicUrl;
      }

      // Загрузка PDF
      if (pdfFile) {
        const fileName = `pdfs/${Date.now()}-${pdfFile.name}`;
        const { error } = await supabase.storage
          .from("course-pdfs")
          .upload(fileName, pdfFile);
        if (error) throw error;
        pdfUrl = supabase.storage.from("course-pdfs").getPublicUrl(fileName).data.publicUrl;
      }

      // Создаём курс
      const { error: insertError } = await supabase.from("courses").insert({
        title,
        description,
        pdf_url: pdfUrl,
        image_url: imageUrl,
      });

      if (insertError) throw insertError;

      alert("✅ Курс успешно добавлен!");
      window.location.href = "/courses";
    } catch (err: any) {
      alert("Ошибка: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-20 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Добавить новый курс</h1>
        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                placeholder="Название курса"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <textarea
                placeholder="Описание курса..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full bg-slate-950 border border-slate-700 rounded-3xl p-5"
              />

              {/* Обложка курса */}
              <div>
                <label className="block text-sm mb-2">Обложка курса (картинка)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-slate-300"
                />
              </div>

              {/* PDF */}
              <div>
                <label className="block text-sm mb-2">PDF файл курса (необязательно)</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-slate-300"
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full py-7 text-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-black"
              >
                {loading ? "Загружаем..." : "Создать курс"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}