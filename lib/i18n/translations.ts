export const translations = {
  ru: {
    // Navbar
    nav: {
      home: "Главная",
      courses: "Курсы",
      editor: "Редактор",
      quiz: "Квизы",
      dashboard: "Кабинет",
      admin: "Админ",
      login: "Войти",
    },
    // Общие
    common: {
      save: "Сохранить",
      cancel: "Отмена",
      loading: "Загрузка...",
    },
  },

  en: {
    nav: {
      home: "Home",
      courses: "Courses",
      editor: "Editor",
      quiz: "Quizzes",
      dashboard: "Dashboard",
      admin: "Admin",
      login: "Login",
    },
    common: {
      save: "Save",
      cancel: "Cancel",
      loading: "Loading...",
    },
  },

  kz: {
    nav: {
      home: "Басты бет",
      courses: "Курстар",
      editor: "Редактор",
      quiz: "Квиздер",
      dashboard: "Кабинет",
      admin: "Админ",
      login: "Кіру",
    },
    common: {
      save: "Сақтау",
      cancel: "Бас тарту",
      loading: "Жүктелуде...",
    },
  },
} as const;

export type Locale = keyof typeof translations;