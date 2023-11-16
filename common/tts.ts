import * as Speech from "expo-speech";
import { useCallback } from "react";

import { useI18n } from "./i18n";

export const useSpeech = () => {
  const { language } = useI18n();

  const speak = useCallback(
    async (utterance: string) => {
      await Speech.stop();
      Speech.speak(utterance, { language });
    },
    [language],
  );

  return { speak };
};
