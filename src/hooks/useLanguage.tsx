import { useState, useEffect } from "react";

export type Language = "en" | "pt" | "es";

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem("language");
    return (stored as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  return { language, setLanguage };
};
