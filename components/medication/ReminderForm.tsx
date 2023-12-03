import { Formik, type FormikErrors } from "formik";
import { useState } from "react";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { Button } from "react-native-paper";

import { useI18n, type Translator } from "@/common/i18n";
import { sty } from "@/common/styles";
import type { ReminderCreateData, ReminderEditData } from "@/logic/medication";

type ReminderFormValues = {
  medicationName: string;
  medicationAmountInPackage: number;
  amountPerIntake: number;
  amountOwned: number;
  amountUnit: string;
  cron: string;
  description: string;
};

type ReminderFormProps = {
  kind: "create" | "edit";
  initialValues: ReminderCreateData | ReminderEditData;
  onCreateSubmit?: (values: ReminderCreateData) => void;
  onEditSubmit?: (values: ReminderEditData) => void;
  submitText: string;
};

export const ReminderForm = ({
  kind,
  initialValues,
  onCreateSubmit,
  onEditSubmit,
  submitText,
}: ReminderFormProps) => {
  const { t } = useI18n();
  const [status, setStatus] = useState<"idle" | "pending">("idle");

  return (
    <Formik
      initialValues={serialize(initialValues)}
      validate={(v) => validate(v, t)}
      validateOnBlur={true}
      validateOnChange={false}
      onSubmit={(v) => {
        setStatus("pending");
        onCreateSubmit?.(deserializeCreate(v));
        onEditSubmit?.(deserializeEdit(v));
      }}
    >
      {({
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
        setFieldValue,
        handleSubmit,
      }) => (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.container}>
            <Button
              disabled={status === "pending"}
              loading={status === "pending"}
              mode="contained"
              onPress={() => handleSubmit()}
              style={styles.submit}
            >
              {submitText}
            </Button>
          </View>
        </TouchableWithoutFeedback>
      )}
    </Formik>
  );
};

const styles = sty.create({
  container: {
    flex: 1,
    padding: 32,
    gap: 16,
  },
  description: {
    minHeight: 100,
  },
  submit: {
    marginTop: "auto",
  },
});

const serialize = (
  values: ReminderCreateData | ReminderEditData,
): ReminderFormValues => {
  const extract = <T, K extends keyof ReminderFormValues>(key: K) =>
    key in values ? (values[key as keyof typeof values] as T) : null;

  return {
    medicationName: extract("medicationName") ?? "",
    medicationAmountInPackage: extract("medicationAmountInPackage") ?? 0,
    amountPerIntake: values.amountPerIntake,
    amountOwned: values.amountOwned ?? 0,
    amountUnit: extract("amountUnit") ?? "",
    cron: values.cron ?? "",
    description: values.description ?? "",
  };
};

const deserializeCreate = (values: ReminderFormValues): ReminderCreateData => ({
  ...deserializeEdit(values),
  medicationName: values.medicationName,
  medicationAmountInPackage:
    values.medicationAmountInPackage > 0
      ? values.medicationAmountInPackage
      : null,
  amountUnit: values.amountUnit.trim().length > 0 ? values.amountUnit : null,
  cron: values.cron.trim().length > 0 ? values.cron : null,
  description: values.description.trim().length > 0 ? values.description : null,
});

const deserializeEdit = (values: ReminderFormValues): ReminderEditData => ({
  amountPerIntake: values.amountPerIntake,
  amountOwned: values.amountOwned > 0 ? values.amountOwned : null,
  cron: values.cron.trim().length > 0 ? values.cron : null,
  description: values.description.trim().length > 0 ? values.description : null,
});

const validate = (
  values: ReminderFormValues,
  t: Translator,
): FormikErrors<ReminderFormValues> => {
  const errors: FormikErrors<ReminderFormValues> = {};
  if (values.medicationName.length === 0) {
    errors.medicationName = t("medication.form.medicationNameRequired");
  }

  if (values.medicationAmountInPackage < 0) {
    errors.medicationAmountInPackage = t(
      "medication.form.medicationAmountInPackageNonnegative",
    );
  }

  if (values.amountPerIntake <= 0) {
    errors.amountPerIntake = t("medication.form.amountPerIntakeRequired");
  }

  if (values.amountOwned < 0) {
    errors.amountOwned = t("medication.form.amountOwnedNonnegative");
  }

  return errors;
};
