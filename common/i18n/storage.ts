import { useState } from "react";
import { MMKV, useMMKVObject } from "react-native-mmkv";

import { defaultLanguage } from "./consts";
import type { Language } from "./types";

// We can't use storage in Expo Go, so we need to disable it in dev mode.

const languageStorage = __DEV__ ? null : new MMKV({ id: "language" });

export const useLanguageStorage = (): [
  Language,
  (language: Language) => void,
] => {
  const [value, setValue] = __DEV__
    ? // eslint-disable-next-line react-hooks/rules-of-hooks -- the call order is stable between renders
      useState<Language>(defaultLanguage)
    : // eslint-disable-next-line react-hooks/rules-of-hooks -- the call order is stable between renders
      useMMKVObject<Language>("identity-data", languageStorage!);
  return [value ?? defaultLanguage, setValue];
};
