import { useState, useCallback } from "react";
import { View } from "react-native";
import { HelperText, Menu, TextInput } from "react-native-paper";

import type { FormProp, MedicationInfo } from "./types";

import { useDebounce, useQuery } from "@/common/api";
import { useI18n } from "@/common/i18n";

type MedicationPickerProps = {
  form: FormProp;
  disabled?: boolean;
};

export const MedicationPicker = ({
  form: { values, touched, errors, handleBlur, setFieldValue },
  disabled,
}: MedicationPickerProps) => {
  const { t } = useI18n();

  const [focused, setFocused] = useState(false);
  const search = useDebounce(values.medicationName, 200);
  const { data } = useQuery({
    url: "/api/v1/reminders/medications",
    params: { query: { search } },
  });
  const suggestions = data?.medications?.length ?? 0;

  const selectMedication = useCallback(
    (medication: MedicationInfo) => {
      void Promise.all([
        setFieldValue("medicationName", medication.name),
        setFieldValue(
          "medicationAmountInPackage",
          medication.amountInPackage?.toString() ?? "",
        ),
        setFieldValue("amountUnit", medication.amountUnit ?? ""),
      ]);
    },
    [setFieldValue],
  );

  return (
    <View>
      <Menu
        visible={focused && suggestions > 0}
        onDismiss={() => setFocused(false)}
        anchor={
          <TextInput
            mode="outlined"
            label={t("medication.details.medicationName")}
            onChangeText={(text) => {
              void setFieldValue("medicationName", text);
              setFocused(true);
            }}
            onBlur={(e) => {
              handleBlur("medicationName")(e);
              setFocused(false);
            }}
            value={values.medicationName}
            error={"medicationName" in errors}
            disabled={disabled}
          />
        }
        anchorPosition="bottom"
      >
        {(data?.medications ?? []).map((item) => {
          let title = item.name;
          if (item.amountInPackage) {
            title += ` - ${item.amountInPackage} `;
            if (item.amountUnit) {
              title += item.amountUnit;
            } else {
              title += t("medication.pills", {
                count: item.amountInPackage,
              });
            }
          }

          return (
            <Menu.Item
              key={[item.name, item.amountInPackage, item.amountUnit].join("-")}
              title={title}
              onPress={() => {
                selectMedication(item);
                setFocused(false);
              }}
            />
          );
        })}
      </Menu>
      {touched.medicationName && errors.medicationName ? (
        <HelperText type="error">{errors.medicationName}</HelperText>
      ) : null}
    </View>
  );
};
