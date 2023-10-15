import { useState } from "react";
import { MMKV, useMMKVObject } from "react-native-mmkv";

import { IdentityData } from "./types";

// We can't use storage in Expo Go, so we need to disable it in dev mode.

const identityStorage = __DEV__ ? null : new MMKV({ id: "identity" });

export const useIdentityStorage = (
  defaultData: IdentityData,
): [IdentityData, (newData: IdentityData) => void] => {
  const [value, setValue] = __DEV__
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useState<IdentityData>(defaultData)
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      useMMKVObject<IdentityData>("identity-data", identityStorage!);
  return [value ?? defaultData, setValue];
};
