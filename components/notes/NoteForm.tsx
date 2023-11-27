import { Formik, type FormikErrors } from "formik";
import { useState } from "react";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import {
  Button,
  Switch,
  TextInput,
  Text,
  HelperText,
} from "react-native-paper";

import { type Translator, useI18n } from "@/common/i18n";
import { sty } from "@/common/styles";
import { Icon } from "@/components";
import type { NoteEdit } from "@/logic/notes";

type NoteFormValues = Required<{
  [P in keyof NoteEdit]: NonNullable<NoteEdit[P]>;
}>;

type NoteFormProps = {
  initialValues: NoteEdit;
  onSubmit: (values: NoteEdit) => void;
  submitText: string;
};

export const NoteForm = ({
  initialValues,
  onSubmit,
  submitText,
}: NoteFormProps) => {
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
        onSubmit(deserialize(v));
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
            <TextInput
              mode="outlined"
              label={t("notes.form.title")}
              onChangeText={handleChange("title")}
              onBlur={handleBlur("title")}
              value={values.title}
              error={"title" in errors}
            />
            {touched.title && errors.title ? (
              <HelperText type="error">{errors.title}</HelperText>
            ) : null}
            <TextInput
              mode="outlined"
              label={t("notes.form.content")}
              onChangeText={handleChange("content")}
              onBlur={handleBlur("content")}
              value={values.content}
              error={"content" in errors}
              multiline
              style={styles.content}
            />
            {touched.content && errors.content ? (
              <HelperText type="error">{errors.content}</HelperText>
            ) : null}
            <View style={styles.switchWrapper}>
              <Icon icon="shield-lock" />
              <Text>{t("notes.form.isPrivate")}</Text>
              <Switch
                value={values.isPrivate}
                onValueChange={(v) => {
                  void setFieldValue("isPrivate", v);
                }}
                style={styles.switch}
              />
            </View>
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
  content: {
    minHeight: 100,
  },
  switchWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  switch: {
    marginLeft: "auto",
  },
  submit: {
    marginTop: "auto",
  },
});

const serialize = (values: NoteEdit): NoteFormValues => ({
  ...values,
  title: values.title ?? "",
});

const deserialize = (values: NoteFormValues): NoteEdit => ({
  ...values,
  title: (values.title?.trim().length ?? 0) > 0 ? values.title : null,
});

const validate = (
  values: NoteFormValues,
  t: Translator,
): FormikErrors<NoteFormValues> => {
  const errors: FormikErrors<NoteFormValues> = {};
  if (values.content.length === 0) {
    errors.content = t("notes.form.contentRequired");
  }
  if (values.title.length > 255) {
    errors.title = t("notes.form.titleTooLong");
  }
  return errors;
};
