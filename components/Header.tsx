import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { Appbar } from "react-native-paper";

import { View } from "./Themed";

import { type Action, useActionContext } from "@/common/actions";

type ActionButtonProps = {
  action: Action;
};

const ActionButton = ({ action }: ActionButtonProps) => {
  const ctx = useActionContext();

  if (!ctx || action.hidden?.(ctx)) {
    return <View style={styles.placeholder} />;
  }

  return (
    <Appbar.Action icon={action.icon} onPress={() => action.handler(ctx)} />
  );
};

type HeaderProps = {
  left?: Action;
  title: string;
  right?: Action;
};

export const Header = ({ left, title, right }: HeaderProps) => {
  return (
    <Stack.Screen
      options={{
        header: () => (
          <Appbar.Header>
            {left ? <ActionButton action={left} /> : null}
            <Appbar.Content title={title} />
            {right ? <ActionButton action={right} /> : null}
          </Appbar.Header>
        ),
      }}
    />
  );
};

const styles = StyleSheet.create({
  placeholder: {
    opacity: 0,
    padding: 8,
  },
});
