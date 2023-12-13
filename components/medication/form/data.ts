import type { FormikErrors } from "formik";

import type { ReminderFormValues } from "./types";

import type { Translator } from "@/common/i18n";
import { parseNum } from "@/common/parsing";
import type { ReminderCreateData, ReminderEditData } from "@/logic/medication";

export const deserializeCreate = (
  values: ReminderFormValues,
): ReminderCreateData => ({
  ...deserializeEdit(values),
  medicationName: values.medicationName,
  medicationAmountInPackage: parseNum(values.medicationAmountInPackage),
  amountUnit: values.amountUnit.trim().length > 0 ? values.amountUnit : null,
  cron: values.cron.trim().length > 0 ? values.cron : null,
  description: values.description.trim().length > 0 ? values.description : null,
});

export const deserializeEdit = (
  values: ReminderFormValues,
): ReminderEditData => ({
  amountPerIntake: parseNum(values.amountPerIntake) ?? 0,
  amountOwned: parseNum(values.amountOwned),
  cron: values.cron.trim().length > 0 ? values.cron : null,
  description: values.description.trim().length > 0 ? values.description : null,
});

export const validate = (
  values: ReminderFormValues,
  t: Translator,
): FormikErrors<ReminderFormValues> => {
  const errors: FormikErrors<ReminderFormValues> = {};
  if (values.medicationName.length === 0) {
    errors.medicationName = t("medication.form.medicationNameRequired");
  }

  const medicationAmountInPackage = parseNum(values.medicationAmountInPackage);
  if (
    values.medicationAmountInPackage.includes(".") ||
    values.medicationAmountInPackage.includes(",")
  ) {
    errors.medicationAmountInPackage = t(
      "medication.form.medicationAmountInPackageInteger",
    );
  } else if (
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
