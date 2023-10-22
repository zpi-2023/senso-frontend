import type data from "@/assets/i18n.json";

type TranslationKey = keyof typeof data;

export type Language = "en" | "pl";

export type I18nData = {
  language: Language;
  setLanguage: (language: Language) => void;
};

export type Translator = (
  key: TranslationKey,
  substitutions?: Record<string, any>,
) => string;

export type I18n = {
  t: Translator;
  toggleLanguage: () => void;
};
