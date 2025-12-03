"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Language {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
}

export const languages: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸", nativeName: "English" },
  { code: "hi", name: "Hindi", flag: "🇮🇳", nativeName: "हिन्दी" },
  { code: "es", name: "Spanish", flag: "🇪🇸", nativeName: "Español" },
  { code: "fr", name: "French", flag: "🇫🇷", nativeName: "Français" },
  { code: "de", name: "German", flag: "🇩🇪", nativeName: "Deutsch" },
  { code: "zh", name: "Chinese", flag: "🇨🇳", nativeName: "中文" },
  { code: "ja", name: "Japanese", flag: "🇯🇵", nativeName: "日本語" },
];

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation keys
const translations: Record<string, Record<string, string>> = {
  en: {
    "nav.community": "Community",
    "nav.internships": "Internships",
    "nav.universityData": "University Data",
    "nav.language": "Language",
    "nav.light": "Light",
    "nav.dark": "Dark",
    "nav.signin": "Sign In",
    "footer.copyright": "© 2025 salaris.fyi. All rights reserved.",
    "footer.home": "Home",
    "footer.about": "About",
    "footer.contact": "Contact",
    "feedback.title": "Share Your Feedback",
    "feedback.rating": "Rate your experience",
    "feedback.message": "Your feedback",
    "feedback.submit": "Submit Feedback",
    "feedback.sending": "Sending...",
    "feedback.placeholder": "Tell us what you think...",
  },
  hi: {
    "nav.community": "समुदाय",
    "nav.internships": "इंटर्नशिप",
    "nav.universityData": "विश्वविद्यालय डेटा",
    "nav.language": "भाषा",
    "nav.light": "प्रकाश",
    "nav.dark": "अंधेरा",
    "nav.signin": "साइन इन",
    "footer.copyright": "© 2025 salaris.fyi. सभी अधिकार सुरक्षित।",
    "footer.home": "होम",
    "footer.about": "के बारे में",
    "footer.contact": "संपर्क",
    "feedback.title": "अपनी प्रतिक्रिया साझा करें",
    "feedback.rating": "अपने अनुभव को रेट करें",
    "feedback.message": "आपकी प्रतिक्रिया",
    "feedback.submit": "प्रतिक्रिया भेजें",
    "feedback.sending": "भेज रहे हैं...",
    "feedback.placeholder": "बताएं कि आप क्या सोचते हैं...",
  },
  es: {
    "nav.community": "Comunidad",
    "nav.internships": "Pasantías",
    "nav.universityData": "Datos Universitarios",
    "nav.language": "Idioma",
    "nav.light": "Claro",
    "nav.dark": "Oscuro",
    "nav.signin": "Iniciar Sesión",
    "footer.copyright": "© 2025 salaris.fyi. Todos los derechos reservados.",
    "footer.home": "Inicio",
    "footer.about": "Acerca de",
    "footer.contact": "Contacto",
    "feedback.title": "Comparte tu Opinión",
    "feedback.rating": "Califica tu experiencia",
    "feedback.message": "Tu opinión",
    "feedback.submit": "Enviar Opinión",
    "feedback.sending": "Enviando...",
    "feedback.placeholder": "Dinos qué piensas...",
  },
  fr: {
    "nav.community": "Communauté",
    "nav.internships": "Stages",
    "nav.universityData": "Données Universitaires",
    "nav.language": "Langue",
    "nav.light": "Clair",
    "nav.dark": "Sombre",
    "nav.signin": "Se Connecter",
    "footer.copyright": "© 2025 salaris.fyi. Tous droits réservés.",
    "footer.home": "Accueil",
    "footer.about": "À Propos",
    "footer.contact": "Contact",
    "feedback.title": "Partagez votre Avis",
    "feedback.rating": "Évaluez votre expérience",
    "feedback.message": "Votre avis",
    "feedback.submit": "Envoyer l'Avis",
    "feedback.sending": "Envoi en cours...",
    "feedback.placeholder": "Dites-nous ce que vous pensez...",
  },
  de: {
    "nav.community": "Gemeinschaft",
    "nav.internships": "Praktika",
    "nav.universityData": "Universitätsdaten",
    "nav.language": "Sprache",
    "nav.light": "Hell",
    "nav.dark": "Dunkel",
    "nav.signin": "Anmelden",
    "footer.copyright": "© 2025 salaris.fyi. Alle Rechte vorbehalten.",
    "footer.home": "Startseite",
    "footer.about": "Über uns",
    "footer.contact": "Kontakt",
    "feedback.title": "Teilen Sie Ihr Feedback",
    "feedback.rating": "Bewerten Sie Ihre Erfahrung",
    "feedback.message": "Ihr Feedback",
    "feedback.submit": "Feedback Senden",
    "feedback.sending": "Wird gesendet...",
    "feedback.placeholder": "Sagen Sie uns, was Sie denken...",
  },
  zh: {
    "nav.community": "社区",
    "nav.internships": "实习",
    "nav.universityData": "大学数据",
    "nav.language": "语言",
    "nav.light": "浅色",
    "nav.dark": "深色",
    "nav.signin": "登录",
    "footer.copyright": "© 2025 salaris.fyi. 版权所有。",
    "footer.home": "首页",
    "footer.about": "关于",
    "footer.contact": "联系",
    "feedback.title": "分享您的反馈",
    "feedback.rating": "评价您的体验",
    "feedback.message": "您的反馈",
    "feedback.submit": "提交反馈",
    "feedback.sending": "发送中...",
    "feedback.placeholder": "告诉我们您的想法...",
  },
  ja: {
    "nav.community": "コミュニティ",
    "nav.internships": "インターンシップ",
    "nav.universityData": "大学データ",
    "nav.language": "言語",
    "nav.light": "ライト",
    "nav.dark": "ダーク",
    "nav.signin": "サインイン",
    "footer.copyright": "© 2025 salaris.fyi. 全著作権所有。",
    "footer.home": "ホーム",
    "footer.about": "について",
    "footer.contact": "お問い合わせ",
    "feedback.title": "フィードバックを共有",
    "feedback.rating": "体験を評価",
    "feedback.message": "あなたのフィードバック",
    "feedback.submit": "フィードバックを送信",
    "feedback.sending": "送信中...",
    "feedback.placeholder": "あなたの考えを教えてください...",
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);

  useEffect(() => {
    // Load saved language preference
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("selectedLanguage");
      if (savedLanguage) {
        const language = languages.find(lang => lang.code === savedLanguage);
        if (language) {
          setCurrentLanguage(language);
        }
      }
    }
  }, []);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedLanguage", language.code);
      // Update document language attribute
      document.documentElement.lang = language.code;
    }
  };

  const t = (key: string): string => {
    return translations[currentLanguage.code]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
