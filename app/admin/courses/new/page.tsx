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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      alert("Заполните название и описание");
      return;
    }

    setLoading(true);

    try {
      let pdfUrl = null;

      // === ЗАГРУЗКА PDF ===
      if (pdfFile) {
        const fileName = `${Date.now()}-${pdfFile.name}`;

        console.log("Загружаем файл:", fileName);

        const { error: uploadError } = await supabase.storage
          .from("course-pdfs")
          .upload(fileName, pdfFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw new Error("Не удалось загрузить PDF: " + uploadError.message);
        }

        pdfUrl = supabase.storage
          .from("course-pdfs")
          .getPublicUrl(fileName).data.publicUrl;
      }

      // === СОЗДАНИЕ КУРСА ===
      const { error: insertError } = await supabase
        .from("courses")
        .insert({
          title,
          description,
          pdf_url: pdfUrl,
        });

      if (insertError) throw insertError;

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
                rows={6}
                className="w-full bg-slate-950 border border-slate-700 rounded-3xl p-5 resize-none"
              />

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
                className="w-full py-7 text-lg bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-semibold"
              >
                {loading ? "Загружаем файл и создаём курс..." : "Создать курс"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}