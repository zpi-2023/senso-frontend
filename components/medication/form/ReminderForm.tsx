import { Formik } from "formik";
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
import { deserializeCreate, deserializeEdit, validate } from "./data";
import type { ReminderFormValues } from "./types";

import { useI18n } from "@/common/i18n";
import { sty } from "@/common/styles";
import type { ReminderCreateData, ReminderEditData } from "@/logic/medication";

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
