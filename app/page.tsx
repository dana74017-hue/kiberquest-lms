export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6 max-w-screen-2xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2 rounded-3xl text-sm font-medium">
              Для школьников и студентов
            </div>

            <h1 className="text-6xl md:text-7xl font-bold leading-none tracking-tighter">
              Учи веб-разработку<br />и IT с удовольствием
            </h1>

            <p className="text-xl text-muted-foreground max-w-lg">
              KiberQuest LMS — это современная образовательная платформа, 
              где ты можешь учиться веб-разработке через практику. 
              Живой редактор кода, интерактивные квизы, отслеживание прогресса 
              и удобный личный кабинет.
            </p>

            <div className="flex flex-wrap gap-4">
              <a 
                href="/courses" 
                className="px-10 py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-3xl text-lg inline-flex items-center gap-3 transition"
              >
                Начать обучение бесплатно
              </a>
              <a 
                href="/editor" 
                className="px-10 py-6 border border-border hover:bg-muted font-semibold rounded-3xl text-lg transition"
              >
                Попробовать редактор
              </a>
            </div>

            <div className="flex items-center gap-8 text-sm text-muted-foreground pt-4">
              <div>✓ Более 50 уроков</div>
              <div>✓ Живой редактор кода</div>
              <div>✓ Мгновенная обратная связь</div>
            </div>
          </div>

          {/* Превью редактора */}
          <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
            <div className="bg-muted rounded-2xl p-6 font-mono text-sm leading-relaxed text-foreground">
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
            <h2 className="text-4xl font-bold mb-4">Как это работает?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Мы сделали обучение максимально практичным и интересным
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-3xl p-10 text-center border border-border">
              <div className="text-6xl mb-6">📖</div>
              <h3 className="text-2xl font-semibold mb-4">1. Изучай теорию</h3>
              <p className="text-muted-foreground">
                Понятные уроки с примерами и объяснениями. 
                Всё разложено по полочкам.
              </p>
            </div>
            <div className="bg-card rounded-3xl p-10 text-center border border-border">
              <div className="text-6xl mb-6">💻</div>
              <h3 className="text-2xl font-semibold mb-4">2. Пиши код сразу</h3>
              <p className="text-muted-foreground">
                Встроенный редактор кода позволяет писать и проверять код 
                прямо в браузере без установки программ.
              </p>
            </div>
            <div className="bg-card rounded-3xl p-10 text-center border border-border">
              <div className="text-6xl mb-6">🎯</div>
              <h3 className="text-2xl font-semibold mb-4">3. Закрепляй знания</h3>
              <p className="text-muted-foreground">
                Проходи квизы, выполняй задания и отслеживай свой прогресс 
                в личном кабинете.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="py-20">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Почему выбирают KiberQuest?</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card border border-border rounded-3xl p-8">
              <h3 className="font-semibold text-xl mb-3">Практика с первого дня</h3>
              <p className="text-muted-foreground">Не просто теория, а сразу написание реального кода.</p>
            </div>
            <div className="bg-card border border-border rounded-3xl p-8">
              <h3 className="font-semibold text-xl mb-3">Мгновенная проверка</h3>
              <p className="text-muted-foreground">Видишь результат своей работы сразу после написания кода.</p>
            </div>
            <div className="bg-card border border-border rounded-3xl p-8">
              <h3 className="font-semibold text-xl mb-3">Удобный личный кабинет</h3>
              <p className="text-muted-foreground">Отслеживай прогресс, достижения и статистику обучения.</p>
            </div>
            <div className="bg-card border border-border rounded-3xl p-8">
              <h3 className="font-semibold text-xl mb-3">Подходит для новичков</h3>
              <p className="text-muted-foreground">Материал подаётся просто и понятно даже без опыта.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Финальный призыв к действию */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-screen-2xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Готов начать свой путь в IT?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
            Присоединяйся к платформе и начни учиться уже сегодня. 
            Это бесплатно и доступно с любого устройства.
          </p>
          <a 
            href="/courses" 
            className="inline-flex items-center justify-center px-12 py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg rounded-3xl transition"
          >
            Начать обучение
          </a>
        </div>
      </section>

      <footer className="py-12 text-center text-muted-foreground text-sm border-t border-border">
        KiberQuest LMS — образовательная платформа
      </footer>
    </div>
  );
}