"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";

export default function NewCoursePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !description) {
      alert("Заполните название и описание курса");
      return;
    }

    setLoading(true);

    try {
      let pdfUrl = "";

      if (pdfFile) {
        const fileName = `${Date.now()}-${pdfFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("course-pdfs")
          .upload(fileName, pdfFile);

        if (uploadError) throw uploadError;

        pdfUrl = supabase.storage.from("course-pdfs").getPublicUrl(fileName).data.publicUrl;
      }

      const { error } = await supabase.from("courses").insert({
        title,
        description,
        pdf_url: pdfUrl || null,
      });

      if (error) throw error;

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
                required
              />

              <textarea
                placeholder="Подробное описание курса..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full bg-slate-950 border border-slate-700 rounded-3xl p-5 text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400"
                required
              />

              <div>
                <label className="block text-sm mb-2 font-medium">PDF файл курса (необязательно)</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-slate-400 file:mr-4 file:py-3 file:px-6 file:rounded-3xl file:border-0 file:bg-slate-800 file:text-white hover:file:bg-slate-700"
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full py-7 text-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold"
              >
                {loading ? "Создаём курс..." : "Создать курс"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}