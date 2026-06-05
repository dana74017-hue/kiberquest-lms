"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Home() {
  const { locale, t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6 max-w-screen-2xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2 rounded-3xl text-sm font-medium">
              {t("home.badge")}
            </div>

            <h1 className="text-6xl md:text-7xl font-bold leading-none tracking-tighter whitespace-pre-line">
              {t("home.title")}
            </h1>

            <p className="text-xl text-muted-foreground max-w-lg">
              {t("home.description")}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link 
                href={`/${locale}/courses`} 
                className="px-10 py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-3xl text-lg inline-flex items-center gap-3 transition"
              >
                {t("home.startLearning")}
              </Link>
              <Link 
                href={`/${locale}/editor`} 
                className="px-10 py-6 border border-border hover:bg-muted font-semibold rounded-3xl text-lg transition"
              >
                {t("home.tryEditor")}
              </Link>
            </div>

            <div className="flex items-center gap-8 text-sm text-muted-foreground pt-4">
              <div>✓ {t("home.features.lessons")}</div>
              <div>✓ {t("home.features.editor")}</div>
              <div>✓ {t("home.features.feedback")}</div>
            </div>
          </div>

          {/* Превью редактора */}
          <div className="bg-card border border-border rounded-3xl p-8">
            <div className="bg-muted rounded-2xl p-6 font-mono text-sm leading-relaxed">
              &lt;h1 style="color: #22d3ee"&gt;Привет, KiberQuest!&lt;/h1&gt;<br />
              &lt;p&gt;Это твой первый сайт на платформе&lt;/p&gt;
            </div>
            <div className="mt-6 text-center text-primary text-sm font-medium">
              Живой редактор кода • Результат сразу на экране
            </div>
          </div>
        </div>
      </section>

      {/* Как это работает */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t("home.howItWorks.title")}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("home.howItWorks.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-3xl p-10 text-center border border-border">
              <div className="text-6xl mb-6">📖</div>
              <h3 className="text-2xl font-semibold mb-4">{t("home.howItWorks.step1.title")}</h3>
              <p className="text-muted-foreground">{t("home.howItWorks.step1.description")}</p>
            </div>
            <div className="bg-card rounded-3xl p-10 text-center border border-border">
              <div className="text-6xl mb-6">💻</div>
              <h3 className="text-2xl font-semibold mb-4">{t("home.howItWorks.step2.title")}</h3>
              <p className="text-muted-foreground">{t("home.howItWorks.step2.description")}</p>
            </div>
            <div className="bg-card rounded-3xl p-10 text-center border border-border">
              <div className="text-6xl mb-6">🎯</div>
              <h3 className="text-2xl font-semibold mb-4">{t("home.howItWorks.step3.title")}</h3>
              <p className="text-muted-foreground">{t("home.howItWorks.step3.description")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="py-20">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t("home.whyUs.title")}</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card border border-border rounded-3xl p-8">
              <h3 className="font-semibold text-xl mb-3">{t("home.whyUs.practice.title")}</h3>
              <p className="text-muted-foreground">{t("home.whyUs.practice.description")}</p>
            </div>
            <div className="bg-card border border-border rounded-3xl p-8">
              <h3 className="font-semibold text-xl mb-3">{t("home.whyUs.feedback.title")}</h3>
              <p className="text-muted-foreground">{t("home.whyUs.feedback.description")}</p>
            </div>
            <div className="bg-card border border-border rounded-3xl p-8">
              <h3 className="font-semibold text-xl mb-3">{t("home.whyUs.cabinet.title")}</h3>
              <p className="text-muted-foreground">{t("home.whyUs.cabinet.description")}</p>
            </div>
            <div className="bg-card border border-border rounded-3xl p-8">
              <h3 className="font-semibold text-xl mb-3">{t("home.whyUs.beginners.title")}</h3>
              <p className="text-muted-foreground">{t("home.whyUs.beginners.description")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Финальный призыв к действию */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-screen-2xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">{t("home.cta.title")}</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
            {t("home.cta.description")}
          </p>
          <Link 
            href={`/${locale}/courses`} 
            className="inline-flex items-center justify-center px-12 py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg rounded-3xl transition"
          >
            {t("home.cta.button")}
          </Link>
        </div>
      </section>

      <footer className="py-12 text-center text-muted-foreground text-sm border-t border-border">
        KiberQuest LMS — образовательная платформа
      </footer>
    </div>
  );
}