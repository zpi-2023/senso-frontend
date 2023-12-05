import {
  type FormikTouched,
  type FormikErrors,
  type FormikHandlers,
  type FormikHelpers,
} from "formik";

export type ReminderFormValues = {
  medicationName: string;
  medicationAmountInPackage: string;
  amountPerIntake: string;
  amountOwned: string;
  amountUnit: string;
  cron: string;
  description: string;
};

export type MedicationInfo = {
  name: string;
  amountInPackage?: number | null;
  amountUnit?: string | null;
};

export type FormProp = {
  values: ReminderFormValues;
  touched: FormikTouched<ReminderFormValues>;
  errors: FormikErrors<ReminderFormValues>;
  handleChange: FormikHandlers["handleChange"];
  handleBlur: FormikHandlers["handleBlur"];
  setFieldValue: FormikHelpers<ReminderFormValues>["setFieldValue"];
};
