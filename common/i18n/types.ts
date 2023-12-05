import type data from "@/assets/i18n.json";

export type TranslationKey = keyof typeof data;

export type Language = "en" | "pl";

export type I18nData = {
  language: Language;
  setLanguage: (language: Language) => void;
};

export type Translator = (
  key: TranslationKey,
  substitutions?: Record<string, unknown>,
) => string;

export type I18n = {
  t: Translator;
  language: Language;
  toggleLanguage: () => void;
};
