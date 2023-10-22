import {
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import { MMKV, useMMKVObject } from "react-native-mmkv";

import data from "@/assets/i18n.json";

const DEFAULT_LANGUAGE = "en";

type TranslationKey = keyof typeof data;
type Language = "en" | "pl";
type I18nData = {
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

const I18nContext = createContext<I18nData>({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
});

/**
 * Used to access translation strings in a component.
 *
 * You can modify the translation strings in `assets/i18n.json`.
 *
 * @see I18nProvider
 *
 * @example
 * // Basic usage
 * const { t } = useI18n();
 * return <Text>{t("exampleKey")}</Text>;
 * // Substitutions ({ "exampleKey": { "en": "Hi, my name is {name}!" } })
 * const { t } = useI18n();
 * return <Text>{t("exampleKey", { name: "John" })}</Text>; // => Hi, my name is John!
 */
export const useI18n = (): I18n => {
  const { language, setLanguage } = useContext(I18nContext);

  const t: Translator = useCallback(
    (key, substitutions = {}) => {
      const prop = (data[key] ?? {}) as Record<Language, string | undefined>;
      let value = prop[language] ?? prop[DEFAULT_LANGUAGE] ?? null;

      if (!value) {
        return `t('${key}')`;
      }

      for (const [k, v] of Object.entries(substitutions)) {
        value = value?.replaceAll(`{${k}}`, v?.toString());
      }

      return value;
    },
    [language],
  );

  const toggleLanguage = useCallback(
    () => setLanguage(language === "en" ? "pl" : "en"),
    [language, setLanguage],
  );

  return { t, toggleLanguage };
};

const languageStorage = __DEV__ ? null : new MMKV({ id: "language" });

export const useLanguageStorage = (): [
  Language,
  (language: Language) => void,
] => {
  const [value, setValue] = __DEV__
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useState<Language>(DEFAULT_LANGUAGE)
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      useMMKVObject<Language>("identity-data", languageStorage!);
  return [value ?? DEFAULT_LANGUAGE, setValue];
};

/**
 * Provides translation context access to its children.
 *
 * @see useI18n
 * @see MockI18nProvider
 */
export const I18nProvider = ({ children }: PropsWithChildren) => {
  const [language, setLanguage] = useLanguageStorage();
  return (
    <I18nContext.Provider value={{ language, setLanguage }}>
      {children}
    </I18nContext.Provider>
  );
};

/**
 * Used to enforce a specific language in translation tests.
 *
 * @see I18nProvider
 */
export const MockI18nProvider = ({
  children,
  language,
}: PropsWithChildren<Pick<I18nData, "language">>) => {
  if (!__DEV__) {
    throw new Error("MockI18nProvider should not be used in production!");
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage: () => {} }}>
      {children}
    </I18nContext.Provider>
  );
};
