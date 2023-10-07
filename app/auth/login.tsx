import { Link } from "expo-router";
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

const Page = () => {
  const theme = useTheme();

  const handleFormSubmit = (values: { email: string; password: string }) => {
    // TODO: Handle form submission, send data to backend API
    console.log(values);
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      onSubmit={handleFormSubmit}
      validate={(values) => {
        const errors: { email?: string; password?: string } = {};
        if (!values.email) {
          errors.email = "Required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
          errors.email = "Invalid email address";
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
            <Text variant="titleLarge" style={styles.title}>
              Login to your Senso account
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
            <HelperText
              type="error"
              visible={!!errors.email && touched.email}
              style={styles.errorMessage}
            >
              {errors.email}
            </HelperText>
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
            />
            <Button
              mode="contained"
              onPress={() => handleSubmit()}
              style={styles.submit}
            >
              Continue
            </Button>
            <Text style={styles.submit}>
              Don't have an account?{" "}
              <Link href="/auth/register" replace>
                <Text style={{ color: theme.colors.primary }}>Sign up</Text>
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
