import {
  Formik,
  type FormikTouched,
  type FormikErrors,
  type FormikHandlers,
} from "formik";
import { type ComponentProps, useState } from "react";
import {
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";

import { useI18n, type Translator, type TranslationKey } from "@/common/i18n";
import { sty } from "@/common/styles";
import {
  type ReminderCreateData,
  type ReminderEditData,
} from "@/logic/medication";

type ReminderFormValues = {
  medicationName: string;
  medicationAmountInPackage: string;
  amountPerIntake: string;
  amountOwned: string;
  amountUnit: string;
  cron: string;
  description: string;
};

type FormInputProps = {
  field: keyof ReminderFormValues;
  form: {
    values: ReminderFormValues;
    touched: FormikTouched<ReminderFormValues>;
    errors: FormikErrors<ReminderFormValues>;
    handleChange: FormikHandlers["handleChange"];
    handleBlur: FormikHandlers["handleBlur"];
  };
  amountAffix?: boolean;
} & Partial<ComponentProps<typeof TextInput>>;

const FormInput = ({
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
        {({
          values,
          touched,
          errors,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => {
          const form = { values, touched, errors, handleChange, handleBlur };
          return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={styles.container}>
                <FormInput
                  field="medicationName"
                  form={form}
                  disabled={kind === "edit"}
                />
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
                <FormInput field="cron" form={form} />
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
                  onPress={() => handleSubmit()}
                  style={styles.submit}
                >
                  {submitText}
                </Button>
              </View>
            </TouchableWithoutFeedback>
          );
        }}
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
