import { Link, Stack } from "expo-router";
import { Formik } from "formik";
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  Button,
  HelperText,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

import { POST } from "@/common/api";
import { useI18n } from "@/common/i18n";
import { useIdentity, useRequireLoggedOut } from "@/common/identity";

const Page = () => {
  const identity = useIdentity();
  const theme = useTheme();
  const { t } = useI18n();

  useRequireLoggedOut();
  if (identity.isLoggedIn) {
    return null;
  }

  const onSubmit = (values: { email: string; password: string }) =>
    POST("/api/v1/token", { body: values }).then((resp) => {
      if (!resp.error) {
        identity.logIn(resp.data.token!); // TODO: Swagger should mark this as non-nullable
      }
    });

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      onSubmit={onSubmit}
      validate={(values) => {
        const errors: { email?: string; password?: string } = {};
        if (!values.email) {
          errors.email = t("auth.required");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
          errors.email = t("auth.badEmail");
        }
        if (!values.password) {
          errors.password = t("auth.required");
        }
        return errors;
      }}
      validateOnBlur={true}
      validateOnChange={false}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.container}>
            <Stack.Screen options={{ title: t("login.pageTitle") }} />
            <Text variant="titleLarge" style={styles.title}>
              {t("login.description")}
            </Text>
            <TextInput
              mode="outlined"
              label={t("auth.email")}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              style={styles.input}
              error={!!errors.email}
              autoCapitalize="none"
            />
            {touched.email && errors.email && (
              <HelperText type="error" style={styles.errorMessage}>
                {errors.email}
              </HelperText>
            )}
            <TextInput
              mode="outlined"
              label={t("auth.password")}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              style={styles.input}
              error={!!errors.password}
              secureTextEntry
              autoCapitalize="none"
            />
            {touched.password && errors.password && (
              <HelperText type="error" style={styles.errorMessage}>
                {errors.password}
              </HelperText>
            )}
            <Button
              mode="contained"
              onPress={() => handleSubmit()}
              style={styles.submit}
            >
              {t("login.continueButton")}
            </Button>
            <Text style={styles.submit}>
              {t("login.registerPrompt")}{" "}
              <Link href="/auth/register" replace>
                <Text style={{ color: theme.colors.primary }}>
                  {t("login.registerButton")}
                </Text>
              </Link>
            </Text>
          </View>
        </TouchableWithoutFeedback>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "80%",
    marginHorizontal: 132,
    marginVertical: 4,
  },
  errorMessage: {
    width: "80%",
    textAlign: "left",
    paddingVertical: 4,
  },
  title: {
    marginBottom: 16,
  },
  submit: {
    marginTop: 16,
  },
});

export default Page;
