import { type PropsWithChildren, createContext } from "react";

import { DEFAULT_LANGUAGE } from "./consts";
import { useLanguageStorage } from "./storage";
import { I18nData } from "./types";

export const I18nContext = createContext<I18nData>({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
});

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
