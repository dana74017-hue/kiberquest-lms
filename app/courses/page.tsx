"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Eye } from "lucide-react";
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
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-2xl text-muted-foreground">Загрузка курсов...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 px-6">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-6xl font-bold tracking-tight">Курсы</h1>
            <p className="text-muted-foreground text-xl mt-2">
              Выбери, чему хочешь научиться сегодня
            </p>
          </div>

          {(userRole === "teacher" || userRole === "admin") && (
            <Link href="/admin/courses/new">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg flex items-center gap-3">
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
              className="bg-card border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden group"
            >
              {/* Обложка курса */}
              <div className="relative h-52 w-full bg-muted">
                {course.image_url ? (
                  <img
                    src={course.image_url}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-muted to-card">
                    📘
                  </div>
                )}
              </div>

              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-muted-foreground line-clamp-3 mb-6">
                  {course.description}
                </p>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Eye size={18} />
                    <span>{course.views || 0} просмотров</span>
                  </div>
                </div>

                {course.pdf_url && (
                  <a
                    href={course.pdf_url}
                    target="_blank"
                    onClick={() => incrementViews(course.id)}
                    className="mt-8 block w-full text-center py-5 bg-primary text-primary-foreground rounded-3xl font-semibold hover:bg-primary/90 transition-all"
                  >
                    📄 Открыть PDF курс
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-muted-foreground">Пока нет курсов.</p>
            {(userRole === "teacher" || userRole === "admin") && (
              <Link href="/admin/courses/new" className="mt-6 inline-block">
                <Button>Добавить первый курс</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}