import {
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

import data from "@/assets/i18n.json";

const DEFAULT_LANGUAGE = "en";

type TranslationKey = keyof typeof data;
type Language = "en" | "pl";
type I18nData = { language: Language };

const I18nContext = createContext<I18nData>({ language: DEFAULT_LANGUAGE });

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
export const useI18n = () => {
  const { language } = useContext(I18nContext);

  const t = (key: TranslationKey, substitutions: Record<string, any> = {}) => {
    const prop = data[key] as Record<Language, string | undefined>;
    let value = prop[language] ?? prop[DEFAULT_LANGUAGE] ?? null;

    if (!value) {
      return `t('${key}')`;
    }

    for (const [k, v] of Object.entries(substitutions)) {
      value = value?.replaceAll(`{${k}}`, v?.toString());
    }

    return value;
  };

  return { t };
};

/**
 * Provides translation context access to its children.
 *
 * @see useI18n
 * @see MockI18nProvider
 */
export const I18nProvider = ({ children }: PropsWithChildren) => {
  const [language] = useState<Language>(DEFAULT_LANGUAGE);
  // TODO: Setting language from app options
  return (
    <I18nContext.Provider value={{ language }}>{children}</I18nContext.Provider>
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
}: PropsWithChildren<I18nData>) => {
  if (!__DEV__) {
    throw new Error("MockI18nProvider should not be used in production!");
  }

  return (
    <I18nContext.Provider value={{ language }}>{children}</I18nContext.Provider>
  );
};
