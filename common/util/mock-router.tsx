import { ExpoRoot } from "expo-router";
import { FC } from "react";

const mockContext = (context: Record<string, FC>) =>
  Object.assign((id: string) => ({ default: context[id] }), {
    keys: () => Object.keys(context),
    resolve: (key: string) => key,
    id: "",
  });

export const MockRouter = ({
  routes,
  initialRoute,
}: {
  routes: Record<string, FC>;
  initialRoute: string;
}) => (
  <ExpoRoot
    context={mockContext(routes)}
    location={new URL(initialRoute, "test://")}
  />
);
