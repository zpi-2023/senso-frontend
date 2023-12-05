import { Formik, type FormikErrors } from "formik";
import { useState } from "react";
import {
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button } from "react-native-paper";

import { CronPicker } from "./CronPicker";
import { FormInput } from "./FormInput";
import { MedicationPicker } from "./MedicationPicker";
import type { ReminderFormValues } from "./types";

import { useI18n, type Translator } from "@/common/i18n";
import { sty } from "@/common/styles";
import {
  type ReminderCreateData,
  type ReminderEditData,
} from "@/logic/medication";

type ReminderFormProps = {
  kind: "create" | "edit";
  initialValues: ReminderFormValues;
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
    <ScrollView style={sty.full}>
      <Formik
        initialValues={initialValues}
        validate={(v) => validate(v, t)}
        validateOnBlur={true}
        validateOnChange={false}
        onSubmit={(v) => {
          setStatus("pending");
          onCreateSubmit?.(deserializeCreate(v));
          onEditSubmit?.(deserializeEdit(v));
        }}
      >
        {(form) => (
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
              <MedicationPicker form={form} disabled={kind === "edit"} />
              <FormInput
                field="amountPerIntake"
                form={form}
                keyboardType="numeric"
                amountAffix
              />
              <FormInput
                field="amountOwned"
                form={form}
                keyboardType="numeric"
                amountAffix
              />
              <FormInput
                field="medicationAmountInPackage"
                form={form}
                keyboardType="numeric"
                disabled={kind === "edit"}
                amountAffix
              />
              {kind === "create" ? (
                <FormInput field="amountUnit" form={form} />
              ) : null}
              <CronPicker form={form} />
              <FormInput
                field="description"
                form={form}
                multiline
                style={styles.description}
              />
              <Button
                disabled={status === "pending"}
                loading={status === "pending"}
                mode="contained"
                onPress={() => form.handleSubmit()}
                style={styles.submit}
              >
                {submitText}
              </Button>
            </View>
          </TouchableWithoutFeedback>
        )}
      </Formik>
    </ScrollView>
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
    marginTop: 32,
  },
});

const parseNum = (value: string): number | null => {
  const num = parseInt(value, 10);
  return isNaN(num) ? null : num;
};

const deserializeCreate = (values: ReminderFormValues): ReminderCreateData => ({
  ...deserializeEdit(values),
  medicationName: values.medicationName,
  medicationAmountInPackage: parseNum(values.medicationAmountInPackage),
  amountUnit: values.amountUnit.trim().length > 0 ? values.amountUnit : null,
  cron: values.cron.trim().length > 0 ? values.cron : null,
  description: values.description.trim().length > 0 ? values.description : null,
});

const deserializeEdit = (values: ReminderFormValues): ReminderEditData => ({
  amountPerIntake: parseNum(values.amountPerIntake) ?? 0,
  amountOwned: parseNum(values.amountOwned),
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

  const medicationAmountInPackage = parseNum(values.medicationAmountInPackage);
  if (
    values.medicationAmountInPackage.trim().length > 0 &&
    (!medicationAmountInPackage || medicationAmountInPackage < 0)
  ) {
    errors.medicationAmountInPackage = t(
      "medication.form.medicationAmountInPackageNonnegative",
    );
  }

  const amountPerIntake = parseNum(values.amountPerIntake);
  if (!amountPerIntake || amountPerIntake <= 0) {
    errors.amountPerIntake = t("medication.form.amountPerIntakeRequired");
  }

  const amountOwned = parseNum(values.amountOwned);
  if (
    values.amountOwned.trim().length > 0 &&
    (!amountOwned || amountOwned < 0)
  ) {
    errors.amountOwned = t("medication.form.amountOwnedNonnegative");
  }

  return errors;
};
