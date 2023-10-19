import { useState } from "react";
import { MMKV, useMMKVObject } from "react-native-mmkv";

import { DEFAULT_LANGUAGE } from "./consts";
import type { Language } from "./types";

// We can't use storage in Expo Go, so we need to disable it in dev mode.

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
