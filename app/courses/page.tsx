"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Eye, BookOpen } from "lucide-react";
import Link from "next/link";

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [userRole, setUserRole] = useState<string>("student");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
    fetchUserRole();
  }, []);

  const fetchUserRole = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();
      if (data) setUserRole(data.role);
    }
  };

  const fetchCourses = async () => {
    const { data } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });

    setCourses(data || []);
    setLoading(false);
  };

  const incrementViews = async (courseId: string) => {
    // Надёжный способ увеличить счётчик просмотров
    const { data: current } = await supabase
      .from("courses")
      .select("views")
      .eq("id", courseId)
      .single();

    await supabase
      .from("courses")
      .update({ views: (current?.views || 0) + 1 })
      .eq("id", courseId);
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-2xl">Загрузка курсов...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-20 px-6">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-6xl font-bold tracking-tight">Курсы</h1>
            <p className="text-slate-400 text-xl mt-2">Выбери, чему хочешь научиться сегодня</p>
          </div>

          {(userRole === "teacher" || userRole === "admin") && (
            <Link href="/admin/courses/new">
              <Button className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold px-8 py-6 text-lg flex items-center gap-3">
                <Upload size={22} />
                Добавить курс
              </Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="bg-slate-900/70 border border-slate-700 hover:border-cyan-400 transition-all duration-300 group overflow-hidden"
            >
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center text-3xl">
                    📘
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold group-hover:text-cyan-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-2">{course.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-slate-400 mb-8">
                  <div className="flex items-center gap-1">
                    <Eye size={18} />
                    <span>{course.views || 0} просмотров</span>
                  </div>
                </div>

                {course.pdf_url && (
                  <a
                    href={course.pdf_url}
                    target="_blank"
                    onClick={() => incrementViews(course.id)}
                    className="block w-full text-center py-5 bg-white text-black rounded-3xl font-semibold hover:bg-cyan-400 hover:text-black transition-all"
                  >
                    📄 Открыть PDF
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {courses.length === 0 && (
          <p className="text-center text-slate-400 text-2xl py-20">Пока нет курсов. Добавь первый!</p>
        )}
      </div>
    </div>
  );
}