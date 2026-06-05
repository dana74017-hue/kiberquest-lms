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
    if (!title || !description) {
      alert("Заполните название и описание");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = null;
      let pdfUrl = null;

      // === ЗАГРУЗКА КАРТИНКИ (обложка) ===
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop() || "jpg";
        const safeFileName = `course-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("course-images")
          .upload(safeFileName, imageFile);

        if (uploadError) throw uploadError;

        imageUrl = supabase.storage
          .from("course-images")
          .getPublicUrl(safeFileName).data.publicUrl;
      }

      // === ЗАГРУЗКА PDF ===
      if (pdfFile) {
        const fileExt = pdfFile.name.split(".").pop() || "pdf";
        const safeFileName = `pdf-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("course-pdfs")
          .upload(safeFileName, pdfFile);

        if (uploadError) throw uploadError;

        pdfUrl = supabase.storage
          .from("course-pdfs")
          .getPublicUrl(safeFileName).data.publicUrl;
      }

      // === СОЗДАНИЕ КУРСА ===
      const { error } = await supabase.from("courses").insert({
        title,
        description,
        image_url: imageUrl,
        pdf_url: pdfUrl,
      });

      if (error) throw error;

      alert("✅ Курс успешно добавлен!");
      window.location.href = "/courses";

    } catch (err: any) {
      console.error(err);
      alert("Ошибка: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Добавить новый курс</h1>

        <Card>
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
                rows={6}
                className="w-full bg-muted border border-border rounded-3xl p-5"
              />

              <div>
                <label className="block text-sm mb-2 text-muted-foreground">
                  Обложка курса (картинка)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-muted-foreground">
                  PDF файл курса (необязательно)
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm"
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full py-7 text-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold"
              >
                {loading ? "Загружаем файлы..." : "Создать курс"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}