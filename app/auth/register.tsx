import { Link, Stack } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
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
import { useIdentity, RedirectIfNotLoggedOut } from "@/common/identity";

interface IRegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}

const Page = () => {
  const identity = useIdentity();
  const theme = useTheme();
  const { t } = useI18n();

  const [status, setStatus] = useState<"idle" | "pending" | "error">("idle");

  if (identity.isLoggedIn) {
    return <RedirectIfNotLoggedOut identity={identity} />;
  }

  const onSubmit = async (values: IRegisterForm) => {
    const body = {
      ...values,
      // Empty string is not a valid value for phoneNumber, but null is.
      phoneNumber: values.phoneNumber ? values.phoneNumber : null,
    };
    setStatus("pending");
    const accountRes = await POST("/api/v1/account", { body });
    const tokenRes = await POST("/api/v1/token", { body });
    if (accountRes.error || tokenRes.error) {
      setStatus("error");
    } else {
      identity.logIn(tokenRes.data.token);
    }
  };

  return (
    <Formik
      initialValues={
        {
          email: "",
          password: "",
          confirmPassword: "",
          phoneNumber: "",
        } as IRegisterForm
      }
      onSubmit={onSubmit}
      validate={(values) => {
        const errors: {
          email?: string;
          password?: string;
          confirmPassword?: string;
          phoneNumber?: string;
        } = {};
        if (!values.email) {
          errors.email = t("auth.required");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
          errors.email = t("auth.badEmail");
        }
        if (!values.password) {
          errors.password = t("auth.required");
        } else if (values.password.length < 8) {
          errors.password = t("register.badPasswordLength", { length: 8 });
        }
        if (!values.confirmPassword) {
          errors.confirmPassword = t("auth.required");
        } else if (values.confirmPassword !== values.password) {
          errors.confirmPassword = t("register.passwordMismatch");
        }
        if (values.phoneNumber && !/^[0-9]{9}$/.test(values.phoneNumber)) {
          errors.phoneNumber = t("register.badPhoneNumber");
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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
              <Stack.Screen options={{ title: t("register.pageTitle") }} />
              <Text variant="titleLarge" style={styles.title}>
                {t("register.description")}
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
                autoCorrect={false}
                autoComplete="off"
              />
              {touched.password && errors.password && (
                <HelperText type="error" style={styles.errorMessage}>
                  {errors.password}
                </HelperText>
              )}
              <TextInput
                mode="outlined"
                label={t("register.confirmPassword")}
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                value={values.confirmPassword}
                style={styles.input}
                error={!!errors.confirmPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="off"
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <HelperText type="error" style={styles.errorMessage}>
                  {errors.confirmPassword}
                </HelperText>
              )}
              <TextInput
                mode="outlined"
                label={t("register.phoneNumber")}
                onChangeText={handleChange("phoneNumber")}
                onBlur={handleBlur("phoneNumber")}
                value={values.phoneNumber}
                style={styles.input}
                error={!!errors.phoneNumber}
                autoCapitalize="none"
              />
              {touched.phoneNumber && errors.phoneNumber && (
                <HelperText type="error" style={styles.errorMessage}>
                  {errors.phoneNumber}
                </HelperText>
              )}
              <Button
                disabled={status === "pending"}
                mode="contained"
                onPress={() => handleSubmit()}
                style={styles.submit}
              >
                {t("register.registerButton")}
              </Button>
              {status === "error" ? (
                <HelperText type="error" style={styles.errorMessage}>
                  {t("register.serverError")}
                </HelperText>
              ) : null}
              <Text style={styles.submit}>
                {t("register.loginPrompt")}{" "}
                <Link href="/auth/login" replace>
                  <Text style={{ color: theme.colors.primary }}>
                    {t("register.loginButton")}
                  </Text>
                </Link>
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
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
