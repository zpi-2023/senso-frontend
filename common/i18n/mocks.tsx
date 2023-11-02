import type { PropsWithChildren } from "react";

import { I18nContext } from "./context";
import type { I18nData } from "./types";

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
    <I18nContext.Provider value={{ language, setLanguage: () => undefined }}>
      {children}
    </I18nContext.Provider>
  );
};
