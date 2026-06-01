"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [userRole, setUserRole] = useState<string>("student");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Получаем текущего пользователя и его роль
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        
        if (data) setUserRole(data.role);
      }

      // Загружаем курсы
      const { data: coursesData } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      setCourses(coursesData || []);
      setLoading(false);
    });
  }, []);

  const uploadPDF = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("course-pdfs")
      .upload(fileName, file);

    if (error) {
      alert("Ошибка загрузки PDF: " + error.message);
      return;
    }

    const publicUrl = supabase.storage.from("course-pdfs").getPublicUrl(fileName).data.publicUrl;

    // Создаём новый курс
    const { error: insertError } = await supabase
      .from("courses")
      .insert({
        title: "Новый курс",
        description: "Описание курса...",
        pdf_url: publicUrl,
        created_by: (await supabase.auth.getUser()).data.user?.id
      });

    if (!insertError) {
      alert("Курс успешно добавлен!");
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-20 px-6">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-bold">Курсы</h1>
          
          {/* Кнопка добавления только для преподавателя и админа */}
          {(userRole === "teacher" || userRole === "admin") && (
            <label className="cursor-pointer">
              <input type="file" accept=".pdf" onChange={uploadPDF} className="hidden" />
              <Button className="bg-cyan-500 hover:bg-cyan-400 text-black flex items-center gap-3">
                <Upload size={20} />
                Добавить курс (PDF)
              </Button>
            </label>
          )}
        </div>

        {loading ? (
          <p className="text-center text-xl">Загрузка курсов...</p>
        ) : courses.length === 0 ? (
          <p className="text-center text-slate-400 text-xl">Пока нет курсов</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Card key={course.id} className="bg-slate-900 border border-slate-700 hover:border-cyan-400 transition-all">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold mb-3 text-white">{course.title}</h3>
                  <p className="text-slate-300 mb-6">{course.description}</p>
                  
                  {course.pdf_url && (
                    <a
                      href={course.pdf_url}
                      target="_blank"
                      className="block w-full py-4 text-center bg-slate-800 hover:bg-cyan-500 hover:text-black rounded-3xl font-medium transition-all"
                    >
                      📄 Открыть PDF
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}