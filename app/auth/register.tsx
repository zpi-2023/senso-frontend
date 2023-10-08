import { Link, Stack } from "expo-router";
import { Formik } from "formik";
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

interface IRegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}

const Page = () => {
  const theme = useTheme();

  const handleFormSubmit = (values: IRegisterForm) => {
    // TODO: Handle form submission, send data to backend API
    console.log({ submittingValues: values });
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
      onSubmit={handleFormSubmit}
      validate={(values) => {
        const errors: {
          email?: string;
          password?: string;
          confirmPassword?: string;
          phoneNumber?: string;
        } = {};
        if (!values.email) {
          errors.email = "Required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
          errors.email = "Invalid email address";
        }
        if (!values.password) {
          errors.password = "Required";
        } else if (values.password.length < 8) {
          errors.password = "Password must have at least 8 letters";
        }
        if (!values.confirmPassword) {
          errors.confirmPassword = "Required";
        } else if (values.confirmPassword !== values.password) {
          errors.confirmPassword = "Passwords do not match";
        }
        if (!/^[0-9]{9}$/.test(values.phoneNumber) && values.phoneNumber) {
          errors.phoneNumber = "Invalid phone number";
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
              <Stack.Screen options={{ title: "Register" }} />
              <Text variant="titleLarge" style={styles.title}>
                Create your Senso account
              </Text>
              <TextInput
                mode="outlined"
                label="Email"
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
                label="Password"
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
                label="Confirm Password"
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
                label="Phone Number (optional)"
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
                mode="contained"
                onPress={() => handleSubmit()}
                style={styles.submit}
              >
                Register
              </Button>
              <Text style={styles.submit}>
                Already have an account?{" "}
                <Link href="/auth/login" replace>
                  <Text style={{ color: theme.colors.primary }}>Sign in</Text>
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
