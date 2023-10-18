import { Stack } from "expo-router";
import { Appbar } from "react-native-paper";

import { Action, useActionContext } from "@/common/actions";

type ActionButtonProps = {
  action: Action;
};

const ActionButton = ({ action }: ActionButtonProps) => {
  const ctx = useActionContext();

  if (!ctx || !action.hidden?.(ctx)) {
    return null;
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
