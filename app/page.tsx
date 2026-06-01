export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6 max-w-screen-2xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 text-cyan-400 px-5 py-2 rounded-3xl text-sm font-medium">
              🚀 Для школьников и студентов
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold leading-none tracking-tighter">
              Учи веб-разработку<br />и IT с удовольствием
            </h1>
            
            <p className="text-xl text-slate-300 max-w-md">
              Интерактивная платформа с живым редактором кода, квизами, 
              прогрессом и личным кабинетом.
            </p>

            <div className="flex gap-4">
              <a href="/courses" 
                 className="px-10 py-6 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-3xl text-lg inline-flex items-center gap-3">
                Начать обучение бесплатно
              </a>
              <a href="/editor" 
                 className="px-10 py-6 border border-white/30 hover:bg-white/10 font-semibold rounded-3xl text-lg">
                Попробовать редактор
              </a>
            </div>
          </div>

          {/* Превью редактора */}
          <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl p-8 shadow-2xl">
            <div className="bg-slate-950 rounded-2xl p-6 font-mono text-cyan-300 text-sm leading-relaxed">
              &lt;h1 style="color: #22d3ee"&gt;Привет, KiberQuest!&lt;/h1&gt;<br />
              &lt;p&gt;Это твой первый сайт на платформе&lt;/p&gt;
            </div>
            <div className="mt-6 text-center text-cyan-400 text-sm font-medium">
              Живой редактор кода • Результат сразу на экране
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-screen-2xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Что умеет KiberQuest LMS</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800 rounded-3xl p-10 text-center hover:bg-slate-700 transition">
              <div className="text-6xl mb-6">📚</div>
              <h3 className="text-2xl font-semibold mb-3">Курсы</h3>
              <p className="text-slate-400">HTML, CSS, JavaScript, React и многое другое</p>
            </div>
            <div className="bg-slate-800 rounded-3xl p-10 text-center hover:bg-slate-700 transition">
              <div className="text-6xl mb-6">💻</div>
              <h3 className="text-2xl font-semibold mb-3">Редактор кода</h3>
              <p className="text-slate-400">Пиши код прямо в браузере и сразу видишь результат</p>
            </div>
            <div className="bg-slate-800 rounded-3xl p-10 text-center hover:bg-slate-700 transition">
              <div className="text-6xl mb-6">📊</div>
              <h3 className="text-2xl font-semibold mb-3">Личный кабинет</h3>
              <p className="text-slate-400">Прогресс, достижения, статистика</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 text-center text-slate-500 text-sm border-t border-slate-800">
        KiberQuest LMS — дипломная работа • 2026
      </footer>
    </div>
  );
}