import { Link, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";

import { MonoText } from "@/components/StyledText";
import { BASE_URL, useApi, useAuth } from "@/util/api";

export const Landing = ({ debug = false }: { debug?: boolean }) => {
  const { data, isLoading, error, mutate } = useApi({ url: "/healthz" });
  const { token } = useAuth();

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  if (error || data?.server !== "Ok" || data?.database !== "Ok") {
    return (
      <>
        <Text variant="displayMedium">Error</Text>

        <Text style={styles.description}>We could not connect.</Text>
        <Button
          mode="contained"
          labelStyle={styles.button}
          onPress={() => mutate()}
        >
          Try again
        </Button>
        {debug ? (
          <>
            <MonoText style={styles.debug}>
              {new URL("/healthz", BASE_URL).toString()}
              {"\n"}
              {JSON.stringify(data)}
              {"\n"}
              {error?.toString()}
            </MonoText>
            {/* Escape hatch to let us test client without server in development */}
            <Link href="/profile/list" replace>
              <Button textColor="red">IGNORE</Button>
            </Link>
          </>
        ) : null}
      </>
    );
  }

  if (token) {
    // TODO: redirect if logged in
  }

  return (
    <>
      <Text variant="displayMedium">Senso</Text>

      <Text style={styles.description}>
        Your all-in-one senior companion app that assists with everyday tasks.
      </Text>
      <Link href="/auth/login" replace>
        <Button mode="contained" labelStyle={styles.button}>
          Let's get started
        </Button>
      </Link>
    </>
  );
};

const Page = () => {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Start" }} />
      <Landing debug={__DEV__} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 32,
  },
  description: {
    textAlign: "center",
    fontSize: 20,
    lineHeight: 28,
    paddingHorizontal: 32,
  },
  button: {
    fontSize: 20,
    lineHeight: 28,
  },
  debug: {
    backgroundColor: "#ffffaa",
    color: "#ff0000",
    textAlign: "center",
    padding: 8,
  },
});

export default Page;
