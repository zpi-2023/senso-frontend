import { Stack, useRouter } from "expo-router";
import { Appbar } from "react-native-paper";

type HeaderProps = {
  left?: "back" | Parameters<typeof Appbar.Action>[0];
  title: string;
};

export const Header = ({ left, title }: HeaderProps) => {
  const router = useRouter();
  return (
    <Stack.Screen
      options={{
        header: () => (
          <Appbar.Header>
            {left === "back" && router.canGoBack() ? (
              <Appbar.BackAction onPress={() => router.back()} />
            ) : typeof left === "object" ? (
              <Appbar.Action {...left} />
            ) : null}
            <Appbar.Content title={title} />
          </Appbar.Header>
        ),
      }}
    />
  );
};
