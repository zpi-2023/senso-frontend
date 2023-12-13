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
import { AppRoutes } from "@/common/constants";
import { useI18n } from "@/common/i18n";
import { useIdentity, RedirectIfLoggedIn } from "@/common/identity";
import { useDeviceRegistration } from "@/common/notifications";
import { sty } from "@/common/styles";
import { useTheme } from "@/common/theme";
import { Header } from "@/components";

const Page = () => {
  const identity = useIdentity();
  const theme = useTheme();
  const { t } = useI18n();
  const obtainToken = useMutation("post", "/api/v1/account/token");
  const registerDevice = useDeviceRegistration();

  const [status, setStatus] = useState<"idle" | "pending" | "error">("idle");

  if (identity.isLoggedIn) {
    return <RedirectIfLoggedIn identity={identity} />;
  }

  const onSubmit = async (body: { email: string; password: string }) => {
    setStatus("pending");
    const res = await obtainToken({ body });
    if (res.error) {
      setStatus("error");
      return;
    }
    identity.logIn(res.data);
    registerDevice(res.data.token);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={sty.full}
      >
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
            <View style={sty.center}>
              <Header title={t("auth.login.pageTitle")} />
              <Text variant="titleLarge" style={styles.title}>
                {t("auth.login.description")}
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
              {status === "error" ? (
                <HelperText type="error" style={styles.errorMessage}>
                  {t("auth.login.badCredentials")}
                </HelperText>
              ) : null}
              <Button
                disabled={status === "pending"}
                mode="contained"
                onPress={() => handleSubmit()}
                style={styles.submit}
                loading={status === "pending"}
              >
                {t("auth.login.continueButton")}
              </Button>
              <Text style={styles.submit}>
                {t("auth.login.registerPrompt")}{" "}
                <Link href={AppRoutes.Register} replace>
                  <Text style={{ color: theme.colors.primary }}>
                    {t("auth.login.registerButton")}
                  </Text>
                </Link>
              </Text>
            </View>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
