import { ExpoRoot, useRouter } from "expo-router";
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

export const clearHistory = (
  router: ReturnType<typeof useRouter>,
  newRoot: string,
) => {
  while (router.canGoBack()) {
    router.back();
  }
  router.replace(newRoot);
};
