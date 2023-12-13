import { type Language } from "@/common/i18n/types";

export const wordleWords = {
  en: [
    "apple",
    "beach",
    "candy",
    "daisy",
    "eagle",
    "fairy",
    "grape",
    "happy",
    "jelly",
    "kitty",
    "lemon",
    "mango",
    "ninja",
    "olive",
    "piano",
    "queen",
    "radio",
    "sunny",
    "tiger",
    "vivid",
    "yacht",
    "zebra",
  ],
  pl: [
    "dusza",
    "kabel",
    "ekran",
    "fizyk",
    "grypa",
    "hakus",
    "jacht",
    "karma",
    "lampa",
    "miska",
    "pasta",
    "rampa",
    "tango",
    "ulica",
    "wazon",
    "zenon",
    "zamek",
    "zimno",
  ],
};

export const randomWord = (language: Language): string => {
  const words = wordleWords[language];
  return words[Math.floor(Math.random() * words.length)] as string;
};
