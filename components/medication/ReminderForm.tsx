import {
  Formik,
  type FormikTouched,
  type FormikErrors,
  type FormikHandlers,
  type FormikHelpers,
} from "formik";
import { type ComponentProps, useState } from "react";
import {
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button, HelperText, Menu, TextInput } from "react-native-paper";

import { useDebounce, useQuery } from "@/common/api";
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

type MedicationInfo = {
  name: string;
  amountInPackage?: number | null;
  amountUnit?: string | null;
};

type FormProp = {
  values: ReminderFormValues;
  touched: FormikTouched<ReminderFormValues>;
  errors: FormikErrors<ReminderFormValues>;
  handleChange: FormikHandlers["handleChange"];
  handleBlur: FormikHandlers["handleBlur"];
  setFieldValue: FormikHelpers<ReminderFormValues>["setFieldValue"];
};

type FormInputProps = {
  field: keyof ReminderFormValues;
  form: FormProp;
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

type MedicationPickerProps = {
  selectMedication: (medication: MedicationInfo) => void;
  form: FormProp;
  disabled?: boolean;
};

const MedicationPicker = ({
  selectMedication,
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
              <MedicationPicker
                selectMedication={(medication) => {
                  void Promise.all([
                    form.setFieldValue("medicationName", medication.name),
                    form.setFieldValue(
                      "medicationAmountInPackage",
                      medication.amountInPackage?.toString() ?? "",
                    ),
                    form.setFieldValue(
                      "amountUnit",
                      medication.amountUnit ?? "",
                    ),
                  ]);
                }}
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
