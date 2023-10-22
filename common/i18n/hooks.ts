import { useCallback, useContext } from "react";

import { DEFAULT_LANGUAGE } from "./consts";
import { I18nContext } from "./context";
import type { I18n, Language, Translator } from "./types";

import data from "@/assets/i18n.json";

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
