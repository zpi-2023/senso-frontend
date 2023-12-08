import { Link } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";

import { useMutation } from "@/common/api";
import { AppRoutes, minDisplayNameLength } from "@/common/constants";
import { useI18n } from "@/common/i18n";
import { useIdentity, RedirectIfLoggedIn } from "@/common/identity";
import { useDeviceRegistration } from "@/common/notifications";
import { sty } from "@/common/styles";
import { useTheme } from "@/common/theme";
import { Header } from "@/components";

interface IRegisterForm {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}

const Page = () => {
  const identity = useIdentity();
  const theme = useTheme();
  const { t } = useI18n();
  const createAccount = useMutation("post", "/api/v1/account");
  const obtainToken = useMutation("post", "/api/v1/account/token");
  const registerDevice = useDeviceRegistration();

  const [status, setStatus] = useState<"idle" | "pending" | "error">("idle");

  if (identity.isLoggedIn) {
    return <RedirectIfLoggedIn identity={identity} />;
  }

  const onSubmit = async (values: IRegisterForm) => {
    const body = {
      ...values,
      // Empty string is not a valid value for phoneNumber, but null is.
      phoneNumber: values.phoneNumber ? values.phoneNumber : null,
    };
    setStatus("pending");
    const accountRes = await createAccount({ body });
    const tokenRes = await obtainToken({ body });
    if (accountRes.error || tokenRes.error) {
      setStatus("error");
      return;
    }
    identity.logIn(tokenRes.data);
    registerDevice(tokenRes.data.token);
  };

  return (
    <Formik
      initialValues={
        {
          displayName: "",
          email: "",
          password: "",
          confirmPassword: "",
          phoneNumber: "",
        } as IRegisterForm
      }
      onSubmit={onSubmit}
      validate={(values) => {
        const errors: {
          displayName?: string;
          email?: string;
          password?: string;
          confirmPassword?: string;
          phoneNumber?: string;
        } = {};
        if (!values.displayName) {
          errors.displayName = t("auth.required");
        } else if (values.displayName.length < minDisplayNameLength) {
          errors.displayName = t("auth.register.badDisplayNameLength", {
            length: minDisplayNameLength,
          });
        }
        if (!values.email) {
          errors.email = t("auth.required");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
          errors.email = t("auth.badEmail");
        }
        if (!values.password) {
          errors.password = t("auth.required");
        } else if (values.password.length < 8) {
          errors.password = t("auth.register.badPasswordLength", { length: 8 });
        }
        if (!values.confirmPassword) {
          errors.confirmPassword = t("auth.required");
        } else if (values.confirmPassword !== values.password) {
          errors.confirmPassword = t("auth.register.passwordMismatch");
        }
        if (values.phoneNumber && !/^[0-9]{9}$/.test(values.phoneNumber)) {
          errors.phoneNumber = t("auth.register.badPhoneNumber");
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
            <View style={sty.center}>
              <Header title={t("auth.register.pageTitle")} />
              <Text variant="titleLarge" style={styles.title}>
                {t("auth.register.description")}
              </Text>
              <TextInput
                mode="outlined"
                label={t("auth.displayName")}
                onChangeText={handleChange("displayName")}
                onBlur={handleBlur("displayName")}
                value={values.displayName}
                style={styles.input}
                error={!!errors.displayName}
              />
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
                label={t("auth.register.confirmPassword")}
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
                label={t("auth.register.phoneNumber")}
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
              {status === "error" ? (
                <HelperText type="error" style={styles.errorMessage}>
                  {t("auth.register.serverError")}
                </HelperText>
              ) : null}
              <Button
                disabled={status === "pending"}
                mode="contained"
                onPress={() => handleSubmit()}
                style={styles.submit}
                loading={status === "pending"}
              >
                {t("auth.register.registerButton")}
              </Button>
              <Text style={styles.submit}>
                {t("auth.register.loginPrompt")}{" "}
                <Link href={AppRoutes.Login} replace>
                  <Text style={{ color: theme.colors.primary }}>
                    {t("auth.register.loginButton")}
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

const styles = sty.create({
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
