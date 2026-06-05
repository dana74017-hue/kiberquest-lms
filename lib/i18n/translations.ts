export const translations = {
  ru: {
    // === Navbar ===
    nav: {
      home: "Главная",
      courses: "Курсы",
      editor: "Редактор",
      quiz: "Квизы",
      dashboard: "Кабинет",
      admin: "Админ",
      login: "Войти",
    },

    // === Главная страница ===
    home: {
      badge: "Для школьников и студентов",
      title: "Учи веб-разработку\nи IT с удовольствием",
      description: "KiberQuest LMS — это современная образовательная платформа, где ты можешь учиться веб-разработке через практику. Живой редактор кода, интерактивные квизы, отслеживание прогресса и удобный личный кабинет.",
      startLearning: "Начать обучение бесплатно",
      tryEditor: "Попробовать редактор",
      features: {
        lessons: "Более 50 уроков",
        editor: "Живой редактор кода",
        feedback: "Мгновенная обратная связь",
      },
    },

    // === Общие ===
    common: {
      save: "Сохранить",
      cancel: "Отмена",
      loading: "Загрузка...",
    },
  },

  en: {
    // === Navbar ===
    nav: {
      home: "Home",
      courses: "Courses",
      editor: "Editor",
      quiz: "Quizzes",
      dashboard: "Dashboard",
      admin: "Admin",
      login: "Login",
    },

    // === Главная страница ===
    home: {
      badge: "For school and university students",
      title: "Learn web development\nand IT with pleasure",
      description: "KiberQuest LMS is a modern educational platform where you can learn web development through practice. Live code editor, interactive quizzes, progress tracking, and a convenient personal account.",
      startLearning: "Start learning for free",
      tryEditor: "Try the editor",
      features: {
        lessons: "50+ lessons",
        editor: "Live code editor",
        feedback: "Instant feedback",
      },
    },

    // === Общие ===
    common: {
      save: "Save",
      cancel: "Cancel",
      loading: "Loading...",
    },
  },

  kz: {
    // === Navbar ===
    nav: {
      home: "Басты бет",
      courses: "Курстар",
      editor: "Редактор",
      quiz: "Квиздер",
      dashboard: "Кабинет",
      admin: "Админ",
      login: "Кіру",
    },

    // === Главная страница ===
    home: {
      badge: "Мектеп және университет студенттері үшін",
      title: "Веб-әзірлеу және IT-ны\nрахаттана үйреніңіз",
      description: "KiberQuest LMS — бұл тәжірибе арқылы веб-әзірлеуді үйренуге болатын заманауи білім беру платформасы. Тікелей код редакторы, интерактивті квиздер, прогресті бақылау және ыңғайлы жеке кабинет.",
      startLearning: "Тегін оқуды бастау",
      tryEditor: "Редакторды қолдану",
      features: {
        lessons: "50+ сабақ",
        editor: "Тікелей код редакторы",
        feedback: "Лезде кері байланыс",
      },
    },

    // === Общие ===
    common: {
      save: "Сақтау",
      cancel: "Бас тарту",
      loading: "Жүктелуде...",
    },
  },
} as const;

export type Locale = keyof typeof translations;