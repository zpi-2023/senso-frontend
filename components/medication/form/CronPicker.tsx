import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Keyboard, View } from "react-native";
import { TextInput } from "react-native-paper";

import type { FormProp } from "./types";

import { useI18n } from "@/common/i18n";
import { parseNum } from "@/common/parsing";

type CronPickerProps = {
  form: FormProp;
};

export const CronPicker = ({
  form: { values, setFieldValue },
}: CronPickerProps) => {
  const { t } = useI18n();

  const [shown, setShown] = useState(false);

  return (
    <View>
      <TextInput
        mode="outlined"
        label={t("medication.details.cron")}
        value={cronToDisplay(values.localCron)}
        showSoftInputOnFocus={false}
        onFocus={() => setShown(true)}
        right={
          values.localCron.trim().length > 0 ? (
            <TextInput.Icon
              icon="close"
              onPressOut={() => {
                setShown(false);
                Keyboard.dismiss();
                void setFieldValue("localCron", "");
              }}
            />
          ) : null
        }
      />
      {shown ? (
        <DateTimePicker
          mode="time"
          value={cronToDate(values.localCron)}
          timeZoneOffsetInMinutes={0}
          onChange={(e) => {
            setShown(false);
            Keyboard.dismiss();
            if (e.type === "set" && e.nativeEvent.timestamp !== undefined) {
              const totalMinutes = Math.floor(
                e.nativeEvent.timestamp / 1000 / 60,
              );
              const hour = Math.floor(totalMinutes / 60);
              const minute = totalMinutes % 60;
              void setFieldValue("localCron", `${minute} ${hour} * * *`);
            }
          }}
        />
      ) : null}
    </View>
  );
};

const cronToDisplay = (cron: string): string => {
  if (cron.trim().length === 0) {
    return "";
  }

  const [minute, hour] = cron.split(" ");
  if (!minute || !hour) {
    return "";
  }

  return `${hour}:${minute?.padStart(2, "0")}`;
};

const cronToDate = (cron: string): Date => {
  if (cron.trim().length === 0) {
    return new Date(0);
  }

  const [minute, hour] = cron.split(" ").map((v) => parseNum(v));
  if (!minute || !hour) {
    return new Date(0);
  }

  return new Date((hour * 60 + minute) * 60 * 1000);
};
