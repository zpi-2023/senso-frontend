import { useCallback, useContext } from "react";

import { pluralizationSubstitution } from "./consts";
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
      // Lookup
      const prop = (data[key] ?? {}) as Record<Language, string | undefined>;
      let value = prop[language] ?? null;
      if (!value) {
        return `t('${key}')`;
      }

      // Pluralization
      if (pluralizationSubstitution in substitutions) {
        const count = Number(substitutions[pluralizationSubstitution]);
        const variants = Object.fromEntries(
          Object.keys(prop)
            .filter((k) => k.startsWith(`${language}_`))
            .flatMap((k) =>
              (k.split("_")[1] ?? "")
                .split(",")
                .map((n) => [Number(n), prop[k as keyof typeof prop]]),
            ),
        );

        const pluralized = variants[count];
        if (pluralized) {
          value = pluralized;
        }
      }

      // Substitution
      for (const [k, v] of Object.entries(substitutions)) {
        value = value?.replaceAll(`{${k}}`, String(v));
      }

      return value;
    },
    [language],
  );

  const toggleLanguage = useCallback(
    () => setLanguage(language === "en" ? "pl" : "en"),
    [language, setLanguage],
  );

  return { t, language, toggleLanguage };
};
