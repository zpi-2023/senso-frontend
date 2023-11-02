import type { FC, PropsWithChildren } from "react";

export const ProviderList = ({
  providers,
  children,
}: PropsWithChildren<{
  providers: FC<{ children: JSX.Element }>[];
}>) => {
  const Current = providers[0];

  if (!Current) {
    return <>{children}</>;
  }

  return (
    <Current>
      <ProviderList providers={providers.slice(1)}>{children}</ProviderList>
    </Current>
  );
};
