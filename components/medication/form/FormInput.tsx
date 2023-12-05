import { type ComponentProps } from "react";
import { View } from "react-native";
import { HelperText, TextInput } from "react-native-paper";

import type { FormProp, ReminderFormValues } from "./types";

import { useI18n, type TranslationKey } from "@/common/i18n";

type FormInputProps = {
  field: keyof ReminderFormValues;
  form: FormProp;
  amountAffix?: boolean;
} & Partial<ComponentProps<typeof TextInput>>;

export const FormInput = ({
  field,
  form: { values, touched, errors, handleChange, handleBlur },
  amountAffix,
  ...props
}: FormInputProps) => {
  const { t } = useI18n();

  const right = amountAffix ? (
    <TextInput.Affix
      text={
        values.amountUnit.trim().length > 0
          ? values.amountUnit
          : t("medication.pills", { count: values[field] })
      }
    />
  ) : undefined;

  return (
    <View>
      <TextInput
        {...props}
        mode="outlined"
        label={t(`medication.details.${field}` as TranslationKey)}
        onChangeText={handleChange(field)}
        onBlur={handleBlur(field)}
        value={values[field]}
        error={field in errors}
        right={right}
      />
      {touched[field] && errors[field] ? (
        <HelperText type="error">{errors[field]}</HelperText>
      ) : null}
    </View>
  );
};
